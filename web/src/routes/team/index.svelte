<script context="module" lang="ts">
	import Box from '../../components/Box.svelte'
    let teamNum = 1757;
    const handleSubmit = () => {
        location.href += `/${teamNum}`
    }
</script>

<script lang="ts">
	export let posts: { slug: string; title: string, html: any }[];
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}
	h1{
		font-family: Trebuchet MS;
		text-align: center;
		margin: 0 auto;
		color: #ffffff;
		font-weight: 700;
        font-size: 10vw;
        margin-bottom: 0.2em;
	}
    @media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
    div{
		vertical-align: center;
        border: 1em solid rgb(22, 22, 22);
        padding: 1em;
		background-color: #111115;
		text-align: center;
		margin: 1em;
    }
	input {
		font-size: 1em;
		width: 100%;
		height: 2em;
		background-color: rgb(33, 33, 33);
		border-color: #ffffff;
		border-width: 0.1em;
		color: rgb(255, 255, 255);
        text-align: center;
	}
	hr {
		background-color:  rgb(156, 255, 44);
		border: none;
		height: 0.4em;
		margin-bottom: 2em;
	}
</style>

<svelte:head>
	<title>Teams</title>
</svelte:head>
<Box title="Go to team" --box-width=auto>
    <form on:submit|preventDefault={handleSubmit}>
        <input bind:value={teamNum}>
    </form>    
</Box>

