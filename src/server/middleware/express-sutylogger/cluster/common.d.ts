import * as express from 'express';
import * as cluster from 'cluster';
export declare const messageType: {
    log: string;
    off: string;
    on: string;
};
export declare function clusterLogger(filename: string): {
    parent: (workers: cluster.Worker[]) => void;
    child: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
};
