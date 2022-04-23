<script context="module" lang="ts">
  import { competitions, matchType } from "../../constants";

  let compIden = "mawor";
  let matchNum = 0;
  let mType = "qm";
  const handleSubmit = () => {
    location.href += `/${compIden}_${mType}_${matchNum}`;
  };
</script>

<svelte:head>
  <title>Matches</title>
</svelte:head>

<p>Go to match</p>
<form on:submit|preventDefault={handleSubmit}>
  <span>Match Number<input bind:value={matchNum} type="number" /></span>
  <select name="Comp" bind:value={compIden}>
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

<style>
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
</style>
