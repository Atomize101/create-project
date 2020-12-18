import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
	return copy(options.templateDirectory, options.targetDirectory, {
		clobber: false,
	});
}

export async function createProject(options) {
	options = {
		...options,
		targetDirectory: options.targetDirectory || process.cwd(),
	};
	let currentFileUrl = import.meta.url;
	currentFileUrl = currentFileUrl.replace('file:///', '');
	const templateDir = path.resolve(currentFileUrl, '../../templates', options.template.toLowerCase());
	options.templateDirectory = templateDir;

	try {
		await access(templateDir, fs.constants.R_OK);
	} catch (err) {
		console.error('%s Invalid Template name', chalk.red.bold('ERROR'));
		process.exit(1);
	}
	console.log('Copy project files');
	await copyTemplateFiles(options);

	console.log('%s Projeect ready', chalk.green.bold('DONE'));
	return true;
}
