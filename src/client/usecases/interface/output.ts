import ProcessStatus from '../../model/processStatus';
export interface OutputGW {
  write(status: ProcessStatus): Promise<any>
}
