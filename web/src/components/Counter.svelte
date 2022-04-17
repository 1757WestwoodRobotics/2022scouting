<script lang='ts'>
    export let value: number = 0;
    export let name: string = "";
    import subtract from "../images/button-subtract.svg"
    import add from "../images/button-add.svg"
    const increase = () => {value++}
    const decrease = () => {value--}
</script>

<style>
    h4 {
        color: white;
        font-weight: 600;
        font-size: 1.5em;
    }
    div {
        margin-bottom: 2em;
    }
    img {
        width: 5em;
        height: 5em;
        margin-bottom: -1.75em;
    }
    input {
        height: 2em;
        width: 4em;
        background-color: rgb(80, 80, 80);
        color: white;
        border-style: solid;
        border-color: rgb(204, 204, 204);
        text-align: center;
        font-size: 2em;
    }
</style>

<div>
    <h4>{name}</h4>
    <img on:click={decrease} src={subtract} alt="bruh"/>
    <input bind:value={value}>
    <img on:click={increase} src={add} alt="bruh"/>
</div>
