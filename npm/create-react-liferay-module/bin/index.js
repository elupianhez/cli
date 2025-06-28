#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const createModule = require('../lib/createModule');

const program = new Command();

program
  .name('create-react-liferay-module')
  .description('CLI to generate a new React module based on a Liferay template')
  .arguments('[name] [basePackage] [displayName] [category]')
  .action(async (name, basePackage, displayName, category) => {
    if (!name || !basePackage || !displayName || !category) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Module name (ex: react-teste):',
          validate: (input) => input ? true : 'Name is required'
        },
        {
          type: 'input',
          name: 'basePackage',
          message: 'Base package (ex: br.com.sompo):',
          default: 'br.com.sompo',
          validate: (input) => input ? true : 'Base package is required'
        },
        {
          type: 'input',
          name: 'displayName',
          message: 'Module display name:',
          default: 'Meu Módulo React',
          validate: (input) => input ? true : 'Module display name is required'
        },
        {
          type: 'input',
          name: 'category',
          message: 'Portlet category (ex: SAMPLE):',
          default: 'SAMPLE',
          validate: (input) => input ? true : 'Category is required'
        }
      ]);

      createModule(answers);
    } else {
      createModule({ name, basePackage, displayName, category });
    }
  });

program.parse();