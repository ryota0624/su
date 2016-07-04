
import { SutyClientConfig } from '../../../domain/interface/loadTest';
export function configCheck(config: SutyClientConfig) {
  const phases = config.phases;
  phases.forEach(phase => {
    const mustHaveProp = ['duration', 'arrivalRate', 'name'];
    const phaseKeys = Object.keys(phase);
    mustHaveProp.forEach(prop => {
      if(phaseKeys.indexOf(prop) === -1) throw new Error(`phase must have key: ${prop}`);
    });
  });
}