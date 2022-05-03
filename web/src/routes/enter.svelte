<script lang="ts" context="module">
  export async function preload({ query }) {
    let [comp, comp_level, match_number] = ["", "", 0];
    let possibleTeams = [0];
    if (typeof query["m"] !== "undefined") {
      [comp, comp_level, match_number] = query["m"].split("_");
      const dat = await this.fetch(`process.BACKEND_URL/event/${comp}/simple`);
      const json = await dat.json();
      possibleTeams = json;
    }
    return {
      possibleTeams,
      data: {
        identifier: {
          team: 0,
          comp,
          comp_level,
          match_number,
        },
        auto_cargo: {
          upper: 0,
          lower: 0,
          miss: 0,
        },
        teleop_cargo: {
          upper: 0,
          lower: 0,
          miss: 0,
        },
        climb_level: 0,
        notes: "",
      },
    };
  }
</script>

<script lang="ts">
  import Counter from "../components/Counter.svelte";
  import Box from "../components/Box.svelte";
  import submit from "../images/button-submit.svg";
  import { competitions, climb, matchType } from "../constants";

  export let data;
  export let possibleTeams;

  const upload = () => {
    fetch(`process.BACKEND_URL/scout/upload`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      alert("submitted");
      data.identifier.team = 0;
      data.identifier.match_number = 0;
      data.auto_cargo = { upper: 0, lower: 0, miss: 0 };
      data.teleop_cargo = { upper: 0, lower: 0, miss: 0 };
      data.climb_level = 0;
      data.notes = "";
    });
  };

  const updatePossibleTeams = () => {
    fetch(`process.BACKEND_URL/event/${data.identifier.comp}/simple`)
      .then((r) => r.json())
      .then((r) => {
        possibleTeams = r;
      });
  };
</script>

<svelte:head>
  <title>Enter Match Data</title>
</svelte:head>

<div class="container-1">
  <Box --box-width="46em" header="Match Info">
    <select
      name="Comp"
      bind:value={data.identifier.comp}
      on:change={updatePossibleTeams}
    >
      <option value="" selected disabled>Select Competition</option>
      {#each competitions as comp}
        <option value={comp.id}>{comp.name}</option>
      {/each}
    </select>
    <select name="Type" bind:value={data.identifier.comp_level}>
      <option value="" selected disabled>Select Match Type</option>
      {#each matchType as type}
        <option value={type.id}>{type.name}</option>
      {/each}
    </select>
    <span
      >Match Number: <input
        bind:value={data.identifier.match_number}
        type="number"
      /></span
    >
    <br />
    <span
      >Team Number: <input bind:value={data.identifier.team} type="number" />
    </span>
    {#if !possibleTeams.includes(data.identifier.team)}
      <p style="color:red;"><strong>WARNING</strong> team not part of comp</p>
    {/if}
  </Box>
  <Box header="Auto">
    <Counter bind:value={data.auto_cargo.upper} name="Upper" />
    <Counter bind:value={data.auto_cargo.lower} name="Lower" />
    <Counter bind:value={data.auto_cargo.miss} name="Miss" />
  </Box>
  <Box header="Teleop">
    <Counter bind:value={data.teleop_cargo.upper} name="Upper" />
    <Counter bind:value={data.teleop_cargo.lower} name="Lower" />
    <Counter bind:value={data.teleop_cargo.miss} name="Miss" />
  </Box>
  <Box header="Climb Level">
    <select name="climb" bind:value={data.climb_level}>
      {#each climb as stage}
        <option value={stage.amount}>{stage.name}</option>
      {/each}
    </select>
  </Box>
  <Box header="Notes">
    <textarea bind:value={data.notes} />
  </Box>
</div>
<br />

<input class="submit" type="image" on:click={upload} src={submit} alt="bruh" />

<style>
  span {
    color: white;
    font-size: 1.2em;
  }
  .container-1 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }

  select {
    font-size: 1em;
    width: 100%;
    height: 2em;
    background-color: rgb(33, 33, 33);
    border-color: #ffffff;
    border-width: 0.1em;
    color: rgb(255, 255, 255);
    margin-bottom: 1em;
  }
  input {
    width: 3em;
  }
  textarea,
  input {
    background-color: rgb(49, 49, 49);
    color: rgb(255, 255, 255);
    border: 2px;
    border-color: white;
  }
  .submit {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 35%;
    background-color: rgb(0, 0, 0, 0);
    border: 0px;
  }
</style>
