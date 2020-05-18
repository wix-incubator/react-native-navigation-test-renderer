const jestPreset = require("@testing-library/react-native/jest-preset");
const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  transform: {
    ...tsjPreset.transform
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|react-native-navigation)"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  testRegex: "__tests__/.*\\.(test|spec)?\\.(ts|tsx)$",
  preset: "@testing-library/react-native",
  roots: ["src", "__tests__"],
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/"
  ],

  setupFiles: [...jestPreset.setupFiles, "./jest-setup.js"],
  setupFilesAfterEnv: ["@testing-library/react-native/cleanup-after-each"],
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  }
};
