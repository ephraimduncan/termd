#!/usr/bin/env ts-node
import meow = require('meow');
import renderMarkdown, { renderString } from './src/termd';
import { getMarkdownFromUrl, githubReadmeUrl, npmPackageUrl } from './src/utils';

const cli = meow(`
  Usage
    $ termd <filename>

  Options
    --string, -s    Use a string with markdown syntax
    --url, -u       Render markdown from url in the terminal
    --npm, -n       Render npm package readme in the terminal
    --github, -g    Render github repository readme in the terminal

  Examples
    $ termd readme.md // # Heading 1
    ${renderString('# Heading 1')}
    $ termd -s "# Heading 1"
    ${renderString('# Heading 1')}
    $ termd --url="https://gist.githubusercontent.com/dephraiim/..."
    ${renderString('# Heading 1')}
    $ termd -n termd
    ...

    $ termd --github="dephraiim/termd"
    ...
`);

try {
    if (cli.input[0]) {
        console.log(renderMarkdown(cli.input[0]));
    }

    if (cli.flags.s || cli.flags.string) {
        let optionString = (cli.flags.s as string) || (cli.flags.string as string);
        console.log(renderString(optionString));
    }

    if (cli.flags.u || cli.flags.url) {
        let url = (cli.flags.u as string) || (cli.flags.url as string);
        getMarkdownFromUrl(url)
            .then((string) => console.log(renderString(string)))
            .catch((e) => {
                throw new Error(e);
            });
    }

    if (cli.flags.n || cli.flags.npm) {
        let packageName = (cli.flags.n as string) || (cli.flags.npm as string);
        let packageUrl = npmPackageUrl(packageName);
        getMarkdownFromUrl(packageUrl)
            .then((data) => data.readme)
            .then((readme) => console.log(renderString(readme)))
            .catch((e) => {
                throw new Error(e);
            });
    }

    if (cli.flags.g || cli.flags.github) {
        let repoName = (cli.flags.github as string) || (cli.flags.g as string);
        let repoUrl = githubReadmeUrl(repoName);
        getMarkdownFromUrl(repoUrl)
            .then((data) => data.content)
            .then((data64) => {
                let buffer = Buffer.from(data64, 'base64');
                return buffer.toString('utf-8');
            })
            .then((readme) => console.log(renderString(readme)))
            .catch((e) => {
                throw new Error(e);
            });
    }
} catch (error) {
    console.log(error.message);
}
