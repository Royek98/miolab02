<template>

  <data-form></data-form>
  <nav>
    <RouterLink to="/Lab02">Lab02</RouterLink>
    <RouterLink to="/Lab03">Lab03</RouterLink>
    <RouterLink to="/Lab04">Lab04</RouterLink>
    <RouterLink to="/Lab05">Lab05</RouterLink>
  </nav>
  <br/>
  <RouterView />
  
</template>

<script setup>
import DataForm from "@/components/DataForm.vue";
</script>

<style scoped>

nav {
  font-size: 18px;
  padding: 10px 0;
}

nav ul {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

nav li {
  list-style: none;
}

nav a {
  color: #fff;
  background-color: #333;
  padding: 10px 20px;
  text-decoration: none;
}

nav a:hover {
  background-color: #fff;
  color: #333;
}

.router-link-active {
  background-color: hsla(160, 100%, 37%, 1);;
  color: #333;
}

</style>
