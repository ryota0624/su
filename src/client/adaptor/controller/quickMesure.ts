import { MesureUsecaseI } from '../../domain/usecase/mesure';
import { configCreator } from './helper/configCreator';
import { SutyClientConfig } from '../../domain/interface/loadTest';
import { configCheck } from './helper/configCheck';

import kernel from '../../inversify.config';
import presenter from '../presenter/mesureMetrics';

export default function quickMesureController(config: SutyClientConfig) {
  configCheck(config);
  const duration = process.argv[3];
  const rate = process.argv[4];
  const target = process.argv[5];
  argvError({ duration, rate, target });
  const date = (new Date).getTime();
  const phase = {
    duration: Number(duration),
    arrivalRate: Number(rate),
    name: `quickMesure${date}`
  }
  let testConfig: SutyClientConfig = configCreator(phase, config);
  testConfig.target = target;
  testConfig.scenarios = null;
  const task: Array<SutyClientConfig> = [testConfig];
  const usecase = kernel.get<MesureUsecaseI>("MesureUsecaseI");
  usecase.run(task)
    .then(running => presenter(running, config));
}

function argvError({ rate, duration, target }) {
  if(!rate) {
    throw new Error("第2引数にrateが入力されていません")
  }
  if(!duration) {
    throw new Error("第1引数にdurationが入力されていません");
  }
  if(!target) {
    throw new Error("第3引数にURLが入力されていません");
  }
}