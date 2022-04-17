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
        border: 2px solid black;
        padding: 4px;
    }
</style>

<svelte:head>
	<title>Enter Match Data</title>
</svelte:head>

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

<p>Climb Level</p>
<select name="Comp" value={data.climb_level}>
    {#each climb as stage}
        <option value={stage.amount}>{stage.name}</option>
    {/each}
</select>
<br>


<button on:click={() => {console.log(data)}}>log</button>
