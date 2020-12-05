import fs from 'fs';
import { resolve } from 'path';
import { toAst } from './utils';
import { transformer } from './transformer';
import { generator } from './generator';

export const renderMarkdown = (filename: string) => {
    const md = fs.readFileSync(resolve(filename)).toString();

    const mdast = toAst(md);

    transformer(mdast);

    console.log(generator(mdast));
};
