const unified = new Map();

function getKey(step) {
  return `${step.from}|${step.to}`;
}

export default function unifyContent(value) {
  if (Array.isArray(value)) {
    return value.map(unifyContent);
  }

  const key = getKey(value);
  if (!unified.has(key)) {
    unified.set(key, value);
  }
  return unified.get(key);
}
