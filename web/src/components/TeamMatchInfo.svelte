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
          <th>Climb</th>
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
          <th
            >{limitSigfigs(
              matchData[team].totalPercentContributionToClimb * 100
            )}%</th
          >
        </tr>
        <tr>
          <th>Raw Points</th>
          <th>{limitSigfigs(matchData[team].totalPointsByTeam)}</th>
          <th>{limitSigfigs(matchData[team].totalAutoPoints)}</th>
          <th>{limitSigfigs(matchData[team].totalTeleopPoints)}</th>
          <th>{limitSigfigs(matchData[team].totalClimbPoints)}</th>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th />
          <th>Miss</th>
          <th>Upper</th>
          <th>Lower</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Auto</th>
          <th>{limitSigfigs(matchData[team].autoCargo.miss)}</th>
          <th>{limitSigfigs(matchData[team].autoCargo.upper)}</th>
          <th>{limitSigfigs(matchData[team].autoCargo.lower)}</th>
        </tr>
        <tr>
          <th>Teleop</th>
          <th>{limitSigfigs(matchData[team].teleopCargo.miss)}</th>
          <th>{limitSigfigs(matchData[team].teleopCargo.upper)}</th>
          <th>{limitSigfigs(matchData[team].teleopCargo.lower)}</th>
        </tr>
      </tbody>
    </table>
    <p>
      Alone, {team} got {(matchData[team].autoCargo.upper +
        matchData[team].autoCargo.lower +
        matchData[team].teleopCargo.upper +
        matchData[team].teleopCargo.lower) *
        5}% of the cargo RP, cycled {matchData[team].teleopCargo.upper +
        matchData[team].teleopCargo.lower +
        matchData[team].teleopCargo.miss} cargo during teleop, and got {(matchData[
        team
      ].totalClimbPoints /
        16) *
        100}% of the climb RP
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
