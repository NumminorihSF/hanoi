import CacheFsStore from './CacheFsStore';
import { TOWER_NAMES } from './constants';

const getRest = ({ from, to }) => TOWER_NAMES.filter(tower => tower !== from && tower !== to)[0];

const FROM = '__FROM__';
const TO = '__TO__';
const REST = '__REST__';


function transformToString({ from, rest, to }, data) {
  return JSON.stringify(data)
    .replace(new RegExp(from, 'g'), FROM)
    .replace(new RegExp(to, 'g'), TO)
    .replace(new RegExp(rest, 'g'), REST);
}

function transformFromString({ from, rest, to }, data) {
  const actualData = data.replace(new RegExp(FROM, 'g'), from)
    .replace(new RegExp(TO, 'g'), to)
    .replace(new RegExp(REST, 'g'), rest);
  return JSON.parse(actualData);
}

export function save({ count, from, to }, data) {
  if (count > 22) return Promise.resolve();
  const rest = getRest({ from, to });
  const dataToWrite = transformToString({ from, to, rest }, data);
  return CacheFsStore.save(count, dataToWrite);
}

export function load({ count, from, to }) {
  return CacheFsStore.load(count)
    .then((data) => {
      if (data === null) {
        return Promise.resolve(null);
      }
      const rest = getRest({ from, to });
      return Promise.resolve(transformFromString({ from, to, rest }, data));
    });
}

export default {
  save,
  load,
};
