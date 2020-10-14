import Tower from './Tower';
import { save, load } from './Cache';
import unifyContent from './unifyContent';
import { TOWER_NAMES, DEFAULT_RINGS_COUNT } from './constants';

const INVALID_COUNT_ERROR = '1st param in HanoiGame#constructor should be an positive integer.';
const INVALID_SOLVE_ARGUMENTS = '1st param in Hanoi.solve() should be an positive integer.';


export default class Hanoi {
  static solve(countOfRings, from, to) {
    if (!(Number(countOfRings) > 0)) {
      throw new Error(INVALID_SOLVE_ARGUMENTS);
    }
    if (countOfRings === 1) {
      return [{ from, to }];
    }
    const rest = TOWER_NAMES.filter(tower => tower !== from && tower !== to)[0];
    return [
      ...Hanoi.solve(countOfRings - 1, from, rest),
      { from, to },
      ...Hanoi.solve(countOfRings - 1, rest, to),
    ];
  }

  static solveAsync(countOfRings, from, to) {
    if (!(Number(countOfRings) > 0)) {
      return Promise.reject(new Error(INVALID_SOLVE_ARGUMENTS));
    }
    if (countOfRings === 1) {
      return Promise.resolve([{ from, to }]);
    }

    return new Promise((resolveSolution) => {
      load({ count: countOfRings, from, to })
        .then((cachedResult) => {
          if (cachedResult !== null) {
            // eslint-disable-next-line no-console
            console.log(`got from cache for ${countOfRings}`);
            return resolveSolution(unifyContent(cachedResult));
          }

          const promise = new Promise((resolve) => {
            setImmediate(() => {
              const rest = TOWER_NAMES.filter(tower => tower !== from && tower !== to)[0];

              Hanoi.solveAsync(countOfRings - 1, from, rest).then((leftResult) => {
                const result = [];
                leftResult.forEach((part) => {
                  result.push(unifyContent(part));
                });

                Hanoi.solveAsync(1, from, to).then((localResult) => {
                  localResult.forEach((part) => {
                    result.push(unifyContent(part));
                  });

                  Hanoi.solveAsync(countOfRings - 1, rest, to).then((rightResult) => {
                    rightResult.forEach((part) => {
                      result.push(unifyContent(part));
                    });
                    resolve(result);
                  });
                });
              });
            });
          });

          // eslint-disable-next-line no-console
          promise.then(() => console.log(`calculated for ${countOfRings}`));
          return promise.then(result => save({ count: countOfRings, from, to }, result).then(
              () => Promise.resolve(result),
            )).then(resolveSolution);
        })
        .catch((e) => {
          throw e;
        });
    });
  }

  constructor(count = DEFAULT_RINGS_COUNT, flow = { from: 'left', to: 'right' }) {
    if (isNaN(count)) throw new Error(INVALID_COUNT_ERROR);
    if (typeof count !== 'number') throw new Error(INVALID_COUNT_ERROR);
    if (Math.floor(count) !== count) throw new Error(INVALID_COUNT_ERROR);
    if (count < 0) throw new Error(INVALID_COUNT_ERROR);

    const { from } = flow;

    this.step = 0;
    this.size = count;

    this.left = new Tower();
    this.middle = new Tower();
    this.right = new Tower();


    let currentSize = count;
    while (currentSize > 0) {
      this[from].push(currentSize);
      currentSize -= 1;
    }

    this.flow = { ...flow };
    this.solution = null;
  }

  doStep({ from, to }) {
    this.step += 1;
    this[to].push(this[from].pop());
    return this;
  }

  solve() {
    if (!this.solution) {
      this.solution = Hanoi.solve(this.size, this.flow.from, this.flow.to);
    }
    return this.solution.map(v => ({ ...v }));
  }

  solveAsync() {
    if (!this.solution) {
      const promise = Hanoi.solveAsync(this.size, this.flow.from, this.flow.to);
      promise.then((results) => {
        this.solution = results;
      });

      return promise;
    }
    return Promise.resolve(this.solution);
  }

  getState() {
    return {
      step: this.step,
      flow: { ...this.flow },
      left: this.left.getState(),
      middle: this.middle.getState(),
      right: this.right.getState(),
    };
  }
}
