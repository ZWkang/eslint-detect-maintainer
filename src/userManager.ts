import { mapManagerBase } from './mapManagerBase';

class UserManager extends mapManagerBase<{
  commitId: string;
  line: number;
  col: number;
  filePath: string;
}> {}

export default new UserManager();
