<script>
	let competitions = [
	        {id: "mabos", name: "Revere"},
	        {id: "mawor", name: "WPI"},
            {id: "necmp1", name: "NE District Championship (Calcium division)"}
	    ]

	let selected = competitions[0];
</script>

<style>
	h1, figure, p{
		font-family: Trebuchet MS;
		text-align: center;
		margin: 0 auto;
		color: #cdffe7;
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
<!-- 
<h1>Select Competition</h1>

<figure>
    <select name="Comp" value={selected}>
        {#each competitions as comp}
            <option value={comp}>{comp.name}</option>
        {/each}
    </select>
    <p> selected {selected.id}</p>

</figure>
 -->
