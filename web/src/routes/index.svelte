<script>
    import {competitions} from '../constants'

	let selected = competitions[0];
</script>

<style>
	h1, figure, p{
		font-family: Trebuchet MS;
		text-align: center;
		margin: 0 auto;
		color: #ffffff;
		font-weight: 700;
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

	select {
		font-size: 1em;
		width: 100%;
		height: 2em;
		background-color: rgb(33, 33, 33);
		border-color: #ffffff;
		border-width: 0.1em;
		color: rgb(255, 255, 255);
	}
	hr {
		background-color:  rgb(156, 255, 44);
		border: none;
		height: 0.4em;
		margin-bottom: 2em;
	}

    div{
		vertical-align: center;
        border: 1em solid rgb(22, 22, 22);
        padding: 1em;
		background-color: #111115;
		text-align: center;
		margin: 1em;
    }
</style>

<svelte:head>
	<title>1757 Scouting Database</title>
</svelte:head>

<div>
	<h1>Select Competition</h1>

<figure>
    <select name="Comp" bind:value={selected}>
        {#each competitions as comp}
            <option value={comp}>{comp.name}</option>
        {/each}
    </select>
    <p> selected {selected.id}</p>


