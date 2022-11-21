#!/usr/bin/env node
import { Command } from 'commander';
import { main } from './index';
import pkg from '../package.json';

const program = new Command();


program
    .name('Kaibase')
    .description('CLI')
    .version(pkg.version);

program.command('start')
    .description('Start kaibase server')
    .option('--use-apikey', 'use api key auth (load from env API_KEY=key)')
    .action((options) => {
        main(options)
    });

program.parse();