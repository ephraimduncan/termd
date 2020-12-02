#!/usr/bin/env ts-node

import fs from 'fs';
import axios from 'axios';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import traverser from 'unist-util-visit';
import { toAst, toMarkdown } from './utils';

marked.setOptions({
    renderer: new TerminalRenderer(),
});

const NPM_REGISTRY = 'https://registry.npmjs.org/';

const getPackageInfo = async (requiredPackage: string) => {
    const packageHTTPData = await axios.get(NPM_REGISTRY + requiredPackage);
    const packageData = packageHTTPData.data;
    const readme = packageData.readme;
    return readme;
};

const main = async () => {
    const readme = await getPackageInfo('chalk');
    fs.writeFile('readme.md', readme, (err) => {
        if (err) console.log(err);

        console.log('done');
    });
};

main();
