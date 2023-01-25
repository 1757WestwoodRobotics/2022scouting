<script lang="ts">
  import { competitions, limitSigfigs, mapRange } from "../constants";
  import Box from "../components/Box.svelte";

  let teamData = [];
  let maxEntries: number | undefined = undefined; // max amount of fetched entities for any given
  let limitToComp = true;

  const fetchData = async () => {
    const res = await self.fetch(
      `process.BACKEND_URL/event/${selected.id}${
        maxEntries
          ? "?l=" + maxEntries + (limitToComp ? "&c=t" : "")
          : limitToComp
          ? "?c=t"
          : ""
      }`
    );
    return res.json();
  };

  let promise = fetchData();

  const updateData = () => {
    promise = fetchData();
  };

  let selected = "";
  const genColor = (data, max, min) => {
    const hue = mapRange(data, min, max, 0, 120);
    return `background-color: hsl(${hue}, 100%, 50%); color: black;`;
  };

  const sortingMethods = [
    {
      name: "number",
      fn: (team1, team2) => team1.team_number - team2.team_number,
    },
    {
      name: "teleop gamepieces",
      fn: (team1, team2) => team2.avgTeleopGP - team1.avgTeleopGP,
    },
    {
      name: "auto gamepieces",
      fn: (team1, team2) => team2.avgAutoGP - team1.avgAutoGP,
    },
    {
      name: "teleop %",
      fn: (team1, team2) => team2.teleopConsistency - team1.teleopConsistency,
    },
    {
      name: "auto %",
      fn: (team1, team2) => team2.autoConsistency - team1.autoConsistency,
    },
    {
      name: "capable auto charge",
      fn: (team1, team2) => team2.highestAutoDock - team1.highestAutoDock,
    },
    {
      name: "capable teleop charge",
      fn: (team1, team2) => team2.highestTeleopDock - team1.highestTeleopDock,
    },
    {
      name: "avg auto dock",
      fn: (team1, team2) => team2.avgAutoDock - team1.avgAutoDock,
    },
    {
      name: "avg teleop dock",
      fn: (team1, team2) => team2.avgTeleopDock - team1.avgTeleopDock,
    },
    {
      name: "avg top",
      fn: (team1, team2) => team2.avgTopGP - team1.avgTopGP,
    },
    {
      name: "avg mid",
      fn: (team1, team2) => team2.avgMidGP - team1.avgMidGP,
    },
    {
      name: "avg hybrid",
      fn: (team1, team2) => team2.avgHybridGP - team1.avgHybridGP,
    },
    {
      name: "avg gp points",
      fn: (team1, team2) => team2.avgGPPoints - team1.avgGPPoints,
    },
    {
      name: "total points",
      fn: (team1, team2) =>
        team2.avgGPPoints +
        team2.avgAutoDock + team2.avgTeleopDock -
        team1.avgGPPoints -
        team1.avgAutoDock - team1.avgTeleopDock,
    },
    {
      name: "gp cycled teleop",
      fn: (team1, team2) =>
        team2.avgGPCycledTeleop - team1.avgGPCycledTeleop,
    },
  ];
  let sortingFunction = sortingMethods[0].fn;
</script>

<svelte:head>
  <title>1757 Scouting Database</title>
</svelte:head>

