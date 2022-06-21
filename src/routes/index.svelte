<script>
  import { onMount } from 'svelte';

  let todos = [];
  let value = '';

  function handleSubmit(event) {
    console.log(value);
    fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        entry: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        todos = [...todos, res];
      })
      .catch(console.error);
    event.target.reset();
  }

  function fetchPosts() {
    fetch('/api/posts')
      .then(res => res.json())
      .then(res => {
        console.log(res);
        todos = res;
      })
      .catch(console.error);
  }

  onMount(() => {
    fetchPosts();
  });

  let editing = null;
  let editingValue = '';

  $: if (editing) setEditing(editing);

  function setEditing(editing) {
    console.log(editing);
    editingValue = editing.entry;
  }
</script>

{#if editing}
  <dialog open>
    <h2>Edit Todos</h2>
    <form>
      <input type="text" bind:value={editingValue} required />
      <button type="submit">Confirm</button>
    </form>
  </dialog>
{/if}

<h1>Todo-List</h1>
<ul>
  {#each todos as todo}
    <li>{todo.entry} <button on:click={() => (editing = todo)}>Edit</button></li>
  {/each}
</ul>
<form on:submit|preventDefault={handleSubmit}>
  <input type="text" bind:value required />
  <button type="submit">Add</button>
</form>

<style>
</style>
