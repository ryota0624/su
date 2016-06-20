import fs from 'fs';
function appendFile(path, data) {
  return new Promise((res, rej) => {
    fs.appendFile(path, data, (err, data) => {
      if(err) return rej(err);
      return res(data);
    });
  });
}
function writeFile(path, data) {
  return new Promise((res, rej) => {
    fs.writeFile(path, data, (err, data) => {
      if(err) return rej(err);
      return res(data);
    });
  });
}

module.exports = {
  appendFile,
  writeFile
}