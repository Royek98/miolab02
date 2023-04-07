<template>
  <table>
    <thead>
      <tr>
        <th>LP</th>
        <th>x<sup>real</sup></th>
        <th>x<sup>int</sup></th>
        <th>x<sup>bin</sup></th>
        <th>x<sup>int</sup></th>
        <th>x<sup>real</sup></th>
        <th>f(x)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in dataStore.getGeneratedValues"
        :key="item"
        @mouseenter="(event) => event.originalTarget.classList.add('green')"
        @mouseleave="(event) => event.originalTarget.classList.remove('green')"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.xr1 }}</td>
        <td>{{ item.xi1 }}</td>
        <td>{{ item.xb1 }}</td>
        <td>{{ item.xi2 }}</td>
        <td>{{ item.xr2 }}</td>
        <td>?</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useDataStore } from "@/stores/dataStore";

const dataStore = useDataStore();

</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  color: #fff;
  background-color: #222;
}

th,
td {
  border: 1px solid #444;
  padding: 8px;
  text-align: center;
}

thead {
  background-color: #333;
}

th {
  font-weight: bold;
}

sup {
  font-size: 0.7em;
}
</style>
