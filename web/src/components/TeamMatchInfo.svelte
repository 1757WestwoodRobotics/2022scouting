<script>
  import { limitSigfigs } from "../constants";
  export let team = 1757;
  export let matchData = {};
</script>

<div>
  <h2><a href="team/{team}">{team}</a></h2>
  {#if typeof matchData[team] === "undefined"}
    <p>No Data for this match on this team</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th />
          <th>Overall</th>
          <th>Auto</th>
          <th>Teleop</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Contribution</th>
          <th
            >{limitSigfigs(
              matchData[team].totalPercentContributionToMatch * 100
            )}%</th
          >
          <th
            >{limitSigfigs(
              matchData[team].totalPercentContributionToAuto * 100
            )}%</th
          >
          <th
            >{limitSigfigs(
              matchData[team].totalPercentContributionToTeleop * 100
            )}%</th
          >
        </tr>
        <tr>
          <th>Raw Points</th>
          <th>{limitSigfigs(matchData[team].totalPointsByTeam)}</th>
          <th>{limitSigfigs(matchData[team].totalAutoPoints)}</th>
          <th>{limitSigfigs(matchData[team].totalTeleopPoints)}</th>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th />
          <th>Miss</th>
          <th>Top</th>
          <th>Mid</th>
          <th>Hybrid</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Auto</th>
          <th>{limitSigfigs(matchData[team].autoGP.miss)}</th>
          <th>{limitSigfigs(matchData[team].autoGP.upper)}</th>
          <th>{limitSigfigs(matchData[team].autoGP.mid)}</th>
          <th>{limitSigfigs(matchData[team].autoGP.hybrid)}</th>
        </tr>
        <tr>
          <th>Teleop</th>
          <th>{limitSigfigs(matchData[team].teleopGP.miss)}</th>
          <th>{limitSigfigs(matchData[team].teleopGP.upper)}</th>
          <th>{limitSigfigs(matchData[team].teleopGP.mid)}</th>
          <th>{limitSigfigs(matchData[team].teleopGP.hybrid)}</th>
        </tr>
      </tbody>
    </table>
    <p>
      Alone, {team} got {(matchData[team].autoGP.top +
        matchData[team].autoGP.mid +
        matchData[team].autoGP.hybrid +
        matchData[team].teleopGP.top +
        matchData[team].teleopGP.mid + matchData[team].teleopGP.hybrid) *
        100 / 15}% of the link RP, cycled {matchData[team].teleopGP.top +
        matchData[team].teleopGP.mid +
        matchData[team].teleopGP.hybrid +
        matchData[team].teleopGP.miss} gp during teleop, and got {(matchData[
        team
      ].activationBonusContrib /
        26) *
        100}% of the activation RP
    </p>
    <p>Scout notes:<br />{matchData[team].notes}</p>
  {/if}
</div>

<style>
  div {
    border: 0.1em solid black;
    padding: 1em;
  }
</style>
