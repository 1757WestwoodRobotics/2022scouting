export const extraComps = process.env.EXTRA_COMPS;
//hi

let comp = Object.keys(extraComps).map((k) => {
  // @ts-ignore
  return { id: k, name: `${extraComps[k]["name"]} [${k}]` };
});

export const competitions = [
  { id: "mabos", name: "Revere [mabos]" },
  { id: "mawor", name: "WPI [mawor]" },
  { id: "week0", name: "Week 0 [week0]" },
  { id: "nhgrs", name: "Granite State [nhgrs]" },
  { id: "mabri", name: "SE Mass [mabri]" },
  { id: "rinsc", name: "Rhode Island [rinsc]" },
  ...comp,
];
export const charge = [
  { name: "None", amount: 0 },
  { name: "Park", amount: 2 },
  { name: "Docked", amount: 6 },
  { name: "Engaged", amount: 10 },
];
export const matchType = [
  { name: "Qualification", id: "qm" },
  { name: "Quarterfinal", id: "qf" },
  { name: "Semifinal", id: "sf" },
  { name: "Final", id: "f" },
];

export const limitSigfigs = (num: number) => {
  if (num === null || num === undefined) {
    return null;
  }
  return num.toString().slice(0, 4);
};

export const dataToText = (data) => {
  return `${data.identifier.team},${data.identifier.match_number},${
    data.identifier.comp
  },${data.identifier.comp_level},${data.identifier.set_number},${
    data.auto_cargo.upper
  },${data.auto_cargo.lower},${data.auto_cargo.miss},${
    data.teleop_cargo.upper
  },${data.teleop_cargo.lower},${data.teleop_cargo.miss},${
    data.climb_level
  },${data.notes.replace(",", ".")}`;
};

export const textToData = (text) => {
  let team,
    comp,
    comp_level,
    match_number,
    set_number,
    auto_up,
    auto_low,
    auto_miss,
    teleop_upper,
    teleop_lower,
    teleop_miss,
    climb,
    notes;
  [
    team,
    match_number,
    comp,
    comp_level,
    set_number,
    auto_up,
    auto_low,
    auto_miss,
    teleop_upper,
    teleop_lower,
    teleop_miss,
    climb,
    notes,
  ] = text.split(",");
  console.log(text, team);
  return {
    identifier: {
      team,
      comp,
      comp_level,
      match_number,
      set_number,
    },
    auto_cargo: {
      upper: auto_up,
      lower: auto_low,
      miss: auto_miss,
    },
    teleop_cargo: {
      upper: teleop_upper,
      lower: teleop_lower,
      miss: teleop_miss,
    },
    climb_level: climb,
    notes,
  };
};

export const mapRange = (
  s: number,
  imin: number,
  imax: number,
  omin: number,
  omax: number
) => {
  return omin + ((s - imin) * (omax - omin)) / (imax - imin);
};
