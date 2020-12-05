import { Node } from 'unist';
import chalk from 'chalk';

export const generator = (node: Node): string => {
    switch (node.type) {
        case 'root':
            return (node.children as any)
                .map((child: Node) => generator(child))
                .join('\n');

        case 'link':
        case 'strong':
        case 'emphasis':
        case 'heading':
            return (node.children as any)
                .map((child: Node) => generator(child))
                .join(' ');

        case 'paragraph':
            return (
                (node.children as any).map((child: Node) => generator(child)).join(' ') +
                '\n'
            );

        case 'blockquote':
            return (node.children as any)
                .map((child: Node) => generator(child))
                .join('\n');

        case 'list':
            let returnNode;
            if (node.ordered) {
                returnNode = (node.children as any).map((child: Node, index: number) => {
                    let numberIndicator = chalk.bold.gray(index + 1 + '.');
                    return `${numberIndicator} ` + generator(child);
                });
            } else {
                returnNode = (node.children as any).map(
                    (child: Node) => `${chalk.bold.gray('-')} ` + generator(child)
                );
            }
            return returnNode.join('');

        case 'listItem':
            return (node.children as any)
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
