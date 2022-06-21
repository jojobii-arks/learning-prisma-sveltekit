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
</script>

<h1>Todo-List</h1>
<ul>
  {#each todos as todo}
    <li>{todo.entry}</li>
  {/each}
</ul>
<form on:submit|preventDefault={handleSubmit}>
  <input type="text" bind:value required />
  <button type="submit">Add</button>
</form>
