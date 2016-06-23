import { ExternalApp } from './gatewayInterfaces/externalApp';

export class OpenFile {
  externalApp: ExternalApp;
  
  constructor(params: { externalApp: ExternalApp } ) {
    this.externalApp = params.externalApp;
  }
  run() {
    return this.externalApp.run().catch(err => console.log(err))
  }
}
