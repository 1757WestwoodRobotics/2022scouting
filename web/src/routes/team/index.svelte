<script context="module" lang="ts">
  import Box from "../../components/Box.svelte";
  import { goto } from "@sapper/app";
  let teamNum = 1757;
  const handleSubmit = async () => {
    await goto(`team/${teamNum}`);
  };
</script>

<svelte:head>
  <title>Teams</title>
</svelte:head>
<Box title="Go to team" --box-width="auto">
  <form on:submit|preventDefault={handleSubmit}>
    <input bind:value={teamNum} />
    <input type="submit" />
  </form>
</Box>

<style>
  input {
    font-size: 1em;
    width: 100%;
    height: 2em;
    background-color: rgb(33, 33, 33);
    border-color: #ffffff;
    border-width: 0.1em;
    color: rgb(255, 255, 255);
    text-align: center;
  }
</style>
