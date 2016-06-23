const get = require('http').get;

export function getPromise(url) {
  return new Promise((resolve, rej) => {
    get(url, (response) => {
      var data = '';
      response.on('data', (chunk) => {
        data = data + chunk;
      });
      response.on('end', () => resolve(data));
      response.resume();
    }).on('error', (e) => {
      // rej(e);
      throw new Error('request error' +  url + '\n' + e.toString());
      //process.exit();
    });
  });
}
