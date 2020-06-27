# rollup-federation

🍣 A Rollup plugin which enables consumption of [Federated Modules](https://webpack.js.org/concepts/module-federation/).

This plugin essentially reproduces the functionality of Webpack's [ContainerReferencePlugin](https://webpack.js.org/concepts/module-federation/#containerreferenceplugin-low-level) and [OverridablesPlugin](https://webpack.js.org/concepts/module-federation/#overridablesplugin-low-level).

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version (v8.0.0+) and Rollup v1.20.0+.

## Install

Using npm:

```console
npm install @module-federation/rollup-federation --save-dev
```

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
import federation from '@module-federation/rollup-federation';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'system'
  },
  plugins: [
    federation({
      remotes: {
        'foo': 'remote_foo'
      },
      shared: {
        lodash: '^4.17.0'
      }
    })
  ]
};
```

Import your remote:

```js
(async () => {
  const fooHello = await import('foo/hello');
  fooHello.default('world');
})();
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the [API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

### `remotes`

Type: `Object`<br>
Default: `null`

An `Object` that specifies the remotes that will be consumed.

```
remotes: {
  'import_name': 'import_alias'
}
```

### `shared`

Type: `Object`<br>
Default: `null`

An `Object` that specifies the shared dependencies.

```
shared: {
  lodash: '^4.17.0',
  react: {
    eager: true,
    singleton: true,
    requiredVersion: '16.13.1',
  },
  "react-dom": {
    eager: true,
    singleton: true,
    requiredVersion: '16.13.1',
  }
}
```
