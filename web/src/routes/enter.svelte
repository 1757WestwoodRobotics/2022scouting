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
    div {
		vertical-align: center;
        border: 1em solid rgb(22, 22, 22);
        padding: 1em;
		background-color: #111115;
		text-align: center;
		width: auto;
		margin: auto;
    }

	h2 {
		color: white;
		font-size: 2em;
		font-weight: 500;
	}

	hr {
		border-top: 5px solid rgb(156, 255, 44);
	}
</style>

<svelte:head>
	<title>Enter Match Data</title>
</svelte:head>

<div>
    <h2>Auto</h2>
	<hr>
    <Counter bind:value={data.auto_cargo.upper} name="Upper"/>
    <Counter bind:value={data.auto_cargo.lower} name="Lower"/>
    <Counter bind:value={data.auto_cargo.miss} name="Miss"/>
</div>
<br>
<div>
    <h2>Teleop</h2>
	<hr>
    <Counter bind:value={data.teleop_cargo.upper} name="Upper"/>
    <Counter bind:value={data.teleop_cargo.lower} name="Lower"/>
    <Counter bind:value={data.teleop_cargo.miss} name="Miss"/>
</div>

<p>Climb Level</p>
<select name="Comp" value={data.climb_level}>
    {#each climb as stage}
        <option value={stage.amount}>{stage.name}</option>
    {/each}
</select>
<br>


<button on:click={() => {console.log(data)}}>Log</button>
