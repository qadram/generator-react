
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

let validator = require('./validator');

/**
* @param {import('yeoman-generator')} generator
* @param {Object} extensionConfig
*/
/**
 * Ask for extension id ("name" in package.json)
* @param {import('yeoman-generator')} generator
* @param {Object} extensionConfig
*/
exports.askForExtensionId = (generator, extensionConfig) => {
    let extensionName = generator.options['extensionName'];
    if (extensionName) {
        extensionConfig.name = extensionName;
        return Promise.resolve();
    }
    let def = extensionConfig.name;
    if (!def && extensionConfig.displayName) {
        def = extensionConfig.displayName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
    if (!def) {
        def = '';
    }

    return generator.prompt({
        type: 'input',
        name: 'name',
        message: 'What\'s the identifier of your extension?',
        default: def,
        validate: validator.validateExtensionId
    }).then(nameAnswer => {
        extensionConfig.name = nameAnswer.name;
    });
}

/**
* @param {import('yeoman-generator')} generator
* @param {Object} extensionConfig
*/
exports.askForGit = (generator, extensionConfig) => {
    return generator.prompt({
        type: 'confirm',
        name: 'gitInit',
        message: 'Initialize a git repository?',
        default: true
    }).then(gitAnswer => {
        extensionConfig.gitInit = gitAnswer.gitInit;
    });
}

/**
* @param {import('yeoman-generator')} generator
* @param {Object} extensionConfig
*/
exports.askForPackageManager = (generator, extensionConfig) => {
    extensionConfig.pkgManager = 'npm';
    return generator.prompt({
        type: 'list',
        name: 'pkgManager',
        message: 'Which package manager to use?',
        choices: [
            {
                name: 'npm',
                value: 'npm'
            },
            {
                name: 'yarn',
                value: 'yarn'
            }
        ]
    }).then(pckgManagerAnswer => {
        extensionConfig.pkgManager = pckgManagerAnswer.pkgManager;
    });
}