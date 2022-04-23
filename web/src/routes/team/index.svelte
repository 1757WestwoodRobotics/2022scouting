<script context="module" lang="ts">
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

<p>Go to team</p>
<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={teamNum} />
  <button disabled={!teamNum} type="submit">Enter</button>
</form>

<style>
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
</style>
