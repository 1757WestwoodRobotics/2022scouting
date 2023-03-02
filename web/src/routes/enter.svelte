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
          set_number: undefined,
        },
        auto_gamepiece: {
          top: 0,
          mid: 0,
          hybrid: 0,
          miss: 0,
        },
        teleop_gamepiece: {
          top: 0,
          mid: 0,
          hybrid: 0,
          miss: 0,
        },
        auto_charge: 0,
        teleop_charge: 0,
        scoring_capabilities: {
          cone: false,
          cube: false,
        },
        mobility: false,
        notes: "",
      },
    };
  }
</script>

<script lang="ts">
  import Counter from "../components/Counter.svelte";
  import Box from "../components/Box.svelte";
  import submit from "../images/button-submit.svg";
  import QRCode from "../components/qrcode.svelte";
  import { competitions, charge, dataToText, matchType } from "../constants";

  export let data;
  export let possibleTeams;

  let offline = false;
  let offlineDat = [];

  $: qrDat =
    offlineDat.length > 0
      ? dataToText(offlineDat[offlineDat.length - 1])
      : "None";

  const upload = () => {
    fetch(`process.BACKEND_URL/scout/upload`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        alert("submitted");
        data.identifier.team = 0;
        data.identifier.match_number = 0;
        data.auto_gamepiece = { top: 0, mid: 0, hybrid: 0, miss: 0 };
        data.teleop_gamepiece = { top: 0, mid: 0, hybrid: 0, miss: 0 };
        data.auto_charge = 0;
        data.teleop_charge = 0;
        data.mobility = false;
        data.scoring_capabilities = { cone: false, cube: false };
        data.notes = "";
        data.identifier.set_number = undefined;
      })
      .catch((e) => {
        offline = true;
        console.log("Offline");
        offlineDat.push(JSON.parse(JSON.stringify(data))); // if this wasn't here it would've put the reference to data
        offlineDat = offlineDat;
        alert("Offline Cached");
        data.identifier.team = 0;
        data.identifier.match_number = 0;
        data.auto_gamepiece = { top: 0, mid: 0, hybrid: 0, miss: 0 };
        data.teleop_gamepiece = { top: 0, mid: 0, hybrid: 0, miss: 0 };
        data.auto_charge = 0;
        data.teleop_charge = 0;
        data.mobility = false;
        data.scoring_capabilities = { cone: false, cube: false };
        data.notes = "";
        data.identifier.set_number = undefined;
      });
  };

  const uploadBulk = () => {
    offlineDat.forEach((dat) => {
      fetch(`process.BACKEND_URL/scout/upload`, {
        method: "POST",
        body: JSON.stringify(dat),
        headers: { "Content-Type": "application/json" },
      });
      offlineDat = [];
    });
    alert("bulk uploaded");
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
    {#if data.identifier.comp_level && data.identifier.comp_level != "qm"}
      <span
        >Set Number: <input
          bind:value={data.identifier.set_number}
          type="number"
        /></span
      >
      <br />
    {/if}
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
  <br />
  <Box header="Auto Mobil">
    Mobility
    <input type="checkbox" bind:checked={data.mobility} />
  </Box>
  <Box header="Auto">
    <Counter bind:value={data.auto_gamepiece.top} name="Top" />
    <Counter bind:value={data.auto_gamepiece.mid} name="Mid" />
    <Counter bind:value={data.auto_gamepiece.hybrid} name="Hybrid" />
    <Counter bind:value={data.auto_gamepiece.miss} name="Miss" />
  </Box>
  <Box header="Auto Charge">
    <select name="auto_charge" bind:value={data.auto_charge}>
      {#each charge as stage}
        <option value={stage.amount}>{stage.name}</option>
      {/each}
    </select>
  </Box>
  <br />
  <Box header="Teleop">
    <Counter bind:value={data.teleop_gamepiece.top} name="Top" />
    <Counter bind:value={data.teleop_gamepiece.mid} name="Mid" />
    <Counter bind:value={data.teleop_gamepiece.hybrid} name="Hybrid" />
    <Counter bind:value={data.teleop_gamepiece.miss} name="Miss" />
  </Box>
  <Box header="Teleop Charge">
    <select name="teleop_charge" bind:value={data.teleop_charge}>
      {#each charge as stage}
        <option value={stage.amount}>{stage.name}</option>
      {/each}
    </select>
  </Box>
  <br />
  <Box header="Scoring Capabilities">
    Cone
    <input type="checkbox" bind:checked={data.scoring_capabilities.cone} />
    <br />
    Cube
    <input type="checkbox" bind:checked={data.scoring_capabilities.cube} />
  </Box>
  <Box header="Notes">
    <textarea bind:value={data.notes} />
  </Box>
</div>
<br />

<input
  class="submit"
  type="image"
  on:click={upload}
  src={submit}
  alt="submit"
/>
<br />
{#if offline}
  <input
    class="bulkUpload"
    on:click={uploadBulk}
    type="button"
    value="Bulk Upload"
  />
  <QRCode squareSize="200px" codeValue={qrDat} />
{/if}

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
    flex-direction: column;
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
  textarea,
  input {
    background-color: rgb(49, 49, 49);
    color: rgb(255, 255, 255);
    border: 2px;
    border-color: white;
  }
  input[type="number"] {
    width: 3em;
  }
  .submit,
  .bulkUpload {
    display: block;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
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
