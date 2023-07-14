import { mapManagerBase } from './mapManagerBase';

class ReportManager extends mapManagerBase<{
  filePath: string;
  line: number;
  col: number;
  message: string;
}> {}

export default new ReportManager();
