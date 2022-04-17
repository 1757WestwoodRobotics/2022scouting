<script lang='ts'>
    export let value: number = 0;
    export let name: string = "";

    const increase = () => {value++}
    const decrease = () => {value--}
</script>

<div>
    <h4>{name}</h4>
    <button on:click={decrease}>-</button>
    <input bind:value={value}>
    <button on:click={increase}>+</button>
</div>
