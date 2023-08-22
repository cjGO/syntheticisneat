<script>
  let currentPage = '/';
</script>

<nav class="header">
	<a href="/" class:active={currentPage === '/'}>ESM embedding Viewer</a>
	<a href="/czcell" class:active={currentPage === '/czcell'}>(work in progress) CZ Single Cell Clone</a>
</nav>

<slot />

<style>
  .header {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background-color: #f0f0f0;
    box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
  }
  a {
    color: #333;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
  }
  a:active {
    color: #007bff;
  }
</style>
