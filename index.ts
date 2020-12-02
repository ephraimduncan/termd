#!/usr/bin/env ts-node

import fs from 'fs';
import axios from 'axios';
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import traverser from 'unist-util-visit';
import { toAst, toMarkdown } from './utils';
import { brotliCompress } from 'zlib';

const markdownAst = toAst(`
******
`);

console.dir(markdownAst, { depth: null });
// console.log(toMarkdown(markdownAst));

traverser(markdownAst, (node, index, parent) => {
    if (node.type === 'text') {
        switch ((parent as any).type) {
            case 'heading':
                if ((parent as any).depth === 1) {
                    node.value = chalk.bold.underline.magenta(node.value);
                } else {
                    node.value = chalk.green.bold(node.value);
                }
                break;

            case 'link':
                const link = terminalLink(
                    node.value as string,
                    (parent as any).url
                );
                node.value = chalk.blue(link);
                break;
        }
    }
    switch (node.type) {
        case 'inlineCode':
            let a = (parent?.children[index - 1].value as string)
                .trim()
                .split('\n');
            a.push(node.value as string);
            console.log(a.join(' '));
            // console.log(node.value);
            break;

        case 'thematicBreak':
            console.log(chalk.reset('═'.repeat(process.stdout.columns)));
            break;

        case 'text':
            node.value += '\n';
            console.log(node.value);
            break;

        case 'code':
            const blockCodeData = '// ' + node.lang + '\n';
            console.log(blockCodeData + node.value);
            break;
    }
});
