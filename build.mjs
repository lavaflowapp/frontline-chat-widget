import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/widget.ts'],
  bundle: true,
  format: 'iife',
  globalName: 'FrontlineWidget',
  outfile: 'dist/widget.js',
  minify: !watch,
  sourcemap: watch,
  target: 'es2017',
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(buildOptions);
}
