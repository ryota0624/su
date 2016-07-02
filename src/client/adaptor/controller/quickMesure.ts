import { MesureUsecaseI } from '../../domain/usecase/mesure';
import { configCreator } from './helper/index';
import { SutyClientConfig } from '../../domain/interface/loadTest';
import kernel from '../../inversify.config';
import presenter from '../presenter/mesureMetrics';

export default function quickMesureController(config: SutyClientConfig) {
  const duration = process.argv[3];
  const rate = process.argv[4];
  argvError({ duration, rate });
  let testConfig: SutyClientConfig = configCreator(config.phases[0], config);
  testConfig.rate = Number(rate);
  testConfig.duration = Number(duration);
  const task: Array<SutyClientConfig> = [testConfig];
  const usecase = kernel.get<MesureUsecaseI>("MesureUsecaseI");
  usecase.run(task)
    .then(running => presenter(running));
}

function argvError({ rate, duration }) {
  if(!rate) {
    throw new Error("第2引数にrateが入力されていません")
  }
  if(!duration) {
    throw new Error("第1引数にdurationが入力されていません");
  }
}