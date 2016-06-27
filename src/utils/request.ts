// const get = require('http').get;
// const get = require('http').get;
import { get as httpGet } from 'http';
import { get as httpsGet } from 'https';

export function getPromise(url: string) {
  const get = url.match(/http/) ? httpGet : httpsGet;
  return new Promise((resolve, rej) => {
    get(url, (response) => {
      var data = '';
      response.on('data', (chunk) => {
        data = data + chunk;
      });
      response.on('end', () => resolve(data));
      response.resume();
    }).on('error', (e) => {
      resolve(e);
      // process.stderr.write(e.toString());
      //process.exit();
    });
  });
}
