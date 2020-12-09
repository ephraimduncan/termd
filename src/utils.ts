import unified from 'unified';
import parser from 'remark-parse';
import stringify from 'remark-stringify';
import marktable from 'marktable';
import Table from 'cli-table';
import Axios from 'axios';
import highlight from 'prism-cli';

export const toAst = (markdown: string) => {
    return unified().use(parser).parse(markdown);
};

export const toMarkdown = (node: any) => {
    return unified().use(stringify).stringify(node);
};

export const isMarkdownTable = (text: string) => {
    // https://github.com/erikvullings/slimdown-js/blob/master/src/slimdown.ts 125
    return /(\|[^\n]+\|\r?\n)((?:\|:?[-]+:?)+\|)(\n(?:\|[^\n]+\|\r?\n?)*)?/g.test(text);
};

export const prettifyTable = (mdt: string): string => {
    let parsedTable: string = marktable(mdt);

    let tableArray = parsedTable
        .trim()
        .split('\n')
        .map((s) =>
            s
                .split('|')
                .filter((c) => !c.includes('-'))
                .filter((d) => /\s+/.test(d))
        )
        .filter((e) => e.length > 1);

    const table = new Table({
        head: tableArray.shift(),
        chars: {
            top: '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            bottom: '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            left: '║',
            'left-mid': '╟',
            mid: '─',
            'mid-mid': '┼',
            right: '║',
            'right-mid': '╢',
            middle: '│',
        },
    });

    tableArray.forEach((e) => {
        table.push(e);
    });

    return table.toString();
};

export const getMarkdownFromUrl = async (url: string): Promise<any> => {
    const requestData = await Axios.get(url);
    return requestData.data;
};

export const npmPackageUrl = (packageName: string): string => {
    const NPM_REGISTRY = 'https://registry.npmjs.com/';

    return NPM_REGISTRY + packageName;
};

export const githubReadmeUrl = (repoName: string): string => {
    const GITHUB_URL = `https://api.github.com/repos/${repoName}/readme`;
    return GITHUB_URL;
};

export const highlightWithPrism = (code: string, language: string): string => {
    return highlight(code, language, {
        colors: {
            comment: '\x1B[38;2;107;114;128m',
            prolog: '\x1B[38;2;107;114;128m',
            doctype: '\x1B[38;2;107;114;128m',
            cdata: '\x1B[38;2;107;114;128m',
            punctuation: '\x1B[38;2;153;153;153m',
            property: '\x1B[38;2;153;0;85m',
            tag: '\x1B[38;2;153;0;85m',
            boolean: '\x1B[38;2;153;0;85m',
            number: '\x1B[38;2;153;0;85m',
            constant: '\x1B[38;2;153;0;85m',
            symbol: '\x1B[38;2;153;0;85m',
            deleted: '\x1B[38;2;153;0;85m',
            selector: '\x1B[38;2;16;185;129m',
            'attr-name': '\x1B[38;2;16;185;129m',
            string: '\x1B[38;2;16;185;129m',
            char: '\x1B[38;2;16;185;129m',
            builtin: '\x1B[38;2;16;185;129m',
            inserted: '\x1B[38;2;16;185;129m',
            operator: '\x1B[38;2;154;110;58m',
            entity: '\x1B[38;2;154;110;58m',
            url: '\x1B[38;2;154;110;58m',
            atrule: '\x1B[38;2;96;165;250m',
            'attr-value': '\x1B[38;2;96;165;250m',
            keyword: '\x1B[38;2;96;165;250m',
            function: '\x1B[38;2;221;74;104m',
            'class-name': '\x1B[38;2;221;74;104m',
            regex: '\x1B[38;2;238;153;0m',
            important: '\x1B[38;2;238;153;0m',
            variable: '\x1B[38;2;238;153;0m',
        },
    });
};
