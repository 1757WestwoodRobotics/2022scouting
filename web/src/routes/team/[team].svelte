<script context="module" lang="ts">
  import { apiUrl, competitions, limitSigfigs } from "../../constants";
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`${apiUrl}/team/${params.team}`);
    const data = await res.json();

    if (res.status === 200) {
      return { team: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  export let team: {
    nickname: string;
    team_number: number;
    city: string;
    rookieYear: string;
    avgUpperCargo: number;
    avgLowerCargo: number;
    avgTeleopCargo: number;
    avgAutoCargo: number;
    teleopConsistency: number;
    autoConsistency: number;
    highestClimb: number;
    avgClimb: number;
    notes: string[];
  };

  let selectedComp;

  const fetchMatches = async () => {
    const res = await self.fetch(
      `${apiUrl}/team/${team.team_number}/matches/${selectedComp.id}`
    );
    return res.json();
  };

  let promise = Promise.resolve([]);

  const updateMatches = () => {
    promise = fetchMatches();
  };

  let showNotes = false;
</script>

<svelte:head>
  <title>{team.nickname}</title>
</svelte:head>

<h1 style="display:inline;">{team.nickname}</h1>
{#if team.avatar !== undefined}
  <img
    style="position:absolute;right:2em;"
    src={`data:image/png;base64,${team.avatar}`}
  />
{/if}
<div class="content">
  {team.team_number}
  <br />
  <hr />
  Team averages:
  <h4>Cargo Points: {limitSigfigs(team.avgCargoPoints)}</h4>
  <div class="avgContainer">
    <div class="avgContent">
      <h3>Teleop</h3>
      <h4>Consistency: {limitSigfigs(team.teleopConsistency)}%</h4>
      <h4>Cargo #: {limitSigfigs(team.avgTeleopCargo)}</h4>
    </div>

    <div class="avgContent">
      <h3>Auto</h3>

      <h4>Consistency: {limitSigfigs(team.autoConsistency)}%</h4>
      <h4>Cargo #: {limitSigfigs(team.avgAutoCargo)}</h4>
    </div>

    <div class="avgContent">
      <h3>Climb</h3>
      <h4>Highest Climb Amount: {team.highestClimb}</h4>
      <h4>Avg Climb Points: {team.avgClimb}</h4>
    </div>
  </div>
  <p
    style="cursor:pointer;text-decoration:underline;"
    on:click={() => {
      showNotes = !showNotes;
    }}
  >
    Bot Notes
  </p>
  {#if showNotes}
    <ul>
      {#each team.notes as note}
        {#if note != ""}
          <li>{note}</li>
        {/if}
      {/each}
    </ul>
  {/if}

  <select name="Comp" bind:value={selectedComp} on:change={updateMatches}>
    <option value="" selected disabled>Select Competition</option>
    {#each competitions as comp}
      <option value={comp}>{comp.name}</option>
    {/each}
  </select>

  {#if typeof selectedComp !== "undefined"}
    {#await promise}
      <p>loading...</p>
    {:then data}
      <div id="matchContainer">
        {#each data as match}
          <div class="matchData">
            <br />
            <a
              href="../match/{selectedComp.id}_{match.id}"
              title={match.matchDat !== null ? match.matchDat.notes : undefined}
              >{match.id}</a
            >
            {#if match.matchDat !== null}
              Climb: {match.matchDat.climb_level}
              <table>
                <thead>
                  <tr>
                    <th />
                    <th>miss</th>
                    <th>lower</th>
                    <th>upper</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>auto</td>
                    <td>{match.matchDat.auto_cargo.miss}</td>
                    <td>{match.matchDat.auto_cargo.lower}</td>
                    <td>{match.matchDat.auto_cargo.upper}</td>
                  </tr>
                  <tr>
                    <td>teleop</td>
                    <td>{match.matchDat.teleop_cargo.miss}</td>
                    <td>{match.matchDat.teleop_cargo.lower}</td>
                    <td>{match.matchDat.teleop_cargo.upper}</td>
                  </tr>
                </tbody>
              </table>
            {:else}
              <p>this match has NOT been scouted yet</p>
            {/if}
          </div>
        {/each}
      </div>
    {/await}
  {/if}
</div>

<style>
  /*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/
  #matchContainer,
  .avgContainer {
    display: flex;
    flex-wrap: wrap;
    color: #fff;
    justify-content: space-evenly;
  }
  .matchData,
  .avgContent {
    flex-grow: 1;
    border: 2px solid #aaa;
    padding: 0.1em;
    margin: 0.1em;
  }
  .content :global(h2) {
    font-size: 1.4em;
    font-weight: 500;
  }

  .content :global(pre) {
    background-color: #f9f9f9;
    box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
    padding: 0.5em;
    border-radius: 2px;
    overflow-x: auto;
  }

  .content :global(pre) :global(code) {
    background-color: transparent;
    padding: 0;
  }

  .content :global(ul) {
    line-height: 1.5;
  }

  .content :global(li) {
    margin: 0 0 0.5em 0;
  }
</style>
