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
    return `background-color: rgb(${((max - data) * 255) / max}, ${
      (data * 255) / max
    }, 0); color: black;`;
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
          <th style={genColor(team.avgTeleopCargo, 10)}
            >{limitSigfigs(team.avgTeleopCargo)}</th
          >
          <th style={genColor(team.avgAutoCargo, 3)}
            >{limitSigfigs(team.avgAutoCargo)}</th
          >
          <th style={genColor(team.teleopConsistency, 100)}
            >{limitSigfigs(team.teleopConsistency)}</th
          >
          <th style={genColor(team.autoConsistency, 100)}
            >{limitSigfigs(team.autoConsistency)}</th
          >
          <th style={genColor(team.highestClimb, 15)}
            >{limitSigfigs(team.highestClimb)}</th
          >
          <th style={genColor(team.avgClimb, 15)}
            >{limitSigfigs(team.avgClimb)}</th
          >
          <th style={genColor(team.avgUpperCargo, 10)}
            >{limitSigfigs(team.avgUpperCargo)}</th
          >
          <th style={genColor(team.avgLowerCargo, 10)}
            >{limitSigfigs(team.avgLowerCargo)}</th
          >
          <th style={genColor(team.avgCargoPoints, 25)}
            >{limitSigfigs(team.avgCargoPoints)}</th
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
