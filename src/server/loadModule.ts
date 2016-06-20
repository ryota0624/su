'use strict';
function moduleLoad (moduleName) {
  const modulePath = `${process.env.PWD}/scripts/${moduleName}`;
  let testModule;
  try {
    console.log('load module > ', moduleName);
    testModule = require(modulePath);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error('module が正しく読み込まれませんでした');
    } else { 
      console.log(err);
    }
  }
  if (!(typeof testModule === 'function')) {
    throw new TypeError('module が 関数になってません');
  }
  return testModule;
}

module.exports = moduleLoad;