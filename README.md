# rollup-federation

🍣 A Rollup plugin which enables consumption of
[Federated Modules](https://webpack.js.org/concepts/module-federation/).

This plugin essentially reproduces the functionality of Webpack's
[ContainerReferencePlugin](https://webpack.js.org/concepts/module-federation/#containerreferenceplugin-low-level)
and
[OverridablesPlugin](https://webpack.js.org/concepts/module-federation/#overridablesplugin-low-level).

## Limitations

This is **not** full support for Module Federation, there are limitations:

-   Can not act as a container.
    -   This means you can not federate modules from Rollup to Webpack
-   Both the Rollup and Webpack container builds need to have the same target
    -   Has only been tested with
        [SystemJS](https://github.com/systemjs/systemjs)
    -   Should theoretically work with
        [AMD](https://requirejs.org/docs/whyamd.html#amd) as well, give it a try
        and provide feedback.

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version
(v8.0.0+) and Rollup v1.20.0+.

## Install

Using npm:

```console
npm install @module-federation/rollup-federation --save-dev
```

## Usage

Create a `rollup.config.js`
[configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and
import the plugin:

```js
import federation from '@module-federation/rollup-federation';

export default {
	input: 'src/index.js',
	output: {
		dir: 'output',
		format: 'system',
	},
	plugins: [
		federation({
			remotes: {
				foo: 'remote_foo',
			},
			shared: {
				lodash: '^4.17.0',
			},
		}),
	],
};
```

Import your remote:

```js
(async () => {
	const fooHello = await import('foo/hello');
	fooHello.default('world');
})();
```

Then call `rollup` either via the
[CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the
[API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

### `remotes`

Type: `Object`<br> Default: `null`

An `Object` that specifies the remotes that will be consumed.

```
remotes: {
  'import_name': 'import_alias'
}
```

### `shared`

Type: `Object`<br> Default: `null`

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

<img src="https://ssl.google-analytics.com/collect?v=1&t=event&ec=email&ea=open&t=event&tid=UA-120967034-1&z=1589682154&cid=ae045149-9d17-0367-bbb0-11c41d92b411&dt=RollupFederation&dp=/email/RollupFederation">
