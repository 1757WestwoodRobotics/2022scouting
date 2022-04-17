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
    div .auto, .teleop, .climb{
		vertical-align: center;
        border: 1em solid rgb(22, 22, 22);
        padding: 1em;
		background-color: #111115;
		text-align: center;
		margin: 1em;
    }
	h2 {
		color: white;
		font-size: 3em;
		font-weight: 500;
		text-align: center;
	}

	hr {
		background-color:  rgb(156, 255, 44);
		border: none;
		height: 0.4em;
		margin-bottom: 2em;
	}
	.container-1 {
		display: flex;
		flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        flex-direction: row;
	}

	select {
		font-size: 2em;
		width: 6em;
		height: 2em;
		background-color: rgb(33, 33, 33);
		border-color: #ffffff;
		border-width: 0.1em;
		color: rgb(255, 255, 255);
	}

</style>

<svelte:head>
	<title>Enter Match Data</title>
</svelte:head>
<div class="container-1">
	<div class="auto">
		<h2>Auto</h2>
		<hr>
		<Counter bind:value={data.auto_cargo.upper} name="Upper"/>
		<Counter bind:value={data.auto_cargo.lower} name="Lower"/>
		<Counter bind:value={data.auto_cargo.miss} name="Miss"/>
	</div>
	<div class="teleop">
		<h2>Teleop</h2>
		<hr>
		<Counter bind:value={data.teleop_cargo.upper} name="Upper"/>
		<Counter bind:value={data.teleop_cargo.lower} name="Lower"/>
		<Counter bind:value={data.teleop_cargo.miss} name="Miss"/>
	</div>
	<div class="climb">
		<h2>Climb Level</h2>
		<hr>
		<select name="Comp" value={data.climb_level}>
			{#each climb as stage}
				<option value={stage.amount}>{stage.name}</option>
			{/each}
		</select>
	</div>
	
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


<button on:click={() => {fetch(`http://localhost:${apiPort}/scout/upload`, {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}}).then(() => {alert("submitted")})}}>submit</button>
