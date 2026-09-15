// This file is .cjs (not .js) on purpose: package.json has "type": "module",
// which makes plain .js files ES modules, but Jest loads its config with
// require(), which only understands CommonJS. See TASK5_TS_JEST.md.

/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  // Our code touches the DOM (document.createElement, localStorage, etc.),
  // so we need the jsdom environment, not the plain "node" one.
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
  // Our source files import each other with a ".js" ending (required for
  // the browser's native ES modules), but the real files on disk are
  // ".ts". This tells Jest to strip ".js" back off before resolving, so
  // e.g. "../store.js" finds "../store.ts".
  moduleNameMapper: {
    // The "@utils" / "@components/*" aliases below have to be matched
    // here too, using the same mapping as "paths" in tsconfig.json —
    // tsconfig only tells the type checker about them, it doesn't make
    // Jest (or a browser) able to actually resolve them.
    "^@utils$": "<rootDir>/src/utils.ts",
    "^@components/(.*)\\.js$": "<rootDir>/src/components/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        // The app's tsconfig targets ES2020 modules for the browser.
        // Jest runs on CommonJS, so tests get their own module setting.
        tsconfig: { module: "CommonJS" }
      }
    ]
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/tests/**",
    "!src/app.ts",
    "!src/types.ts"
  ]
};
