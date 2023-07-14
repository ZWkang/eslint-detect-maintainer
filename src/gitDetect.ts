export const DEFAULT_SEP = '||||';

export function generatorBlameFile(filename: string, line: number) {
  const text = `git --no-pager blame -L ${line.toString()},${line.toString()} ${filename}`;
  return text;
}

export function generatorShowLog(commitId: string) {
  return `git --no-pager log ${commitId} --pretty=format:'%an${DEFAULT_SEP}%ae${DEFAULT_SEP}%s'`;
}
