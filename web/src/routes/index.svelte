<script lang="ts">
  import { competitions, apiUrl, limitSigfigs, mapRange } from "../constants";
  import Box from "../components/Box.svelte";

  let teamData = [];
  let maxEntries: number | undefined = undefined; // max amount of fetched entities for any given

  const fetchData = async () => {
    const res = await self.fetch(
      `${apiUrl}/event/${selected.id}${maxEntries ? "?l=" + maxEntries : ""}`
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
      name: "teleop cargo",
      fn: (team1, team2) => team2.avgTeleopCargo - team1.avgTeleopCargo,
    },
    {
      name: "auto cargo",
      fn: (team1, team2) => team2.avgAutoCargo - team1.avgAutoCargo,
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
      name: "capable climb",
      fn: (team1, team2) => team2.highestClimb - team1.highestClimb,
    },
    {
      name: "avg climb",
      fn: (team1, team2) => team2.avgClimb - team1.avgClimb,
    },
    {
      name: "avg upper",
      fn: (team1, team2) => team2.avgUpperCargo - team1.avgUpperCargo,
    },
    {
      name: "avg lower",
      fn: (team1, team2) => team2.avgLowerCargo - team1.avgLowerCargo,
    },
    {
      name: "avg cargo points",
      fn: (team1, team2) => team2.avgCargoPoints - team1.avgCargoPoints,
    },
    {
      name: "cargo + climb",
      fn: (team1, team2) =>
        team2.avgCargoPoints +
        team2.avgClimb -
        team1.avgCargoPoints -
        team1.avgClimb,
    },
    {
      name: "balls cycled teleop",
      fn: (team1, team2) =>
        team2.avgBallsCycledTeleop - team1.avgBallsCycledTeleop,
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
  <input type="number" placeholder="Last N matches" bind:value={maxEntries} />
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
            }}>Avg Teleop Cargo</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[2].fn;
            }}>Avg Auto Cargo</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[3].fn;
            }}>Teleop % shots made</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[4].fn;
            }}>Auto % shots made</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[5].fn;
            }}>Highest Climb Level (pts)</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[6].fn;
            }}>Avg Climb</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[7].fn;
            }}>Avg upper cargo</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[8].fn;
            }}>Avg lower cargo</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[9].fn;
            }}>Avg Cargo Points</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[11].fn;
            }}>Avg Cargo Cycled in Teleop</th
          >
          <th
            on:click={() => {
              sortingFunction = sortingMethods[10].fn;
            }}>Avg Cargo + Climb Points</th
          >
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
                team.avgTeleopCargo,
                Math.max(...data.map((a) => a.avgTeleopCargo)),
                Math.min(...data.map((a) => a.avgTeleopCargo))
              )}>{limitSigfigs(team.avgTeleopCargo)}</td
            >
            <td
              style={genColor(
                team.avgAutoCargo,
                Math.max(...data.map((a) => a.avgAutoCargo)),
                Math.min(...data.map((a) => a.avgAutoCargo))
              )}>{limitSigfigs(team.avgAutoCargo)}</td
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
                team.highestClimb,
                Math.max(...data.map((a) => a.highestClimb)),
                Math.min(...data.map((a) => a.highestClimb))
              )}>{limitSigfigs(team.highestClimb)}</td
            >
            <td
              style={genColor(
                team.avgClimb,
                Math.max(...data.map((a) => a.avgClimb)),
                Math.min(...data.map((a) => a.avgClimb))
              )}>{limitSigfigs(team.avgClimb)}</td
            >
            <td
              style={genColor(
                team.avgUpperCargo,
                Math.max(...data.map((a) => a.avgUpperCargo)),
                Math.min(...data.map((a) => a.avgUpperCargo))
              )}>{limitSigfigs(team.avgUpperCargo)}</td
            >
            <td
              style={genColor(
                team.avgLowerCargo,
                Math.max(...data.map((a) => a.avgLowerCargo)),
                Math.min(...data.map((a) => a.avgLowerCargo))
              )}>{limitSigfigs(team.avgLowerCargo)}</td
            >
            <td
              style={genColor(
                team.avgCargoPoints,
                Math.max(...data.map((a) => a.avgCargoPoints)),
                Math.min(...data.map((a) => a.avgCargoPoints))
              )}>{limitSigfigs(team.avgCargoPoints)}</td
            >
            <td
              style={genColor(
                team.avgBallsCycledTeleop,
                Math.max(...data.map((a) => a.avgBallsCycledTeleop)),
                Math.min(...data.map((a) => a.avgBallsCycledTeleop))
              )}>{limitSigfigs(team.avgBallsCycledTeleop)}</td
            >
            <td
              style={genColor(
                team.avgCargoPoints + team.avgClimb,
                Math.max(...data.map((a) => a.avgCargoPoints + a.avgClimb)),

                Math.min(...data.map((a) => a.avgCargoPoints + a.avgClimb))
              )}>{limitSigfigs(team.avgCargoPoints + team.avgClimb)}</td
            >
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
