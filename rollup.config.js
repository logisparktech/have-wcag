import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";

const production = !process.env.ROLLUP_WATCH;

// Shared plugins
const plugins = (outDir = "dist") => [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: "./tsconfig.json",
    declarationDir: outDir + "/types",
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions: ['.ts', '.js'],
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: "14",
          browsers: ["> 0.25%", "not dead", "ie 11"]
        }
      }]
    ]
  }),
  production && terser({
    compress: {
      passes: 2,           // Tells Terser to double-check code for optimizations
      drop_console: true,  // Removes ALL console.logs in production
      drop_debugger: true  // Removes debugger statements
    },
    format: {
      comments: false // strips out comments
    }
  }),
];

export default [
  // Main ESM build (widget + auditor)
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: plugins(),
  },

  // Main CommonJS build (widget + auditor)
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    plugins: plugins(),
  },

  // Widget only - ESM
  {
    input: "src/widget/index.ts",
    output: {
      file: "dist/widget.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: plugins(),
  },

  // Widget only - Browser bundle
  {
    input: "src/widget/index.ts",
    output: {
      file: "dist/widget.js",
      format: "iife",
      name: "HaveWcagWidget",
      sourcemap: true,
      exports: "named",
    },
    plugins: plugins(),
  },

  // Auditor only - ESM
  {
    input: "src/auditor/index.ts",
    output: {
      file: "dist/auditor.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: plugins(),
  },

  // Auditor only - Browser bundle
  {
    input: "src/auditor/index.ts",
    output: {
      file: "dist/auditor.js",
      format: "iife",
      name: "HaveWcagAuditor",
      sourcemap: true,
      exports: "named",
    },
    plugins: plugins(),
  },

  // Full bundle (auto-initializing)
  {
    input: "src/auto.ts",
    output: {
      file: "dist/bundle.js",
      format: "iife",
      name: "HaveWcag",
      sourcemap: true,
      exports: "named",
    },
    plugins: plugins(),
  },
];
