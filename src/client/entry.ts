import * as fs from 'fs';
import mesureContoller from './controller/mesure';
const clientConfig = require(`${process.env.PWD}/su_client.config.js`);
mesureContoller(clientConfig);