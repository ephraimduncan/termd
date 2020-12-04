// In the generator, we will modify the AST first.
// Then call the generator on the new ast recursively
import { toAst } from './utils';
import { transformer } from './transformer';
import { Node } from 'unist';
import chalk from 'chalk';

// Transform the AST first
const md = `
[![Build Status](https://travis-ci.org/chalk/chalk.svg?branch=master)](https://travis-ci.org/chalk/chalk) [![Coverage Status](https://coveralls.io/repos/github/chalk/chalk/badge.svg?branch=master)](https://coveralls.io/github/chalk/chalk?branch=master) [![npm dependents](https://badgen.net/npm/dependents/chalk)](https://www.npmjs.com/package/chalk?activeTab=dependents) [![Downloads](https://badgen.net/npm/dt/chalk)](https://www.npmjs.com/package/chalk) [![](https://img.shields.io/badge/unicorn-approved-ff69b4.svg)](https://www.youtube.com/watch?v=9auOCbH5Ns4) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo) ![TypeScript-ready](https://img.shields.io/npm/types/chalk.svg) [![run on repl.it](https://repl.it/badge/github/chalk/chalk)](https://repl.it/github/chalk/chalk)
`;
const mdast = toAst(md);

transformer(mdast);
console.dir(mdast, { depth: null });

// Then call the generator on the new ast recursively
export const generator = (node: Node): string => {
    switch (node.type) {
        case 'root':
            return (node.children as [])
                .map((child: Node) => generator(child))
                .join('\n');

        case 'link':
        case 'strong':
        case 'emphasis':
        case 'heading':
            return (node.children as []).map((child: Node) => generator(child)).join(' ');

        case 'paragraph':
            return (
                (node.children as []).map((child: Node) => generator(child)).join(' ') +
                '\n'
            );

        case 'blockquote':
            return (node.children as [])
                .map((child: Node) => generator(child))
                .join('\n');

        case 'list':
            let returnNode;
            if (node.ordered) {
                returnNode = (node.children as []).map((child: Node, index) => {
                    let numberIndicator = chalk.bold.gray(index + 1 + '.');
                    return `${numberIndicator} ` + generator(child);
                });
            } else {
                returnNode = (node.children as []).map(
                    (child: Node) => `${chalk.bold.gray('-')} ` + generator(child)
                );
            }
            return returnNode.join('');

        case 'listItem':
            return (node.children as [])
                .map((child: Node) => {
                    if (child.type === 'list') {
                        child.tabed = true;
                        return '    ' + generator(child);
                    } else {
                        if (child.tabed) {
                            child.tabed = true;
                            return '    ' + generator(child);
                        } else {
                            return generator(child);
                        }
                    }
                })
                .join('');

        case 'image':
        case 'thematicBreak':
        case 'code':
        case 'text':
            return node.value as string;

        default:
            return '';
    }
};

console.log(generator(mdast));
