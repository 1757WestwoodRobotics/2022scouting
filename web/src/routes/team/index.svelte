<script context="module" lang="ts">
  import Box from "../../components/Box.svelte";
  let teamNum = 1757;
  const handleSubmit = () => {
    location.href += `/${teamNum}`;
  };
</script>

<script lang="ts">
  export let posts: { slug: string; title: string; html: any }[];
</script>

<svelte:head>
  <title>Teams</title>
</svelte:head>
<Box title="Go to team" --box-width="auto">
  <form on:submit|preventDefault={handleSubmit}>
    <input bind:value={teamNum} />
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
