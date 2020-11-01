/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

const prompts = require("./prompts");

module.exports = {
    id: 'ext-react-js',
    name: 'New React Web Application (JavaScript)',
    /**
     * @param {import('yeoman-generator')} generator
     * @param {Object} extensionConfig
     */
    prompting: async (generator, extensionConfig) => {
        await prompts.askForExtensionId(generator, extensionConfig);

        await prompts.askForGit(generator, extensionConfig);
        await prompts.askForPackageManager(generator, extensionConfig);



    },
    /**
     * @param {import('yeoman-generator')} generator
     * @param {Object} extensionConfig
     */
    writing: (generator, extensionConfig) => {
        generator.fs.copy(generator.sourceRoot() + '/public', 'public');
        generator.fs.copy(generator.sourceRoot() + '/src', 'src');

        if (extensionConfig.gitInit) {
            generator.fs.copy(generator.sourceRoot() + '/gitignore', '.gitignore');
        }

        if (extensionConfig.pkgManager === 'yarn') {
            generator.fs.copyTpl(generator.sourceRoot() + '/README.yarn.md', 'README.md', extensionConfig);
            generator.fs.copyTpl(generator.sourceRoot() + '/yarn.lock', 'yarn.lock', extensionConfig);
        }
        else {
            generator.fs.copyTpl(generator.sourceRoot() + '/README.md', 'README.md', extensionConfig);
            generator.fs.copyTpl(generator.sourceRoot() + '/package-lock.json', 'package-lock.json', extensionConfig);

        }
        generator.fs.copyTpl(generator.sourceRoot() + '/package.json', 'package.json', extensionConfig);
        generator.fs.copyTpl(generator.sourceRoot() + '/tsconfig.json', 'tsconfig.json', extensionConfig);

        extensionConfig.installDependencies = true;
    }
}
