/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');

const path = require('path');
const env = require('./env');

const reactts = require('./generate-react-ts');
const reactjs = require('./generate-react-js');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.option('extensionType', { type: String });
        this.option('extensionName', { type: String });

        this.extensionConfig = Object.create(null);
        this.extensionConfig.installDependencies = false;

        this.extensionGenerator = undefined;

        this.abort = false;
    }

    async initializing() {
        const cliArgs = this.options['_'];

        // Welcome
        this.log(yosay('Welcome to the React generator!'));
    }

    async prompting() {
        const extensionGenerators = [
            reactts, reactjs
        ]

        // Ask for extension type
        const extensionType = this.options['extensionType'];
        if (extensionType) {
            const extensionTypeId = 'ext-' + extensionType;
            if (extensionGenerators.find(g => g.id === extensionTypeId)) {
                this.extensionConfig.type = extensionTypeId;
            } else {
                this.log("Invalid extension type: " + extensionType + '\nPossible types are: ' + extensionGenerators.map(g => g.id.substr(4)).join(', '));
                this.abort = true;
            }
        } else {
            const choices = [];
            for (const g of extensionGenerators) {
                const name = this.extensionConfig.insiders ? g.insidersName : g.name;
                if (name) {
                    choices.push({ name, value: g.id })
                }
            }
            this.extensionConfig.type = (await this.prompt({
                type: 'list',
                name: 'type',
                message: 'What type of extension do you want to create?',
                pageSize: choices.length,
                choices,
            })).type;

        }

        this.extensionGenerator = extensionGenerators.find(g => g.id === this.extensionConfig.type);
        try {
            await this.extensionGenerator.prompting(this, this.extensionConfig);
        } catch (e) {
            this.abort = true;
        }

    }
    // Write files
    writing() {
        if (this.abort) {
            return;
        }
        this.sourceRoot(path.join(__dirname, './templates/' + this.extensionConfig.type));

        return this.extensionGenerator.writing(this, this.extensionConfig);
    }

    // Installation
    install() {
        if (this.abort) {
            return;
        }
        if (this.extensionConfig.installDependencies) {
            this.installDependencies({
                yarn: this.extensionConfig.pkgManager === 'yarn',
                npm: this.extensionConfig.pkgManager === 'npm',
                bower: false
            });
        }
    }

    // End
    end() {
        if (this.abort) {
            return;
        }

        // Git init
        if (this.extensionConfig.gitInit) {
            this.spawnCommand('git', ['init', '--quiet']);
        }

        this.log('');

        //TODO: Dump the README.md to show the commands
        this.log('Your extension ' + this.extensionConfig.name + ' has been created!');
        this.log('');
        this.log('To start editing with Visual Studio Code, use the following commands:');
        this.log('');
        this.log('     cd ' + this.extensionConfig.name);
        this.log('     code .');
        this.log('');
        this.log('Open vsc-extension-quickstart.md inside the new extension for further instructions');
        this.log('on how to modify, test and publish your extension.');

        this.log('');

        if (this.extensionGenerator.endMessage) {
            this.extensionGenerator.endMessage(this, this.extensionConfig);
        }

        this.log('\r\n');
    }
}
