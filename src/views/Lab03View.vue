<template>
  <table-generator>
    <template #tableHeader>
      <th>LP</th>
      <th>x<sup>real</sup></th>
      <th>f(x<sup>real</sup>)</th>
      <th>g(x)</th>
      <th>P(x)</th>
      <th>q(x)</th>
      <th>r</th>
      <th>Populacja po selekcji x<sup>real</sup></th>
    </template>
    <template #tableBody>
      <tr
        v-for="(item, index) in dataStoreLab03.generatedValues.data"
        :key="item"
        @mouseenter="(event) => event.originalTarget.classList.add('green')"
        @mouseleave="(event) => event.originalTarget.classList.remove('green')"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.real }}</td>
        <td>{{ item.fx }}</td>
        <td>{{ item.gx }}</td>
        <td>{{ item.px }}</td>
        <td>{{ item.qx }}</td>
        <td>{{ item.r }}</td>
        <td>{{ item.ps }}</td>
      </tr>
    </template>
  </table-generator>
</template>

<script setup>
import TableGenerator from "@/components/TableGenerator.vue";
import { useDataStoreLab03 } from "@/stores/dataStoreLab03";

const dataStoreLab03 = useDataStoreLab03();


</script>

