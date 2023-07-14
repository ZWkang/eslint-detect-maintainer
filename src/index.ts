import { cac } from 'cac';
import pkgJSON, { version, name } from '../package.json';
import updateNotifier from 'update-notifier';
import logger from './logger';
import { getEslintReportPrint } from './getEslintReport';

const notifier = updateNotifier({ pkg: pkgJSON });
const cli = cac(name);

function onErrorLogger(err: Error) {
  logger.error(err.message);
  return;
}

process.on('uncaughtException', onErrorLogger);
process.on('unhandledRejection', onErrorLogger);

cli
  .command('detect [text]', 'just detect git blame with eslint, category by user')
  .alias('d')
  .option('--include', 'include lint files path')
  .action((args, config) => {
    getEslintReportPrint({
      include: config?.include,
    });
  });

cli.version(version);
cli.help();
cli.parse();

notifier.notify();
