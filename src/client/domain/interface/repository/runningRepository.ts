import Running from '../../model/running';
export interface RunningRepository {
  save(entity: Running)
  getById(id: string):Running
  init()
  commit()
  getAllId()
  getAllRunning()
}

