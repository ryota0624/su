# express-sutilery-middleware

## install
```
npm install  

```

## Usage
```
const app = require('express')();
const logger = require('suty-logger').logger(__dirname + '/log.csv');
app.use(logger);  

/*
* auto routing
**/

/suty/start -> switch loging start  
/suty/stop -> switch loging stop  
/suty/log -> return log
```
##cluster
```
const express = require('express');
const sutyLogger = require('suty-logger').cluster;  
const numCPUs = require('os').cpus().length;  
const cluster = require('cluster');  
const fs = require('fs');  
const logger = sutyLogger(__dirname + '/log.csv');  

if(cluster.isMaster) {  
  for(let i = 0; i < numCPUs; i++) {  
    cluster.fork();  
  }  
  logger.parent(cluster.workers);  
} else {  
  const app = express();  
  app.use(logger.child);  
  app.listen(3000);  
}  
```