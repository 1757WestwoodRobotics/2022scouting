<script lang="ts">
  import { competitions, apiPort } from "../constants";

  let selected = competitions[0];

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
</script>

<svelte:head>
  <title>1757 Scouting Database</title>
</svelte:head>

<h1>FRC 2022 Scouting Area</h1>

<figure>
  <select name="Comp" bind:value={selected} on:change={updateData}>
    {#each competitions as comp}
      <option value={comp}>{comp.name}</option>
    {/each}
  </select>
  <p>selected {selected.id}</p>
</figure>

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
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>
