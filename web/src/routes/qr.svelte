<script lang="ts" context="module">
  import { textToData } from "../constants";
  let data = {input: ""};
  const upload = () => {
    fetch(`process.BACKEND_URL/scout/upload`, {
      method: "POST",
      body: JSON.stringify(textToData(data.input)),
      headers: { "Content-Type": "application/json" },
    }).then(() => {
    alert("submitted")
      data.input = "";
    });
  };
</script>

<input type="text" bind:value={data.input} />
<button value="Upload raw" on:click={upload}>Upload Raw</button>
