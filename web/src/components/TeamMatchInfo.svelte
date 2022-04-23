<script>
  export let team = 1757;
  export let matchData = {};
</script>

<div>
  <h4>{team}</h4>
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
          <th>{matchData[team].totalPercentContributionToMatch * 100}%</th>
          <th>{matchData[team].totalPercentContributionToAuto * 100}%</th>
          <th>{matchData[team].totalPercentContributionToTeleop * 100}%</th>
          <th>{matchData[team].totalPercentContributionToClimb * 100}%</th>
        </tr>
        <tr>
          <th>Raw Points</th>
          <th>{matchData[team].totalPointsByTeam}</th>
          <th>{matchData[team].totalAutoPoints}</th>
          <th>{matchData[team].totalTeleopPoints}</th>
          <th>{matchData[team].totalClimbPoints}</th>
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
          <th>{matchData[team].autoCargo.miss}</th>
          <th>{matchData[team].autoCargo.upper}</th>
          <th>{matchData[team].autoCargo.lower}</th>
        </tr>
        <tr>
          <th>Teleop</th>
          <th>{matchData[team].teleopCargo.miss}</th>
          <th>{matchData[team].teleopCargo.upper}</th>
          <th>{matchData[team].teleopCargo.lower}</th>
        </tr>
      </tbody>
    </table>
    <p>
      Alone, {team} got {(matchData[team].autoCargo.upper +
        matchData[team].autoCargo.lower +
        matchData[team].teleopCargo.upper +
        matchData[team].teleopCargo.lower) *
        5}% of the cargo RP and {(matchData[team].totalClimbPoints / 16) * 100}%
      of the climb RP
    </p>
  {/if}
</div>

<style>
  div {
    border: 0.1em solid black;
    padding: 1em;
  }
</style>
