import { test } from 'uvu';
import * as assert from 'uvu/assert';

import federation from '../src';
import { rollup } from 'rollup';

import { join } from 'path';

test('basic::run', async () => {
	const build = await rollup({
		output: join(__dirname, './fixtures/basic/dist/'),
		input: join(__dirname, './fixtures/basic/index.js'),

		plugins: [
			federation({
				remotes: {},
				exposes: {
					'./myString': './myString.js',
				},
			}),
		],
	});

	const stats = await build.generate({
		format: 'cjs',
	});

	assert.equal(stats.output.length, 3);
});

test.run();
