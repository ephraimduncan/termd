// In the generator, we will modify the AST first.
// Then call the generator on the new ast recursively
import { toAst } from './utils';
import { transformer } from './transformer';
import { Node } from 'unist';

// Transform the AST first
const mdast = toAst('> Block');

console.dir(mdast, { depth: null });
transformer(mdast);

// Then call the generator on the new ast recursively
export const generator = (node: Node): string => {
    switch (node.type) {
        case 'root':
            return (node.children as [])
                .map((children) => generator(children))
                .join('\n');

        case 'heading':
            return (node.children as [])
                .map((children) => generator(children))
                .join(' ');

        case 'paragraph':
            return (
                (node.children as [])
                    .map((children) => generator(children))
                    .join(' ') + '\n'
            );

        case 'blockquote':
            return (node.children as [])
                .map((children) => generator(children))
                .join('\n');

        case 'thematicBreak':
        case 'code':
        case 'text':
            return node.value as string;

        default:
            return '';
    }
};

console.log(generator(mdast));
