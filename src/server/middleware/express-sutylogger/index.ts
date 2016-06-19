import logger from './singlecore/singlecore';
import { clusterLogger } from './cluster/common';
module.exports = {
  logger,
  cluster: clusterLogger
}