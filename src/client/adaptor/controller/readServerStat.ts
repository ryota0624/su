import kernel from '../../inversify.config';
import { ReadServerStatUsecaseI } from '../../domain/usecase/readServerStat';
import presenter from '../presenter/mesureMetrics';

export default function ReadServerStatController() {
  const url = process.argv[3];
  const usecase = kernel.get<ReadServerStatUsecaseI>("ReadServerStatUsecaseI");
  usecase.run(url).then(running => presenter(running));
}