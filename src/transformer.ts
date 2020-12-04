import chalk from 'chalk';
import terminalLink from 'terminal-link';
import traverser from 'unist-util-visit';
import { isMarkdownTable } from './utils';
import { createMarkdownArrayTable } from 'parse-markdown-table';
import Table from 'cli-table';
import cardinal from 'cardinal';
import { Node } from 'unist';

export const transformer = async (markdownAst: Node) => {
    traverser(markdownAst, (node, _, parent) => {
        if (node.type === 'paragraph') {
            switch ((parent as any).type) {
                case 'blockquote':
                    node.kind = 'blockquote';
                    break;
                case 'listItem':
                    node.kind = 'listItem';
                    break;
            }
        }

        if (node.type === 'text') {
            switch ((parent as any).type) {
                case 'heading':
                    switch ((parent as any).depth) {
                        case 1:
                            node.value = chalk.bold.underline.red(node.value);
                            break;
                        case 2:
                            node.value = chalk.cyan
                                .hex('#e78a4e')
                                .bold(node.value);
                            break;
                        case 3:
                            node.value = chalk.yellow.bold(node.value);
                            break;
                        case 4:
                            node.value = chalk.green.bold(node.value);
                            break;
                        case 5:
                            node.value = chalk.blue.bold(node.value);
                            break;
                        case 6:
                            node.value = chalk.magenta.bold(node.value);
                            break;
                    }
                    break;

                case 'link':
                    const link = terminalLink(
                        node.value as string,
                        (parent as any).url
                    );
                    node.value = chalk.blue(link);
                    break;

                case 'emphasis':
                    node.value = chalk.italic(node.value);
                    break;

                case 'strong':
                    node.value = chalk.bold(node.value);
                    break;

                case 'paragraph':
                    switch ((parent as any).kind) {
                        case 'blockquote':
                            node.value = '┃ ' + chalk.gray.italic(node.value);
                            break;

                        case 'listItem':
                            node.value = chalk.reset(node.value);
                            break;
                    }
            }
        }

        switch (node.type) {
            case 'image':
                const link = terminalLink(
                    node.alt as string,
                    node.url as string
                );
                node.value = chalk.gray.italic(`Image: ${link}`);
                node.type = 'text'; // May not be important
                break;

            case 'inlineCode':
                node.value = chalk.yellow(node.value);
                node.type = 'text';
                break;

            case 'thematicBreak':
                console.log(
                    chalk.reset('_'.repeat(process.stdout.columns) + '\n')
                );
                break;

            case 'code':
                const codeLang = node.lang
                    ? chalk.gray('// ' + node.lang + '\n')
                    : '\n';
                const supportedColorLanguages = ['js', 'ts', 'json'];
                node.value += '\n';
                if (supportedColorLanguages.includes((node as any).lang)) {
                    node.value = cardinal.highlight(node.value);
                } else {
                    node.value = chalk.gray(node.value);
                }

                console.log((codeLang as string) + (node.value as string));
                break;
        }

        if (node.type === 'text') {
            const renderText = async () => {
                if (isMarkdownTable(node.value as string)) {
                    const tableArray = await createMarkdownArrayTable(
                        node.value as string
                    );

                    let headers = [...tableArray.headers];

                    const table = new Table({
                        head: headers,
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
                        style: { compact: true, 'padding-left': 1 },
                    });

                    for await (let row of tableArray.rows) {
                        !row[0].includes('-') && table.push(row);
                    }

                    node.value = table.toString();
                }
            };
            renderText();
            setTimeout(() => {
                node.value += '\n';
                console.log(node.value);
            }, 100);
        }
    });
};
