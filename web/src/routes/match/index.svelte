<script lang="ts">
  import { competitions, matchType, limitSigfigs } from "../../constants";
  import { goto } from "@sapper/app";

  let compIden = "mawor";
  let matchNum = 0;
  let mType = "qm";
  const handleSubmit = async () => {
    await goto(`match/${compIden}_${mType}_${matchNum}`);
  };

  const fetchData = async () => {
    const res = await self.fetch(
      `process.BACKEND_URL/event/${compIden}/matches`
    );
    return res.json();
  };

  let promise = fetchData();
  let filter = "";

  const updateData = () => {
    promise = fetchData();
  };

  const colorData = (dat, green) => {
    const hue = (dat / green) * 120;
    return `background-color: hsl(${hue},100%,50%); color: black;`;
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
    {#if filter == "" || match.red
        .concat(match.blue)
        .map((a) => a.id)
        .includes(filter)}
      <div class="matchContainer">
        <div>
          <a
            href={"match/" +
              compIden +
              "_" +
              match.match_type +
              "_" +
              (match.match_type != "qm" ? match.set_number + "m" : "") +
              match.match_number}
            class="matchNum"
            >{match.match_type}
            {(match.match_type != "qm" ? match.set_number + "m" : "") +
              match.match_number}</a
          >
          {#if typeof match.statbotics_dat !== "undefined"}
            <p>
              Statbotics Predictions:<br />{match.statbotics_dat.winner} ({match
                .statbotics_dat.difference})
            </p>
          {/if}
        </div>
        <span>
          <div class="allianceHolder th-b">
            <p class="totalMatchPointExpectedHolder">
              {limitSigfigs(
                match.blue
                  .map((a) => a.gamepiece + a.autoCharge + a.teleopCharge)
                  .reduce((a, b) => a + b)
              )}
            </p>
            {#each match.blue as team}
              <div class="teamHolder">
                <img
                  class="teamImg"
                  src={team.av != undefined
                    ? `data:image/png;base64,${team.av}`
                    : undefined}
                />
                <a
                  href="team/{team.id}"
                  style={team.id == filter ? "color:blue" : undefined}
                  class="teamTitle">{team.id}</a
                >
                <p class="teamName">{team.name}</p>
                <p
                  style={colorData(
                    team.gamepiece + team.autoCharge + team.teleopCharge,
                    43
                  )}
                >
                  <b
                    >TOT<br />{limitSigfigs(
                      team.gamepiece + team.autoCharge + team.teleopCharge
                    )}</b
                  >
                </p>
                <p style={colorData(team.autoCharge, 12)}>
                  ACRG<br />{limitSigfigs(team.autoCharge)}
                </p>
                <p style={colorData(team.teleopCharge, 10)}>
                  TCRG<br />{limitSigfigs(team.teleopCharge)}
                </p>
                <p style={colorData(team.gamepiece, 45)}>
                  GMPC<br />{limitSigfigs(team.gamepiece)}
                </p>
              </div>
            {/each}
          </div>
        </span>
        <span>
          <div class="allianceHolder th-r">
            <p class="totalMatchPointExpectedHolder">
              {limitSigfigs(
                match.red.map((a) => a.cargo + a.climb).reduce((a, b) => a + b)
              )}
            </p>
            {#each match.red as team}
              <div class="teamHolder">
                <img
                  class="teamImg"
                  src={team.av != undefined
                    ? `data:image/png;base64,${team.av}`
                    : undefined}
                />
                <a
                  href="team/{team.id}"
                  style={team.id == filter ? "color:red" : undefined}
                  class="teamTitle">{team.id}</a
                >
                <p class="teamName">{team.name}</p>
                <p
                  style={colorData(
                    team.gamepiece + team.autoCharge + team.teleopCharge,
                    43
                  )}
                >
                  <b
                    >TOT<br />{limitSigfigs(
                      team.gamepiece + team.autoCharge + team.teleopCharge
                    )}</b
                  >
                </p>
                <p style={colorData(team.autoCharge, 12)}>
                  ACRG<br />{limitSigfigs(team.autoCharge)}
                </p>
                <p style={colorData(team.teleopCharge, 10)}>
                  TCRG<br />{limitSigfigs(team.teleopCharge)}
                </p>
                <p style={colorData(team.gamepiece, 45)}>
                  GMPC<br />{limitSigfigs(team.gamepiece)}
                </p>
              </div>
            {/each}
          </div>
        </span>
      </div>
    {/if}
  {/each}
{/await}

<style>
  .totalMatchPointExpectedHolder {
    grid-column-start: 4;
    grid-column-end: 1;
    text-align: center;
  }
  .teamName {
    grid-column-start: 2;
    grid-column-end: 5;
  }
  .teamHolder p {
    margin: 0.1em;
  }
  .teamHolder p:not(.teamName) {
    text-align: center;
  }
  .teamImg {
    grid-row-start: 1;
    grid-row-end: 3;
    height: 40px;
    width: 40px;
    image-rendering: pixelated;
    margin: 0.4em;
  }
  .matchNum {
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
  .teamTitle {
    grid-column-start: 2;
    grid-column-end: 5;
  }
  .allianceHolder {
    display: grid;
    grid-template-columns: auto auto auto;
  }
  .th-r .teamHolder {
    border-color: red;
  }
  .th-b .teamHolder {
    border-color: blue;
  }
  .teamHolder {
    margin: 0.2em;
    border: 2px solid;
    display: grid;
    grid-template-columns: auto auto auto auto;
    padding: 0.2em;
    grid-column-gap: 0.5em;
  }
  .matchContainer {
    display: grid;
    grid-template-columns: 1fr 6fr 6fr;
    width: calc(100% - 2em);
    font-size: 10px;
    min-width: 500px;
    border: 2px solid black;
    padding: 1em;
    grid-column-gap: 0.5em;
  }
  span a {
    font-family: monospace;
  }
  .matchContainer * {
    flex-grow: 1;
  }
  :global(main) {
    max-width: unset !important;
  }
</style>
