module.exports = {
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig-jest.json"
      }
    ]
  },
  testEnvironment: 'node',
};
