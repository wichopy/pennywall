#!/usr/bin/env node

const program = require('commander');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');


function log(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

function build(themeName, params) {
  const themePath = path.join('themes', themeName);
  const index = path.join(themePath, 'index.hbs');
  const css = path.join(themePath, 'index.css');

  const theme = fs.readFileSync(index).toString();
  const template = handlebars.compile(theme);
  const html = template(params);

  const outPath = 'build';
  log('generating assets into', outPath);
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath, { recursive: true });
  }
  fs.writeFileSync(path.join(outPath, 'index.html'), html);
  fs.copyFileSync(css, path.join(outPath, 'index.css'));
}

program
  .version('0.0.1')
  .command('build <theme> [optional]')
  .description('build pennywall')
  .option('-k, --apiKey', 'QUID API Key')
  .option('--title [title]', 'Page title')
  .action((theme, _, options) => {
    build(theme, {
      title: (options && options.title) || 'No title',
    });
  });

program.parse(process.argv); // notice that we have to parse in a new statement.
