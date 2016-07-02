import { SutyClientConfig } from '../../domain/interface/loadTest';

export default function onlyAttack (sutyConfigs: Array<SutyClientConfig>){
  const target = sutyConfigs[0].target;
  process.stdout.write(`target: ${target}\n`);
  sutyConfigs.forEach(config => {
    const { logname, scenarios } = config;
      process.stdout.write("testname: "+logname + "\n");
      process.stdout.write("flow: \n");
      scenarios.forEach(scenario => {
        scenario.flow.forEach(flow => {
          process.stdout.write('  '+JSON.stringify(flow) + '\n');
        })
      });
  });
}