<Box title="Select Competition" --box-width="auto">
  <figure>
    <select name="Comp" bind:value={selected} on:change={updateData}>
      <option value="" selected disabled>Select Competition</option>
      {#each competitions as comp}
        <option value={comp}>{comp.name}</option>
      {/each}
    </select>
    <select name="Comp" bind:value={sortingFunction}>
      <option value="" selected disabled>Select Sorting Method</option>
      {#each sortingMethods as method}
        <option value={method.fn}>{method.name}</option>
      {/each}
    </select>
  </figure>
  <input
    type="number"
    placeholder="Last N matches"
    bind:value={maxEntries}
    on:change={updateData}
  />
  Limit to Selected Competition
  <input type="checkbox" bind:checked={limitToComp} on:change={updateData} />
</Box>

{#await promise}
  <p>fecthing...</p>
{:then data}
  <div class="tableContainer">
    <table>
      <thead>
        <tr>
          <th>Team Name</th>
          <th
            on:click={() => {
              sortingFunction = sortingMethods[0].fn;
            }}>Team Number</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[1].fn;
            }}>Avg Teleop GP</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[2].fn;
            }}>Avg Auto GP</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[3].fn;
            }}>Teleop % made</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[4].fn;
            }}>Auto % made</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[5].fn;
            }}>Highest Auto Charge</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[6].fn;
            }}>Highest Teleop Charge</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[7].fn;
            }}>Avg Auto Charge</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[8].fn;
            }}>Avg Teleop Charge</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[9].fn;
            }}>Avg Top</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[11].fn;
            }}>Avg Mid</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[10].fn;
            }}>Avg Hybrid</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[11].fn;
            }}>Avg GP Points</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[11].fn;
            }}>Avg Total Points</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[11].fn;
            }}>Avg GP cycles per match</th
          >
          <th>avg variation</th>
        </tr>
      </thead>
      <tbody>
        {#each data.sort(sortingFunction) as team}
          <tr>
            <a href="team/{team.team_number}">
              <td>{team.nickname}</td>
            </a>
            <a href="team/{team.team_number}">
              <td>{team.team_number}</td>
            </a>
            <td
              style={genColor(
                team.avgTeleopGP,
                Math.max(...data.map((a) => a.avgTeleopGP)),
                Math.min(...data.map((a) => a.avgTeleopGP))
              )}>{limitSigfigs(team.avgTeleopGP)}</td
            >
            <td
              style={genColor(
                team.avgAutoGP,
                Math.max(...data.map((a) => a.avgAutoGP)),
                Math.min(...data.map((a) => a.avgAutoGP))
              )}>{limitSigfigs(team.avgAutoGP)}</td
            >
            <td
              style={genColor(
                team.teleopConsistency,
                Math.max(...data.map((a) => a.teleopConsistency)),
                Math.min(...data.map((a) => a.teleopConsistency))
              )}>{limitSigfigs(team.teleopConsistency)}</td
            >
            <td
              style={genColor(
                team.autoConsistency,
                Math.max(...data.map((a) => a.autoConsistency)),
                Math.min(...data.map((a) => a.autoConsistency))
              )}>{limitSigfigs(team.autoConsistency)}</td
            >
            <td
              style={genColor(
                team.highestAutoDock,
                Math.max(...data.map((a) => a.highestAutoDock)),
                Math.min(...data.map((a) => a.highestAutoDock))
              )}>{limitSigfigs(team.highestAutoDock)}</td
            >
            <td
              style={genColor(
                team.highestTeleopDock,
                Math.max(...data.map((a) => a.highestTeleopDock)),
                Math.min(...data.map((a) => a.highestTeleopDock))
              )}>{limitSigfigs(team.highestTeleopDock)}</td
            >
            <td
              style={genColor(
                team.avgAutoDock,
                Math.max(...data.map((a) => a.avgAutoDock)),
                Math.min(...data.map((a) => a.avgAutoDock))
              )}>{limitSigfigs(team.avgAutoDock)}</td
            >
            <td
              style={genColor(
                team.avgTeleopDock,
                Math.max(...data.map((a) => a.avgTeleopDock)),
                Math.min(...data.map((a) => a.avgTeleopDock))
              )}>{limitSigfigs(team.avgTeleopDock)}</td
            >
            <td
              style={genColor(
                team.avgTopGP,
                Math.max(...data.map((a) => a.avgTopGP)),
                Math.min(...data.map((a) => a.avgTopGP))
              )}>{limitSigfigs(team.avgTopGP)}</td
            >
            <td
              style={genColor(
                team.avgMidGP,
                Math.max(...data.map((a) => a.avgMidGP)),
                Math.min(...data.map((a) => a.avgMidGP))
              )}>{limitSigfigs(team.avgMidGP)}</td
            >
            <td
              style={genColor(
                team.avgHybridGP,
                Math.max(...data.map((a) => a.avgHybridGP)),
                Math.min(...data.map((a) => a.avgHybridGP))
              )}>{limitSigfigs(team.avgHybridGP)}</td
            >
            <td
              style={genColor(
                team.avgGPPoints,
                Math.max(...data.map((a) => a.avgGPPoints)),
                Math.min(...data.map((a) => a.avgGPPoints))
              )}>{limitSigfigs(team.avgGPPoints)}</td
            >
            <td
              style={genColor(
                team.avgGPPoints + team.avgAutoDock + team.avgTeleopDock,
                Math.max(...data.map((a) => a.avgGPPoints + a.avgAutoDock + a.avgTeleopDock)),

                Math.min(...data.map((a) => a.avgGPPoints + a.avgAutoDock + a.avgTeleopDock))
              )}>{limitSigfigs(team.avgGPPoints + team.avgAutoDock + team.avgTeleopDock)}</td
            >
            <td
              style={genColor(
                team.avgGPCycledTeleop,
                Math.max(...data.map((a) => a.avgGPCycledTeleop)),
                Math.min(...data.map((a) => a.avgGPCycledTeleop))
              )}>{limitSigfigs(team.avgGPCycledTeleop)}</td
            >
            <td>{limitSigfigs(team.sd)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/await}

<style>
  a {
    display: contents;
  }
  a td {
    text-decoration: underline;
  }
  tr {
    border-bottom: #aaa 0.2em solid;
  }
  table {
    border-collapse: collapse;
    color: #fff;
  }
  figure,
  p {
    font-family: Trebuchet MS;
    text-align: center;
    margin: 0 auto;
    color: #ffffff;
    font-weight: 700;
  }
  thead tr th:hover {
    cursor: pointer;
  }
  .tableContainer {
    overflow-x: scroll;
  }

  figure {
    margin: 0 0 1em 0;
    display: grid;
    grid-template-columns: 3fr 1fr;
  }
  p {
    margin: 1em auto;
  }
</style>
