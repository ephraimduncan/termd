#!/usr/bin/env ts-node

import { toAst } from './src/utils';
import { transformer } from './src/transformer';

const mdast = toAst('> Hello');
transformer(mdast);
