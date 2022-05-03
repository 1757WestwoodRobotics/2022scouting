export const competitions = [
  { id: "mabos", name: "Revere [mabos]" },
  { id: "mawor", name: "WPI [mawor]" },
  { id: "necmp1", name: "NE District Championship Calcium Division [necmp1]" },
];
export const climb = [
  { name: "None", amount: 0 },
  { name: "Low", amount: 4 },
  { name: "Mid", amount: 6 },
  { name: "High", amount: 10 },
  { name: "Traverse", amount: 15 },
];
export const matchType = [
  { name: "Qualification", id: "qm" },
  { name: "Quarterfinal", id: "qf" },
  { name: "Semifinal", id: "sf" },
  { name: "Final", id: "f" },
];

export const limitSigfigs = (num) => {
  if (num === null || num === undefined) {
    return null;
  }
  return num.toString().slice(0, 4);
};

export const mapRange = (s, imin, imax, omin, omax) => {
  return omin + ((s - imin) * (omax - omin)) / (imax - imin);
};
