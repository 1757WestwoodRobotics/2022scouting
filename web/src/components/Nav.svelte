<script lang="ts">
	export let segment: string;
</script>

<style>
	nav {
		border-bottom: 2px solid rgb(31, 255, 94);
		font-weight: 300;
		padding: 0 1em;
		background-color: rgb(0, 0, 5);
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
		color: rgb(217, 255, 215);
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 5px;
		background-color: rgb(0, 69, 0);
		display: block;
		bottom: -2px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
	<ul>
		<li><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">Home</a></li>
		<li><a aria-current="{segment === 'enter' ? 'page' : undefined}" href="enter">Enter Match Data</a></li>

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<li><a rel=prefetch aria-current="{segment === 'team' ? 'page' : undefined}" href="team">Team Info</a></li>
	</ul>
</nav>
