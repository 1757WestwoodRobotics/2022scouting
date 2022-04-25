<script lang="ts">
  import { competitions, apiUrl, limitSigfigs } from "../constants";
  import Box from "../components/Box.svelte";

  let teamData = [];

  const fetchData = async () => {
    const res = await self.fetch(`${apiUrl}/event/${selected.id}`);
    return res.json();
  };

  let promise = fetchData();

  const updateData = () => {
    promise = fetchData();
  };

  let selected = "";
  const genColor = (data, max) => {
    const interVal = (data * Math.PI) / (2 * max);
    const red = 255 * Math.cos(interVal);
    const green = 255 * Math.sin(interVal);
    return `background-color: rgb(${red}, ${green}, 0); color: black;`;
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
        </tr>
      </thead>
      <tbody>
        {#each data.sort(sortingFunction) as team}
          <tr>
            <a href="team/{team.team_number}">
              <th>{team.nickname}</th>
            </a>
            <a href="team/{team.team_number}">
              <th>{team.team_number}</th>
            </a>
            <th
              style={genColor(
                team.avgTeleopCargo,
                Math.max(...data.map((a) => a.avgTeleopCargo))
              )}>{limitSigfigs(team.avgTeleopCargo)}</th
            >
            <th
              style={genColor(
                team.avgAutoCargo,
                Math.max(...data.map((a) => a.avgAutoCargo))
              )}>{limitSigfigs(team.avgAutoCargo)}</th
            >
            <th
              style={genColor(
                team.teleopConsistency,
                Math.max(...data.map((a) => a.teleopConsistency))
              )}>{limitSigfigs(team.teleopConsistency)}</th
            >
            <th
              style={genColor(
                team.autoConsistency,
                Math.max(...data.map((a) => a.autoConsistency))
              )}>{limitSigfigs(team.autoConsistency)}</th
            >
            <th
              style={genColor(
                team.highestClimb,
                Math.max(...data.map((a) => a.highestClimb))
              )}>{limitSigfigs(team.highestClimb)}</th
            >
            <th
              style={genColor(
                team.avgClimb,
                Math.max(...data.map((a) => a.avgClimb))
              )}>{limitSigfigs(team.avgClimb)}</th
            >
            <th
              style={genColor(
                team.avgUpperCargo,
                Math.max(...data.map((a) => a.avgUpperCargo))
              )}>{limitSigfigs(team.avgUpperCargo)}</th
            >
            <th
              style={genColor(
                team.avgLowerCargo,
                Math.max(...data.map((a) => a.avgLowerCargo))
              )}>{limitSigfigs(team.avgLowerCargo)}</th
            >
            <th
              style={genColor(
                team.avgCargoPoints,
                Math.max(...data.map((a) => a.avgCargoPoints))
              )}>{limitSigfigs(team.avgCargoPoints)}</th
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
  a th {
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
  }
  p {
    margin: 1em auto;
  }
  select {
    font-size: 1em;
    width: 100%;
    height: 2em;
    background-color: rgb(33, 33, 33);
    border-color: #ffffff;
    border-width: 0.1em;
    color: rgb(255, 255, 255);
  }
</style>
