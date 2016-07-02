import * as express from 'express';
import * as fs from 'fs';
import router from '../common/router';
import { logHeader, logging } from '../common/logger';

let logStream;
let loggerActive = false;
let startTime;
let filename = '';
function startlogger(setFilename) {
  filename = setFilename;
  startTime = new Date().getTime();
  fs.writeFile(filename, logHeader());
}
function stoplogger(filename) {
  const time = new Date();
  const logReadStream = fs.createReadStream(filename);
  const logWriteStream = fs.createWriteStream(filename + time.getTime() + ".csv");
  logReadStream.pipe(logWriteStream);
}
function logger(url) {
  const time = (new Date).getTime() - startTime; 
  fs.appendFile(filename, logging({ time }));
}

const log = (filename) => (req, res, next) => {
  const logStream = fs.createReadStream(filename);
  logStream.pipe(res);
}

const start = (filename) => (req, res, next) => {
  loggerActive = true;
  startlogger(filename);
  res.send({ logger: "start" });
}

const stop = (filename) => (req, res, next) => {
  loggerActive = false;
  stoplogger(filename);
  res.send({ logger: "stop" })
}

const other = (req, res, next) => {
  if (loggerActive) {
    logger(req.url);
  }
}

export default (filename) => router({
  log: log(filename),
  start: start(filename),
  stop: stop(filename),
  other
});