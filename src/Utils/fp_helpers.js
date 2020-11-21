export const trace = (label) => (value) => {
  console.log(`${label}: ${value}`);
  return value;
};

export const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x);
