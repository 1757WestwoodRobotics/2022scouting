<script lang="ts">
	import Counter from '../components/Counter.svelte';

	let data = {
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

	let climb = [
	    {name: "None", amount: 0},
	    {name: "Low", amount: 4},
	    {name: "Mid", amount: 6},
	    {name: "High", amount: 10},
	    {name: "Traverse", amount: 15},
	]

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
		border: 0.5em solid rgb(156, 255, 44);
		margin-bottom: 2em;
	}
	.container-1 {
		display: flex;
		flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        flex-direction: row;
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




<button on:click={() => {console.log(data)}}>Log</button>
