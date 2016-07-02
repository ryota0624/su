import parentLogger from './parent';
import childLogger from './child';

import * as express from 'express';
import * as cluster from 'cluster';

export const messageType = {
  log: '__log__',
  off: '__off__',
  on: '__on__'
}
export function clusterLogger(filename: string) {
  return {
    parent: parentLogger(filename),
    child: childLogger(filename)
  }
}