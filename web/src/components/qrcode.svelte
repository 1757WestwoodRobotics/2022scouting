<script>
  import { onMount } from "svelte";
  import QRCode from "qrcode";

  export let codeValue;
  export let squareSize;

  let qrcode;

  onMount(() => {
    QRCode.toCanvas(qrcode, codeValue, function (error) {
      if (error) console.error(error);
      console.log("success!");
    });
  });
</script>

<div id="qrcode">
  <canvas bind:this={qrcode} />
</div>

<style>
  #qrcode {
    width: 20px;
    height: 200x;
    margin-top: 15px;
  }
</style>
