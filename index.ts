#!/usr/bin/env ts-node
import meow from 'meow';
import chalk from 'chalk';
import renderMarkdown from './src/termd';

const { input } = meow(`
  Usage
    $ termd <filename>

  Examples
    $ termd readme.md

    ${chalk.bold.underline.red('Heading 1')}
`);

try {
    console.log(renderMarkdown(input[0]));
} catch (error) {
    console.log(error.message);
}
