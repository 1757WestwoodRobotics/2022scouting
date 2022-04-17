<script context="module" lang="ts">
    import {apiPort} from '../../constants'
	export async function preload({ params }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		const res = await this.fetch(`http://localhost:${apiPort}/team/${params.team}`);
		const data = await res.json();

		if (res.status === 200) {
			return { team: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script lang="ts">
	export let team: { nickname: string; team_number: number; website: string; coutry: string; city: string; state_prov: string; school_name: string; };
</script>

<style>
	/*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/
	.content :global(h2) {
		font-size: 1.4em;
		font-weight: 500;
	}

	.content :global(pre) {
		background-color: #f9f9f9;
		box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
		padding: 0.5em;
		border-radius: 2px;
		overflow-x: auto;
	}

	.content :global(pre) :global(code) {
		background-color: transparent;
		padding: 0;
	}

	.content :global(ul) {
		line-height: 1.5;
	}

	.content :global(li) {
		margin: 0 0 0.5em 0;
	}
</style>

<svelte:head>
	<title>{team.nickname}</title>
</svelte:head>

<h1>{team.nickname}</h1>

<div class="content">
    {team.team_number}
</div>
