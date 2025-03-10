module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.spec.ts$', 
  testEnvironment: 'node', 
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
 