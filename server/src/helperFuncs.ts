export const roundObject = (ob: any, digits: number) => {
  let retOb: any = {};
  Object.keys(ob).forEach((key) =>
    typeof ob[key] === "number"
      ? (retOb[key] = roundTo(ob[key], digits))
      : (retOb[key] = ob[key])
  );
  return retOb;
};

function roundTo(n: number, digits: number) {
  if (digits === undefined) {
    digits = 0;
  }

  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  var test = Math.round(n) / multiplicator;
  return +test.toFixed(digits);
}
