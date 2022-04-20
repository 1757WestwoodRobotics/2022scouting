<script lang="ts">
    export let header: string = "";
    export let title: string = "";
</script>

<style>
	h1{
		font-family: Trebuchet MS;
		text-align: center;
		margin: 0 auto;
		color: #ffffff;
		font-weight: 700;
        font-size: 10vw;
        margin-bottom: 0.2em;
	}
    @media (min-width: 550px) {
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
		width: var(--box-width, 15em);
    }
	h2 {
		color: white;
		font-size: 2em;
		font-weight: 600;
		text-align: center;
	}
	hr {
		background-color:  rgb(156, 255, 44);
		border: none;
		height: 0.4em;
		margin-bottom: 2em;
	}
</style>

<div>
    <h1>{title}</h1>
    <h2>{header}</h2>
    <hr>
    <slot></slot>
</div>