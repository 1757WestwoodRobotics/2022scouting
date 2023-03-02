<script context="module" lang="ts">
  import TeamMatchInfo from "../../components/TeamMatchInfo.svelte";
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const [eventName, matchType, matchNum] = params.iden.split("_");
    const res = await this.fetch(
      `process.BACKEND_URL/match/${eventName}/${matchType}/${matchNum}`
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

  let isPlayed = match.score_breakdown != null;
  if (!isPlayed) {
    match.score_breakdown = {
      red: { totalPoints: 0 },
      blue: { totalPoints: 0 },
    };
  }
</script>

<svelte:head>
  <title>{match.key}</title>
</svelte:head>

<div class="header">
  <span>
    <h1>{match.key}</h1>
    <a href={`enter?m=${matchInfo[0]}_${matchInfo[1]}_${matchInfo[2]}`}
      >Scout this match</a
    >
  </span>
  <span>
    {#each match.videos.filter((a) => a.type == "youtube") as video}
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/{video.key}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    {/each}
  </span>
</div>

{#if typeof match.statboticsPrediction !== "undefined"}
  <h2>
    Statbotics predicts: {match.statboticsPrediction.winner}<br />Diff: {Math.round(
      match.statboticsPrediction.difference
    )}
  </h2>
{/if}
<div class="content">
  <div>
    <h3 style="color:red;">Red Alliance</h3>
    {#if isPlayed}
      Auto
      <table>
        <tbody>
          {#each Object.values(match.score_breakdown.red.autoCommunity).reverse() as row}
            <tr>
              {#each row as node}
                <td
                  style={"background-color: " +
                    (node == "Cone"
                      ? "yellow"
                      : node == "Cube"
                      ? "purple"
                      : "inherit") +
                    ";"}
                />
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
      Teleop
      <table>
        <tbody>
          {#each Object.values(match.score_breakdown.red.teleopCommunity).reverse() as row}
            <tr>
              {#each row as node}
                <td
                  style={"background-color: " +
                    (node == "Cone"
                      ? "yellow"
                      : node == "Cube"
                      ? "purple"
                      : "inherit") +
                    ";"}
                />
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
    <h4>
      {#if isPlayed}
        Total points: {match.score_breakdown.red.totalPoints},
      {/if}
      expected points: {Math.round(match.redExpectedPoint)}
    </h4>
    {#each match.alliances.red.team_keys as team}
      <TeamMatchInfo matchData={match.teamData} team={team.substring(3)} />
    {/each}
  </div>
  <div>
    <h3 style="color:blue;">Blue Alliance</h3>
    {#if isPlayed}
      Auto
      <table>
        <tbody>
          {#each Object.values(match.score_breakdown.blue.autoCommunity).reverse() as row}
            <tr>
              {#each row as node}
                <td
                  style={"background-color: " +
                    (node == "Cone"
                      ? "yellow"
                      : node == "Cube"
                      ? "purple"
                      : "inherit") +
                    ";"}
                />
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
      Teleop
      <table>
        <tbody>
          {#each Object.values(match.score_breakdown.blue.teleopCommunity).reverse() as row}
            <tr>
              {#each row as node}
                <td
                  style={"background-color: " +
                    (node == "Cone"
                      ? "yellow"
                      : node == "Cube"
                      ? "purple"
                      : "inherit") +
                    ";"}
                />
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
    <h4>
      {#if isPlayed}
        Total points: {match.score_breakdown.blue.totalPoints},
      {/if}
      expected points: {Math.round(match.blueExpectedPoint)}
    </h4>
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
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    font-family: Trebuchet MS;
    color: #fff;
  }

  .content {
    font-family: Trebuchet MS;
    margin: 0 auto;
    color: #ffffff;
    font-weight: 700;
    display: grid;
    grid-template-columns: 1fr 1fr;
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
  td {
    width: 1em;
    height: 1em;
    border: 1px solid;
    margin: 0;
    padding: 0;
    line-height: 1;
  }
</style>
