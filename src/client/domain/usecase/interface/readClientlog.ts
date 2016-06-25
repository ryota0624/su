import Request from '../../model/request';
export interface ClientlogRecord {
  responseTime: number;
  statusCode: number;
}
export interface Clientlog {
  get({ path }: { path: string }): Promise<Array<ClientlogRecord>>;
}