import * as cluster from 'cluster';
declare const parentLogger: (filename: string) => (workers: cluster.Worker[]) => void;
export default parentLogger;
