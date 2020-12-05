#!/usr/bin/env ts-node
import meow from 'meow';
import renderMarkdown, { renderString } from './src/termd';

const cli = meow(`
  Usage
    $ termd <filename>

  Options
    --string, -s  Use a string with markdown syntax

  Examples
    $ termd readme.md // # Heading 1
    ${renderString('# Heading 1')}
    $ termd -s "# Heading 1"
    ${renderString('# Heading 1')}

`);

try {
    if (cli.input[0]) {
        console.log(renderMarkdown(cli.input[0]));
    }

    if (cli.flags.s || cli.flags.string) {
        let optionString = (cli.flags.s as string) || (cli.flags.string as string);
        console.log(renderString(optionString));
    }
} catch (error) {
    console.log(error.message);
}
