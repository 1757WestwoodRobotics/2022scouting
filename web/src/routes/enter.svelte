<script lang="ts">
	import Counter from '../components/Counter.svelte';
	import {competitions, climb, matchType, apiPort} from '../constants'
	import submit from '../images/button-submit.svg';
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
    div .auto, .teleop, .climb, .notes, .info{
		vertical-align: center;
        border: 1em solid rgb(22, 22, 22);
        padding: 1em;
		background-color: #111115;
		text-align: center;
		margin: 1em;
		width: 15em;
    }
	.climb, .notes {
		height: 15em;
	}
	.info {
		width: 36em;
	}
	h2 {
		color: white;
		font-size: 2em;
		font-weight: 600;
		text-align: center;
	}
	span {
		color: white;
		font-size: 1.2em;
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
		font-size: 1em;
		width: 100%;
		height: 2em;
		background-color: rgb(33, 33, 33);
		border-color: #ffffff;
		border-width: 0.1em;
		color: rgb(255, 255, 255);
		margin-bottom: 1em;
	}
	img {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 35%;
	}
	input {
		width: 3em;
	}
	textarea, input {
		background-color: rgb(49, 49, 49);
		color:rgb(255, 255, 255);
		border: 2px;
		border-color: white;
	}
</style>

<svelte:head>
	<title>Enter Match Data</title>
</svelte:head>
<div class="container-1">
	<div class="info">
		<h2>Match Info</h2>
		<hr>
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
		<span>Match Number: <input bind:value={data.identifier.match_number} type=number/></span>
		<br>
		<span>Team Number: <input bind:value={data.identifier.team} type=number/></span>
	</div>
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
		<select name="climb" bind:value={data.climb_level}>
			{#each climb as stage}
				<option value={stage.amount}>{stage.name}</option>
			{/each}
		</select>
	</div>

	<div class="notes">
		<h2>Notes</h2>
		<hr>
		<textarea bind:value={data.notes}></textarea>
	</div>
</div>



<img on:click={() => {fetch(`http://localhost:${apiPort}/scout/upload`, {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}}).then(() => {alert("submitted")})}} src={submit} alt="bruh">
