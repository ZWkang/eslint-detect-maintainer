import { execa } from 'execa';
import type { Options as IExecaOptions, ExecaReturnValue as IExecaReturnValue } from 'execa';

export async function safeExeca(
  file: string,
  args: string[],
  options: IExecaOptions,
): Promise<IExecaReturnValue | never> {
  const result: IExecaReturnValue = await execa(file, args, { ...options, encoding: 'utf8' });
  return result;
}

export function removeLeftRightQuote(str: string) {
  return str.replace(/^['"]|['"]$/g, '');
}
