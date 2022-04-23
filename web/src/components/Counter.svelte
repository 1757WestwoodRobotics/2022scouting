<script lang="ts">
  export let value: number = 0;
  export let name: string = "";
  import subtract from "../images/button-subtract.svg";
  import add from "../images/button-add.svg";
  const increase = () => {
    value++;
  };
  const decrease = () => {
    value--;
  };
</script>

<h4>{name}</h4>
<div>
  <img on:click={decrease} src={subtract} alt="bruh" />
  <input bind:value />
  <img on:click={increase} src={add} alt="bruh" />
</div>

<style>
  h4 {
    color: white;
    font-weight: 600;
    font-size: 1.5em;
    margin-bottom: -2px;
  }
  div {
    margin-bottom: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  img {
    width: 4em;
    height: 4em;
  }
  input {
    height: 1.5em;
    width: 4em;
    background-color: rgb(80, 80, 80);
    color: white;
    border-style: solid;
    border-color: #b3ffab;
    text-align: center;
    font-size: 2em;
  }

  @media (max-width: 500px) {
    input {
      font-size: 6vw;
    }
    img {
      width: 15vw;
      height: 15vw;
    }
  }
</style>
