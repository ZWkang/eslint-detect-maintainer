import { ESLint } from 'eslint';

import reportManager from './reportManager';
import { DEFAULT_SEP, generatorBlameFile, generatorShowLog } from './gitDetect';
import { execaCommand } from 'execa';
import userManager from './userManager';
import { removeLeftRightQuote } from './util';
import logger from './logger';

export type eslintReportConfig = ESLint.Options & {
  include?: string[];
};

export async function getEslintReport(props: eslintReportConfig = {}) {
  const val = new ESLint({
    useEslintrc: true,
    fix: false,
    cwd: process.cwd(),
    ignore: true,
    ...props,
  });
  const lintFiles = await val.lintFiles(props.include || ['**/*']);

  for (const eslintItem of lintFiles) {
    if (eslintItem.messages.length > 0) {
      for (const message of eslintItem.messages) {
        reportManager.addMapItem(eslintItem.filePath, {
          filePath: eslintItem.filePath,
          line: message.line,
          col: message.column,
          message: message.message,
        });
      }
    }
  }
  const fileKeys = Array.from(reportManager.map.keys());
  for (const key of fileKeys) {
    const reportsVal = reportManager.map.get(key)!;
    for (const reportItem of reportsVal) {
      const { line, col, filePath } = reportItem;
      const command = generatorBlameFile(key, line);
      const { stdout } = await execaCommand(`${command}`, {
        stdin: 'inherit',
        stderr: 'ignore',
      });
      const [item] = await parseBlameResult(stdout);
      if (!item) continue;
      userManager.addMapItem(item.user, {
        commitId: item.commitId,
        line: line,
        col,
        filePath: filePath,
      });
    }
  }
  const result = Object.fromEntries(userManager.map.entries());
  userManager.map.clear();
  reportManager.map.clear();
  return result;
}

const commitIdSplit = /^\^([a-zA-Z0-9]*)?\s/;

export async function parseBlameResult(result: string) {
  const lines = result.split('\n');

  const data: {
    commitId: string;
    user: string;
    time: string;
    commitMessage: string;
  }[] = [];

  for (const line of lines) {
    const [, commitId] = commitIdSplit.exec(line) || [];
    if (!commitId) {
      continue;
    }

    const gitCommand = generatorShowLog(commitId);
    const { stdout } = await execaCommand(`${gitCommand}`, {});
    const [user, email, commitMessage] = removeLeftRightQuote(stdout).split(DEFAULT_SEP);
    data.push({
      commitId,
      user,
      time: '',
      commitMessage,
    });
  }
  return data;
}

function printIndentText(text: string) {
  logger.warn(`  ${text}`);
}

export async function getEslintReportPrint(props: eslintReportConfig = {}) {
  const result = await getEslintReport(props);
  Object.keys(result).forEach((key) => {
    logger.success(`User: ${key}, Total unresolved eslint problem: ${result[key].length}`);
    result[key].forEach((item) => {
      printIndentText(`CommitId: ${item.commitId}, FilePath: ${item.filePath}:${item.line}:${item.col}}`);
    });
  });
}
