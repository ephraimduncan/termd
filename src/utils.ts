import unified from 'unified';
import parser from 'remark-parse';
import stringify from 'remark-stringify';

export const toAst = (markdown: string) => {
    return unified().use(parser).parse(markdown);
};

export const toMarkdown = (node: any) => {
    return unified().use(stringify).stringify(node);
};

export const isMarkdownTable = (text: string) => {
    // https://github.com/erikvullings/slimdown-js/blob/master/src/slimdown.ts 125
    return /(\|[^\n]+\|\r?\n)((?:\|:?[-]+:?)+\|)(\n(?:\|[^\n]+\|\r?\n?)*)?/g.test(
        text
    );
};