<script lang="ts">
	import Counter from '../components/Counter.svelte';
	import {competitions, climb, matchType, apiPort} from '../constants'

	let data = {
	    identifier : {
            team: 0,
            comp: "",
            comp_level: "",
            match_number: 0
	    },
	    auto_cargo : {
	        upper: 0,
	        lower : 0,
	        miss : 0
	    },
	    teleop_cargo : {
	        upper : 0,
	        lower : 0,
	        miss : 0
	    },
	    climb_level : 0,
	    notes: ""
	}


</script>

<style>
    div {
        border: 2px solid black;
        padding: 4px;
    }
</style>

<svelte:head>
	<title>Enter Match Data</title>
</svelte:head>

<div>
    <h3>Match Info</h3>
    <span>Team Number<input bind:value={data.identifier.team} type=number/></span>
    <br>
    <select name="Comp" bind:value={data.identifier.comp}>
        {#each competitions as comp}
            <option value={comp.id}>{comp.name}</option>
        {/each}
    </select>
    <select name="Type" bind:value={data.identifier.comp_level}>
        {#each matchType as type}
            <option value={type.id}>{type.name}</option>
        {/each}
    </select>
    <br>
    <span>Match Number<input bind:value={data.identifier.match_number} type=number/></span>
</div>
<br>
<div>
    <h3>Auto</h3>
    <Counter bind:value={data.auto_cargo.upper} name="Upper"/>
    <Counter bind:value={data.auto_cargo.lower} name="Lower"/>
    <Counter bind:value={data.auto_cargo.miss} name="Miss"/>
</div>
<br>
<div>
    <h3>Teleop</h3>
    <Counter bind:value={data.teleop_cargo.upper} name="Upper"/>
    <Counter bind:value={data.teleop_cargo.lower} name="Lower"/>
    <Counter bind:value={data.teleop_cargo.miss} name="Miss"/>
</div>
<br>

<div>
<h3>Climb Level</h3>
<select name="climb" bind:value={data.climb_level}>
    {#each climb as stage}
        <option value={stage.amount}>{stage.name}</option>
    {/each}
</select>
</div>
<br>
<div>
    <h3>Notes</h3>
    <textarea bind:value={data.notes}></textarea>
</div>


<button on:click={() => {fetch(`http://localhost:${apiPort}/scout/upload`, {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})}}>submit</button>
