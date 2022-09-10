<script lang="ts">
  export let segment: string;
  const refresh_tba = () => {
    fetch(`process.BACKEND_URL/refresh`, { method: "POST" }).then(() => {
      alert("backend refreshed");
    });
  };
</script>

<nav>
  <ul>
    <li>
      <a aria-current={segment === undefined ? "page" : undefined} href="."
        >Home</a
      >
    </li>
    <li>
      <a aria-current={segment === "enter" ? "page" : undefined} href="enter"
        >Enter Match Data</a
      >
    </li>
    <li>
      <a
        rel="prefetch"
        aria-current={segment === "team" ? "page" : undefined}
        href="team">Team Info</a
      >
    </li>
    <li>
      <a
        rel="prefetch"
        aria-current={segment === "match" ? "page" : undefined}
        href="match">Matches</a
      >
    </li>
    <li>
      <a href="#" on:click={refresh_tba}>Refresh Backend</a>
    </li>
  </ul>
</nav>

<style>
  @media (min-height: 700px) {
    nav {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
  nav {
    border-bottom: 0.2em solid rgb(31, 255, 94);
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
    content: "";
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
    color: #b3ffab;
    font-size: 1.25em;
    font-weight: 400;
  }

  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: "";
    width: calc(100% - 1em);
    height: 0.4em;
    background-color: rgb(0, 69, 0);
    display: block;
    bottom: -0.2em;
  }

  a {
    text-decoration: none;
    padding: 0.5em 0.5em;
    display: block;
  }
</style>
