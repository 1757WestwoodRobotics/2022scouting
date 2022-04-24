<script context="module" lang="ts">
  import { apiPort } from "../../constants";
  import TeamMatchInfo from "../../components/TeamMatchInfo.svelte";
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const [eventName, matchType, matchNum] = params.iden.split("_");
    const res = await this.fetch(
      `http://localhost:${apiPort}/match/${eventName}/${matchType}/${matchNum}`
    );
    const data = await res.json();

    if (res.status === 200) {
      return { match: data, matchInfo: [eventName, matchType, matchNum] };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  export let match;
  export let matchInfo;
</script>

<svelte:head>
  <title>{match.key}</title>
</svelte:head>

<div class="header">
  <h1>{match.key}</h1>
  <a href={`../enter?m=${matchInfo[0]}_${matchInfo[1]}_${matchInfo[2]}`}
    >Scout this match</a
  >
</div>

<div class="content">
  <div>
    <h3>Red Alliance</h3>
    {#each match.alliances.red.team_keys as team}
      <TeamMatchInfo matchData={match.teamData} team={team.substring(3)} />
    {/each}
  </div>
  <div>
    <h3>Blue Alliance</h3>
    {#each match.alliances.blue.team_keys as team}
      <TeamMatchInfo matchData={match.teamData} team={team.substring(3)} />
    {/each}
  </div>
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
  .header {
    font-family: Trebuchet MS;
    color: #fff;
  }

  .content {
    font-family: Trebuchet MS;
    margin: 0 auto;
    color: #ffffff;
    font-weight: 700;
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
