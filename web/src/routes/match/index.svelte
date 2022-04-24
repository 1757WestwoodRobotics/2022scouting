<script lang="ts">
  import { competitions, matchType, apiPort } from "../../constants";

  let compIden = "mawor";
  let matchNum = 0;
  let mType = "qm";
  const handleSubmit = () => {
    location.href += `/${compIden}_${mType}_${matchNum}`;
  };

  const fetchData = async () => {
    const res = await self.fetch(
      `http://localhost:${apiPort}/event/${compIden}/matches`
    );
    return res.json();
  };

  let promise = fetchData();
  let filter = "";

  const updateData = () => {
    promise = fetchData();
  };
</script>

<svelte:head>
  <title>Matches</title>
</svelte:head>

<p>Go to match</p>
<form on:submit|preventDefault={handleSubmit}>
  <span>Match Number<input bind:value={matchNum} type="number" /></span>
  <select name="Comp" bind:value={compIden} on:change={updateData}>
    {#each competitions as comp}
      <option value={comp.id}>{comp.name}</option>
    {/each}
  </select>
  <select name="Type" bind:value={mType}>
    {#each matchType as typeo}
      <option value={typeo.id}>{typeo.name}</option>
    {/each}
  </select>
  <button type="submit">Enter</button>
</form>
<input bind:value={filter} placeholder="Filter teams" />

{#await promise}
  <p>fetching matches...</p>
{:then matches}
  {#each matches as match}
    {#if filter == "" || match.red.concat(match.blue).includes(filter)}
      <div class="matchContainer">
        <a
          href={"match/" +
            compIden +
            "_" +
            match.match_type +
            "_" +
            (match.match_type != "qm" ? match.set_number + "m" : "") +
            match.match_number}
          >{match.match_type}
          {(match.match_type != "qm" ? match.set_number + "m" : "") +
            match.match_number}</a
        >
        <span>
          <strong>red</strong>
          {#each match.red as team}
            <a
              href="../team/{team}"
              style={team == filter ? "color:red" : undefined}>{team}</a
            >&nbsp;
          {/each}
        </span>
        <span>
          <strong>blue</strong>
          {#each match.blue as team}
            <a
              href="../team/{team}"
              style={team == filter ? "color: blue" : undefined}>{team}</a
            >&nbsp;
          {/each}
        </span>
      </div>
    {/if}
  {/each}
{/await}

<style>
  .matchContainer {
    display: grid;
    grid-template-columns: 1fr 3fr 3fr;
    width: 50%;
    min-width: 500px;
  }
  span a {
    font-family: monospace;
  }
  .matchContainer * {
    flex-grow: 1;
  }
</style>
