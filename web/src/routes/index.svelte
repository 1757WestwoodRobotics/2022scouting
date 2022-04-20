<script>
    import {competitions} from '../constants'
	import Box from '../components/Box.svelte'
	let selected = "";
</script>

<style>
	figure, p{
		font-family: Trebuchet MS;
		text-align: center;
		margin: 0 auto;
		color: #ffffff;
		font-weight: 700;
	}

	figure {
		margin: 0 0 1em 0;
	}
	p {
		margin: 1em auto;
	}
	select {
		font-size: 1em;
		width: 100%;
		height: 2em;
		background-color: rgb(33, 33, 33);
		border-color: #ffffff;
		border-width: 0.1em;
		color: rgb(255, 255, 255);
	}
</style>

<svelte:head>
	<title>1757 Scouting Database</title>
</svelte:head>

<Box title="Select Competition" --box-width=auto>
	<figure>
		<select name="Comp" bind:value={selected}>
			<option value="" selected disabled>Select Competition</option>
			{#each competitions as comp}
				<option value={comp}>{comp.name}</option>
			{/each}
		</select>
		<p> selected {selected.id}</p>
	</figure>
</Box>