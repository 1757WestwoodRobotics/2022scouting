<script lang="ts">
  import { competitions, apiPort } from "../constants";
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
          <th>{team.nickname}</th>
          <th>{team.team_number}</th>
          <th>{team.avgTeleopCargo}</th>
          <th>{team.avgAutoCargo}</th>
          <th>{team.teleopConsistency}</th>
          <th>{team.autoConsistency}</th>
          <th>{team.highestClimb}</th>
          <th>{team.avgClimb}</th>
          <th>{team.avgUpperCargo}</th>
          <th>{team.avgLowerCargo}</th>
          <th>{team.avgCargoPoints}</th>
        </tr>
      {/each}
    </tbody>
  </table>
{/await}

<style>
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
