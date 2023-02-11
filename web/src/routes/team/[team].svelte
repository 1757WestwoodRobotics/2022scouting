<script context="module" lang="ts">
  import { competitions, limitSigfigs } from "../../constants";
  import { Line } from "svelte-chartjs";
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`process.BACKEND_URL/team/${params.team}`);
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
    rookieYear: number;
    city: string;
    avatar: string | undefined;
    avgTeleopGP: number;
    avgAutoGP: number;
    teleopConsistency: number;
    autoConsistency: number;
    highestAutoDock: number;
    highestTeleopDock: number;
    avgAutoDock: number;
    avgTeleopDock: number;
    avgTopGP: number;
    avgMidGP: number;
    avgHybridGP: number;
    avgGPPoints: number;
    avgGPCycledTeleop: number;
    sd: number;
    conePreference: number;
    cubePreference: number;
    notes: string[];
    imp_notes: string[];
  };

  let selectedComp;

  const fetchMatches = async () => {
    const res = await self.fetch(
      `process.BACKEND_URL/team/${team.team_number}/matches/${selectedComp.id}`
    );
    return res.json();
  };

  let promise = Promise.resolve([]);

  const updateMatches = () => {
    promise = fetchMatches();
  };

  let showNotes = false;
  let chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Matches over Time",
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Pts",
        },
        suggestedMin: 0,
        suggestedMax: 50,
        stack: "stack",
        stackWeight: 2,
        grid: {
          borderColor: "#ff0000",
        },
      },
      y1: {
        display: true,
        title: {
          display: true,
          text: "%",
        },
        suggestedMin: 0,
        suggestedMax: 100,
        offset: true,
        position: "left",
        stack: "stack",
        stackWeight: 1,

        grid: {
          borderColor: "#0000ff",
        },
      },
    },
  };

  const calcGraphData = (data) => {
    let matches = data
      .filter((a) => a.matchDat !== null)
      .sort(
        (a, b) => parseInt(a.id.substring(3)) - parseInt(b.id.substring(3))
      );
    const chartLabels = matches.map((a) => a.id);

    const autoTop = matches.map((a) => a.matchDat.auto_gamepiece.top * 6);
    const autoMid = matches.map((a) => a.matchDat.auto_gamepiece.mid * 4);
    const autoHybrid = matches.map((a) => a.matchDat.auto_gamepiece.hybrid * 3);

    const autoAcc = matches.map(
      (a) =>
        ((a.matchDat.auto_gamepiece.top + a.matchDat.auto_gamepiece.mid + a.matchDat.auto_gamepiece.hybrid) /
        ((a.matchDat.auto_gamepiece.top + a.matchDat.auto_gamepiece.mid + a.matchDat.auto_gamepiece.hybrid) /
            a.matchDat.auto_gamepiece.miss)) *
        100
    );

    const teleopTop = matches.map((a) => a.matchDat.teleop_gamepiece.top * 5);
    const teleopMid = matches.map((a) => a.matchDat.teleop_gamepiece.mid * 3);
    const teleopHybrid = matches.map((a) => a.matchDat.teleop_gamepiece.hybrid * 2);
    const teleopAcc = matches.map(
      (a) =>
        ((a.matchDat.teleop_gamepiece.top + a.matchDat.teleop_gamepiece.mid + a.matchDat.teleop_gamepiece.hybrid) /
        ((a.matchDat.teleop_gamepiece.top + a.matchDat.teleop_gamepiece.mid + a.matchDat.teleop_gamepiece.hybrid) /
            a.matchDat.teleop_gamepiece.miss)) *
        100
    );

    const autoCharge = matches.map((a) => a.matchDat.auto_charge);
    const teleopCharge = matches.map((a) => a.matchDat.teleop_charge);
    
    const totalPoints = matches.map(
      (a) =>
        a.matchDat.auto_charge +
        a.matchDat.teleop_charge +
        a.matchDat.teleop_gamepiece.top * 5 +
        a.matchDat.teleop_gamepiece.mid * 3 +
        a.matchDat.teleop_gamepiece.hybrid * 2 +
        a.matchDat.auto_gamepiece.top * 6 +
        a.matchDat.auto_gamepiece.mid * 4 +
        a.matchDat.auto_gamepiece.hybrid * 3
    );

    return {
      labels: chartLabels,
      datasets: [
        {
          label: "Auto Top",
          data: autoTop,
          borderColor: "#00aaff",
          fill: false,
        },
        {
          label: "Auto Mid",
          data: autoMid,
          borderColor: "#00ccff",
          fill: false,
        },
        {
          label: "Auto Hybrid",
          data: autoHybrid,
          borderColor: "#00ccff",
          fill: false,
        },
        {
          label: "Auto Accuracy",
          data: autoAcc,
          borderColor: "#00ffff",
          fill: false,
          yAxisID: "y1",
        },
        {
          label: "Teleop Upper",
          data: teleopTop,
          borderColor: "#ffaa00",
          fill: false,
        },
        {
          label: "Teleop Mid",
          data: teleopMid,
          borderColor: "#ffaa00",
          fill: false,
        },
        {
          label: "Teleop Lower",
          data: teleopHybrid,
          borderColor: "#ffcc00",
          fill: false,
        },
        {
          label: "Teleop Accuracy",
          data: teleopAcc,
          borderColor: "#ffff00",
          fill: false,
          yAxisID: "y1",
        },
        {
          label: "Auto Charge",
          data: autoCharge,
          borderColor: "#99ff99",
          fill: false,
        },
        {
          label: "Teleop Charge",
          data: teleopCharge,
          borderColor: "#99ff99",
          fill: false,
        },
        {
          label: "Total Points",
          data: totalPoints,
          borderColor: "#ffffff",
          fill: false,
        },
      ],
    };
  };
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
  <h4>Gamepiece Points: {limitSigfigs(team.avgGPPoints)}</h4>
  <div class="avgContainer">
    <div class="avgContent">
      <h3>Teleop</h3>
      <h4>Consistency: {limitSigfigs(team.teleopConsistency)}%</h4>
      <h4>GP #: {limitSigfigs(team.avgTeleopGP)}</h4>
    </div>

    <div class="avgContent">
      <h3>Auto</h3>

      <h4>Consistency: {limitSigfigs(team.autoConsistency)}%</h4>
      <h4>GP #: {limitSigfigs(team.avgAutoGP)}</h4>
    </div>

    <div class="avgContent">
      <h3>Charge</h3>
      <div>
        <h4>Auto</h4>
        <h5>Highest Charge Amount: {team.highestAutoDock}</h5>
        <h5>Avg Charge Points: {team.avgAutoDock}</h5>
      </div>
      <div>
        <h4>Teleop</h4>
        <h5>Highest Charge Amount: {team.highestTeleopDock}</h5>
        <h5>Avg Charge Points: {team.avgTeleopDock}</h5>
      </div>
    </div>
  </div>
    <div class="avgContainer">
    <div class="avgContent">
      <h3>Gamepiece preference</h3>
      <h4>Cone: {team.conePreference}%</h4>
      <h4>Cube: {team.cubePreference}%</h4>
    </div>
      <div class="avgContent">
      <h3>Avg GP division</h3>
      <h4>Top: {team.avgTopGP} ({limitSigfigs(team.avgTopGP / (team.avgTeleopGP + team.avgAutoGP) * 100)} %)</h4>
      <h4>Mid: {team.avgMidGP} ({limitSigfigs(team.avgMidGP / (team.avgTeleopGP + team.avgAutoGP) * 100)} %)</h4>
      <h4>Hybrid: {team.avgHybridGP} ({limitSigfigs(team.avgHybridGP / (team.avgTeleopGP + team.avgAutoGP) * 100)} %)</h4>
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
      <li>Lead Notes:</li>
      <ul>
        {#each team.imp_notes as note}
          {#if note != ""}
            <li>{note}</li>
          {/if}
        {/each}
      </ul>
      <li>Team Notes:</li>
      <ul>
        {#each team.notes as note}
          {#if note[0] != ""}
            <li>{note[0]} ({note[1]})</li>
          {/if}
        {/each}
      </ul>
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
              href="match/{selectedComp.id}_{match.id}"
              title={match.matchDat !== null ? match.matchDat.notes : undefined}
              >{match.id}</a
            >
            {#if match.matchDat !== null}
              Auto Dock: {match.matchDat.auto_charge}
              Teleop Dock: {match.matchDat.teleop_charge}
              <table>
                <thead>
                  <tr>
                    <th />
                    <th>miss</th>
                    <th>top</th>
                    <th>mid</th>
                    <th>hybrid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>auto</td>
                    <td>{match.matchDat.auto_gamepiece.miss}</td>
                    <td>{match.matchDat.auto_gamepiece.top}</td>
                    <td>{match.matchDat.auto_gamepiece.mid}</td>
                    <td>{match.matchDat.auto_gamepiece.hybrid}</td>
                  </tr>
                  <tr>
                    <td>teleop</td>
                    <td>{match.matchDat.teleop_gamepiece.miss}</td>
                    <td>{match.matchDat.teleop_gamepiece.top}</td>
                    <td>{match.matchDat.teleop_gamepiece.mid}</td>
                    <td>{match.matchDat.teleop_gamepiece.hybrid}</td>
                  </tr>
                </tbody>
              </table>
            {:else}
              <p>this match has NOT been scouted yet</p>
            {/if}
          </div>
        {/each}
      </div>
      <div class="contancontain">
        <div class="graph-container">
          <Line data={calcGraphData(data)} options={chartOptions} />
        </div>
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
  .graph-container {
    width: 100%;
    min-width: 686px;
  }
  .contancontain {
    overflow-x: scroll;
    width: 100%;
  }
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
