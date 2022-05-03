<script lang="ts">
  import { competitions } from "../constants";
  import Box from "../components/Box.svelte";
  let possibleTeams = [];
  let data = {
    comp: "",
    note: "",
    team: 0,
    key: "",
    author: "",
  };
  const upload = () => {
    fetch(`process.BACKEND_URL/scout/notes`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).then((a) => {
      if (a.status == 401) {
        alert("INCORRECT INFORMATION");
      } else {
        alert("submitted");
        data.note = "";
        data.team = 0;
      }
    });
  };
</script>

<svelte:head>
  <title>Scout Lead Enter</title>
</svelte:head>

<div class="container-1">
  <Box --box-width="46em" header="Scout Lead Notes">
    <strong
      >As these notes are used in major decisions, they should be taken with
      care</strong
    >
    <br />
    <p>
      If you do not know the scouting key, <i>and you should</i><br /><strong
        >CONSULT THE E BOARD OR A MENTOR</strong
      >
    </p>
    <hr />
    <input type="password" bind:value={data.key} placeholder="Scouting Key" />
    <input bind:value={data.author} placeholder="Your Name" />
    <br />
    <select name="Comp" bind:value={data.comp}>
      <option value="" selected disabled>Select Competition</option>
      {#each competitions as comp}
        <option value={comp.id}>{comp.name}</option>
      {/each}
    </select>
    Team Number
    <input bind:value={data.team} type="number" placeholder="Team Number" />
    <br />
    <textarea bind:value={data.note} />
    <br />
    <input type="submit" on:click={upload} />
  </Box>
</div>

<style>
  .container-1 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  textarea {
    width: 100%;
    min-height: 5em;
    min-width: 100%;
    max-width: 100%;
  }
</style>
