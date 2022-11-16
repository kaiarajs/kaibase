#!/usr/bin/env node
import { Command } from 'commander';
import { main } from './index';

const program = new Command();


program
    .name('Kaibase')
    .description('CLI')
    .version('0.0.1');

program.command('start')
    .description('Start kaibase server app')
    .action(() => {
        main()
    });

program.parse();