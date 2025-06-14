import { readFileSync } from 'node:fs';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const packageJson = JSON.parse(
   readFileSync('./package.json', 'utf8'),
);

const externals = [
   ...Object.keys(packageJson.dependencies || {}),
   ...Object.keys(packageJson.peerDependencies || {}),
];

const baseConfig = {
   input: 'src/index.ts',
   external: externals,
   plugins: [resolve(), commonjs(), json()],
};

const esmConfig = {
   ...baseConfig,
   output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
   },
   plugins: [
      ...baseConfig.plugins,
      typescript({
         tsconfig: './tsconfig.json',
         sourceMap: true,
         outDir: 'dist/esm',
         declaration: false,
      }),
      terser(),
   ],
};

const cjsConfig = {
   ...baseConfig,
   output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      interop: 'auto',
      esModule: false,
   },
   plugins: [
      ...baseConfig.plugins,
      typescript({
         tsconfig: './tsconfig.cjs.json',
         sourceMap: true,
         outDir: 'dist/cjs',
         declaration: false,
      }),
      terser(),
   ],
};

// Cấu hình để tạo các tệp định nghĩa kiểu (d.ts)
const dtsConfig = {
   input: 'src/index.ts',
   output: {
      file: 'dist/types/index.d.ts',
      format: 'es',
   },
   plugins: [dts()],
};

export default [esmConfig, cjsConfig, dtsConfig];
