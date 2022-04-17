<script>
    import {competitions} from '../constants'

	let selected = competitions[0];
</script>

<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>1757 Scouting Database</title>
</svelte:head>

<h1>FRC 2022 Scouting Area</h1>

<figure>
    <select name="Comp" bind:value={selected}>
        {#each competitions as comp}
            <option value={comp}>{comp.name}</option>
        {/each}
    </select>
    <p> selected {selected.id}</p>

</figure>

