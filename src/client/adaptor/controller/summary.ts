import { SummaryUsecaseI } from '../../domain/usecase/summary';
import { configCreator } from './helper/index';
import { SutyClientConfig } from '../../domain/interface/loadTest';
import kernel from '../../inversify.config';
import computerPresenter from '../presenter/summaryComputer';
import processPresenter from '../presenter/summaryProcess';
import defaultPresenter from '../presenter/summaryMetrics';


export default function summaryController(config: SutyClientConfig) {
  const [,,,timeStr, summaryType, duration, splitTime, o ] = process.argv;
  parametorCheck(timeStr, summaryType, duration, splitTime);
  const presenter = getPresenter(summaryType);
  const usecase = kernel.get<SummaryUsecaseI>("SummaryUsecaseI");
  usecase.run()
  .then(running => presenter(running, { duration: Number(duration), timeStr, splitTime: Number(splitTime), throughProps: [], fileopen: o === "open" ? true: false }));
}

function getPresenter(presenterName) {
  switch(presenterName) {
    case "process": return processPresenter;
    case "computer": return computerPresenter;
    default: return defaultPresenter;
  }
}

function parametorCheck(timeStr, summaryType, duration, splitTime) {
  if(timeStr && summaryType && duration && splitTime) {

  } else {
    throw new Error("引数が足りていません");
  }
}