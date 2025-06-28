// lib/createModule.js

const path = require('path');
const fs = require('fs-extra');
const simpleGit = require('simple-git');
const os = require('os');
const chalk = require('chalk');

const TEMPLATE_REPO = 'https://github.com/elupianhez/cli';
const TEMPLATE_FOLDER = 'react/react-base-sample';

module.exports = async function createModule({ name, basePackage, displayName, category }) {
  const tempDir = path.join(os.tmpdir(), `template-${Date.now()}`);
  const destino = path.join(process.cwd(), name);

  console.log(chalk.blue('⏬ Cloning template repository...'));
  await simpleGit().clone(TEMPLATE_REPO, tempDir);

  const templatePath = path.join(tempDir, TEMPLATE_FOLDER);

  console.log(chalk.blue('📁 Copying files...'));
  await fs.copy(templatePath, destino);

  const replaceInFile = async (filePath, replacements) => {
    if (fs.existsSync(filePath)) {
      let content = await fs.readFile(filePath, 'utf8');
      for (const [pattern, value] of Object.entries(replacements)) {
        const regex = new RegExp(pattern, 'g');
        content = content.replace(regex, value);
      }
      await fs.writeFile(filePath, content);
    }
  };

  console.log(chalk.blue('🛠 Applying customizations...'));

  // Atualiza package.json
  await replaceInFile(path.join(destino, 'package.json'), {
    '"name":\\s*"[^"]+"': `"name": "${basePackage}.${name}"`,
    '"description":\\s*"[^"]+"': `"description": "${displayName}"`,
    '"javax\\.portlet\\.name":\\s*"[^"]+"': `"javax.portlet.name": "${name}"`,
    '"javax\\.portlet\\.display-name":\\s*"[^"]+"': `"javax.portlet.display-name": "${displayName}"`,
    '"com\\.liferay\\.portlet\\.display-category":\\s*"[^"]+"': `"com.liferay.portlet.display-category": "${category}"`
  });

  // Atualiza npmbundlerrc
  const npmbundlerPath = path.join(destino, '.npmbundlerrc');
  if (fs.existsSync(npmbundlerPath)) {
    const npmbundlerContent = await fs.readFile(npmbundlerPath, 'utf8');
    const npmbundlerJSON = JSON.parse(npmbundlerContent);

    // Atualiza o valor de web-context, se existir
    if (npmbundlerJSON['create-jar']?.features) {
      const sanitizedWebContext = '/' + name.replace(/^.*\./, '');
      npmbundlerJSON['create-jar'].features['web-context'] = sanitizedWebContext;
    }

    await fs.writeFile(
      npmbundlerPath,
      JSON.stringify(npmbundlerJSON, null, 2)
    );
  }

  console.log(chalk.green(`✅ The module "${name}" has been successfully created in ${destino}`));
};