/* eslint-disable consistent-return */

import virtual from '@rollup/plugin-virtual';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';

/** @typedef {{ [key:string]: string }} FederatedRemotes */

/**
 * @typedef {object} FederationOptions
 * @property {string} name
 * @property {FederatedRemotes} remotes
 */

/**
 * @param {FederationOptions} options
 */
export default function federation(options) {
  const sourceMap = typeof options.sourceMap !== 'undefined' ? options.sourceMap : true;
  const providedRemotes = options.remotes || {};
  /** @type {Array<{ id: string, config: any }>} */
  const remotes = [];
  Object.keys(providedRemotes).forEach((id) => {
    remotes.push(Object.assign({}, { id, config: providedRemotes[id] }));
  });

  const virtualMod = virtual({
    __federation__: `const remotesMap = {
  ${remotes
    .map(
      (remote) => `[${JSON.stringify(remote.id)}]: () => import(${JSON.stringify(remote.config)})`
    )
    .join(',\n  ')}
};
export default {
  ensure: (remoteId) => {
    return remotesMap[remoteId]();
  }
};`
  });

  return {
    name: 'federation',

    resolveId(source, importer) {
      const v = virtualMod.resolveId(source, importer);
      if (v) {
        return v;
      }
    },

    load: virtualMod.load,

    transform(code) {
      let ast = null;
      try {
        ast = this.parse(code);
      } catch (err) {
        // bypass
      }
      if (!ast) {
        return null;
      }

      const magicString = new MagicString(code);
      let requiresRuntime = false;

      walk(ast, {
        enter(node) {
          if (node.type === 'ImportExpression') {
            if (node.source && node.source.value) {
              const moduleId = node.source.value;
              const remote = remotes.find((r) => moduleId.startsWith(r.id));

              if (remote) {
                requiresRuntime = true;
                const modName = `.${moduleId.slice(remote.id.length)}`;

                magicString.overwrite(
                  node.start,
                  node.end,
                  `__federation__.ensure(${JSON.stringify(
                    remote.id
                  )}).then((remote) => remote.get(${JSON.stringify(
                    modName
                  )})).then((factory) => factory())`
                );
              }
            }
          }
        }
      });

      if (requiresRuntime) {
        magicString.prepend(`import __federation__ from '__federation__';\n\n`);
      }

      return {
        code: magicString.toString(),
        map: sourceMap ? magicString.generateMap({ hires: true }) : null
      };
    }
  };
}
