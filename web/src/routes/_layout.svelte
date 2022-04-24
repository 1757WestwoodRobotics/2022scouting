<script lang="ts">
  import Title from "../components/Title.svelte";
  import Nav from "../components/Nav.svelte";
  import background from "../images/background.svg";
  export let segment: string;
</script>

<Title />
<Nav {segment} />
<div class="image" style="background-image: url({background})">
  <main>
    <slot />
  </main>
</div>

<style>
  main {
    position: relative;
    max-width: 75em;
    background-color: #212121;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
    height: auto;
    min-height: 100vh;
  }

  :global(body) {
    background-color: #9d9d9d;
    text-transform: uppercase;
  }

  :global(select, option) {
    text-align: center;
    font-family: Tahoma;
  }
  div {
    align-self: center;
  }
</style>
