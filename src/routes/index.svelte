<script>
  import { onMount } from 'svelte';

  let todos = [];
  let value = '';

  function handleSubmit(event) {
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
  let editingInput = null;

  $: if (editing) setEditing(editing);

  function setEditing(editing) {
    editingValue = editing.entry;
  }

  $: editingInput ? editingInput.focus() : null;

  function handleEditSubmit(event) {
    if (editing.entry === editingValue) {
      console.log('no changes have been made');
      editing = null;
      return;
    }
    fetch('/api/posts', {
      method: 'PUT',
      body: JSON.stringify({
        entry: editingValue,
        id: editing.id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        fetchPosts();
      })
      .catch(console.error);
    event.target.reset();
    editing = null;
  }

  function deletePost({ id }) {
    fetch('/api/posts', {
      method: 'DELETE',
      body: JSON.stringify({
        id: id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        todos = todos.filter(e => e.id !== id);
      })
      .catch(console.error);
  }
</script>

{#if editing}
  <div on:click|self={() => (editing = null)} class="modal modal-open">
    <div class="modal-box">
      <h2>Edit Todos</h2>
      <form on:submit|preventDefault={handleEditSubmit}>
        <input
          bind:this={editingInput}
          type="text"
          class="input input-bordered"
          bind:value={editingValue}
          required
        />
        <button type="submit">Confirm</button>
      </form>
    </div>
  </div>
{/if}

<h1 class="mx-auto w-fit py-4 text-3xl font-black">Svelte-Kit + Prisma CRUD</h1>
<ul class="mx-auto flex max-w-xl flex-col gap-2 p-4">
  {#each todos as todo}
    <li class="rounded-box flex items-center justify-between gap-4 bg-base-200 px-6 py-2">
      <p class="break-all">{todo.entry}</p>
      <div class="flex">
        <button class="btn btn-xs" on:click={() => (editing = todo)}> Edit </button>
        <button class="btn btn-error btn-xs" on:click={() => deletePost(todo)}>Delete</button>
      </div>
    </li>
  {/each}
</ul>
<form class="mx-auto w-fit" on:submit|preventDefault={handleSubmit}>
  <input class="input input-bordered" type="text" bind:value required />
  <button class="btn" type="submit">Add</button>
</form>

<style>
</style>
