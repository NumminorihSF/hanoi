require('babel-register');
const Hanoi = require('./src/index').default;

const count = 24;

const [ b ] = [ new Hanoi(count), new Hanoi(count)];


const startB = process.hrtime();
b.solveAsync().then((args) => {
  console.log(process.hrtime(startB));
  console.log(args.length);
});