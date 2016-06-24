import Process from '../../model/process';
import Computer from '../../model/computer';

export interface ReadServerlog {
  run(): Promise<{
    processes: Array<Process>
    computers: Array<Computer>
  }>;
}
