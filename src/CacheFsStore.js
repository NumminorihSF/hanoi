import fs from 'fs';
import path from 'path';

const PATH_PREFIX = '../.tmp/';
const memory = new Map();

try {
  fs.mkdirSync(path.join(__dirname, PATH_PREFIX));
} catch (e) {
  if (e.code !== 'EEXIST') throw e;
}

function getFilePath(key) {
  return path.join(__dirname, PATH_PREFIX, String(key));
}

function save(key, data) {
  return new Promise((resolve, reject) => {
    const filePath = getFilePath(key);
    memory.set(filePath, data);

    return fs.writeFile(filePath, data, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function load(key) {
  return new Promise((resolve) => {
    const filePath = getFilePath(key);
    if (memory.has(filePath)) return resolve(memory.get(filePath));

    return fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
      if (err) return resolve(null);
      const result = data || null;
      memory.set(filePath, result);
      return resolve(result);
    });
  });
}

export default {
  save,
  load,
};
