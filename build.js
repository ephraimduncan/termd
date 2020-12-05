const fs = require('fs');
const { resolve } = require('path');

const file = resolve('index.ts');
const fileContents = fs.readFileSync(file, 'utf8');
const formatted = fileContents.replace(
    /#!\/usr\/bin\/env ts-node/g,
    '#!/usr/bin/env node'
);
fs.writeFileSync(file, formatted, 'utf8');

require('@vercel/ncc')(file, {
    cache: './custom/cache/path' | false,
    externals: ['externalpackage'],
    filterAssetBase: process.cwd(), // default
    minify: true, // default
    sourceMap: false, // default
    sourceMapBasePrefix: '../', // default treats sources as output-relative
    sourceMapRegister: true, // default
    watch: false, // default
    license: '', // default does not generate a license file
    v8cache: false, // default
    quiet: false, // default
    debugLog: false, // default
}).then(({ code }) => {
    fs.writeFileSync(resolve('./dist/index.js'), code, 'utf8');

    const fileContents = fs.readFileSync(file, 'utf8');
    const formatted = fileContents.replace(
        /#!\/usr\/bin\/env node/g,
        '#!/usr/bin/env ts-node'
    );
    fs.writeFileSync(file, formatted, 'utf8');

    console.log('Build Complete.');
});
