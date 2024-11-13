module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    // setupFiles: ['<rootDir>/tests/setup.ts'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/node_modules/**'],
    // moduleNameMapper: {
    //     '^@application/(.*)$': '<rootDir>/src/application/$1',
    //     '^@module/(.*)$': '<rootDir>/src/module/$1',
    //     '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    // },
};
