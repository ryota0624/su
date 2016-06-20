import logger from './singlecore/singlecore';
import { clusterLogger } from './cluster/common';
export default {
  singlecore: logger,
  cluster: clusterLogger
}