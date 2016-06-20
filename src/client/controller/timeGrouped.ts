import { ProcessStatusRepo } from '../repository/processStatus';
import { GroupedTime } from '../usecases/groupedTime';

export default function mesureController(config: Array<string>, repo: ProcessStatusRepo) {
  const repoSetups = config.map(path => repo.readFromResource(path));
  Promise.all(repoSetups).then(() => {
    const groupedTimeUsecase = new GroupedTime({ statusRepo: repo });
    groupedTimeUsecase.run();
  });
}