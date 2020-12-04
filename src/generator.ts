// In the generator, we will modify the AST first.
// Then call the generator on the new ast recursively
import { toAst } from './utils';
import { transformer } from './transformer';
import { Node } from 'unist';
import chalk from 'chalk';

// Transform the AST first
const md = `
1. a
1. b
1. c

* a
* b
* \`inline in list\`

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

        case 'thematicBreak':
        case 'code':
        case 'text':
            return node.value as string;

        default:
            return '';
    }
};

console.log(generator(mdast));
