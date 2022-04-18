<script lang="ts">
	import Title from '../components/Title.svelte'
	import Nav from '../components/Nav.svelte';

	export let segment: string;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: #212121;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}

	:global(body) {
		background-color: #9d9d9d;
	}

	:global(select, option) {
		font-family: Verdana;
		text-align: center;
	}

	:global(.wrapper) {
		width: 100%;
	}
</style>
<Title/>
<Nav {segment}/>

<main>
	<slot></slot>
</main>