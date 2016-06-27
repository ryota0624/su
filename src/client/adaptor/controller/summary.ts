import { SummaryUsecaseI } from '../../domain/usecase/summary';
import { configCreator } from './helper/index';
import { SutyClientConfig } from '../../domain/interface/loadTest';
import kernel from '../../inversify.config';
import presenter from '../presenter/summaryMetrics';

export default function summaryController(config: SutyClientConfig) {
  const timeStr = process.argv[3];
  const duration = Number(process.argv[4]);
  const splitTime = Number(process.argv[5]);
  const usecase = kernel.get<SummaryUsecaseI>("SummaryUsecaseI");
  usecase.run()
  .then(running => presenter(running, { duration, timeStr, splitTime, throughProps: [] }));
}
