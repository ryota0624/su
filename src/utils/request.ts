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
      rej(e);
      console.log('request error', url, e);
      process.stderr.write(e.toString());
      //process.exit();
    });
  });
}
