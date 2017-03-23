const INVALID_ARGUMENT = 'Need number that is not NaN as argument';

export default function isOdd(possibleNumber) {
  if (typeof possibleNumber !== 'number') throw new Error(INVALID_ARGUMENT);
  if (isNaN(possibleNumber)) throw new Error(INVALID_ARGUMENT);
  const temp = possibleNumber / 2;
  return Math.floor(temp) !== temp;
}
