<script lang="ts">
  import { competitions, apiPort, limitSigfigs } from "../constants";
  import Box from "../components/Box.svelte";

  let teamData = [];

  const fetchData = async () => {
    const res = await self.fetch(
      `http://localhost:${apiPort}/event/${selected.id}`
    );
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
  </figure>
</Box>

{#await promise}
  <p>fecthing...</p>
{:then data}
  <table>
    <thead>
      <tr>
        <th>Team Name</th>
        <th>Team Number</th>
        <th>Avg Teleop Cargo</th>
        <th>Avg Auto Cargo</th>
        <th>Teleop % shots made</th>
        <th>Auto % shots made</th>
        <th>Highest Climb Level (pts)</th>
        <th>Avg Climb</th>
        <th>Avg upper cargo</th>
        <th>Avg lower cargo</th>
        <th>Avg Cargo Points</th>
      </tr>
    </thead>
    <tbody>
      {#each data as team}
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
