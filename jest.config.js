module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            diagnostics: false,
        }],
    },
    transformIgnorePatterns: [
        '/node_modules/(?!flat)/', // Exclude modules except 'flat' from transformation
    ],
};