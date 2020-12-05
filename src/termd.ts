import fs from 'fs';
import { resolve } from 'path';
import { toAst } from './utils';
import { transformer } from './transformer';
import { generator } from './generator';

const renderMarkdown = (filename: string) => {
    const md = fs.readFileSync(resolve(filename)).toString();
    const mdast = toAst(md);
    transformer(mdast);
    return generator(mdast);
};

export const renderString = (md: string): string => {
    const mdast = toAst(md);
    transformer(mdast);
    return generator(mdast);
};

export default renderMarkdown;
