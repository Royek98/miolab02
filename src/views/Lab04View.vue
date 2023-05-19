<template>
  <table-generator>
    <template #tableHeader>
      <th>LP</th>
      <th>Populacja po selekcji x<sup>real</sup></th>
      <th>x<sup>bin</sup></th>
      <th>Populacja rodziców</th>
      <th>P<sub>c</sub></th>
      <th>Populacja dzieci</th>
      <th>Populacja po krzyżowaniu</th>
      <th>Miejsca mutacji</th>
      <th>Populacja po mutacji <sup>bin</sup></th>
      <th>Populacja po mutacji <sup>real</sup></th>
      <th>f(x<sup>real</sup>)</th>
    </template>
    <template #tableBody>
      <tr
        v-for="(item, index) in dataStoreLab04.generatedValues"
        :key="item"
        @mouseenter="(event) => event.originalTarget.classList.add('green')"
        @mouseleave="(event) => event.originalTarget.classList.remove('green')"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.ps }}</td>
        <td>{{ item.xbin }}</td>
        <td>{{ item.parentsPopulation }}</td>
        <td>{{ item.pc }}</td>
        <td>{{ item.childrenPopulation }}</td>
        <td>{{ item.crossBreedingPopulation }}</td>
        <td>{{ item.mutationIndexes }}</td>
        <td>{{ item.mutationPopulationBin }}</td>
        <td>{{ item.mutationPopulationReal }}</td>
        <td>{{ item.fx }}</td>
      </tr>
    </template>
  </table-generator>
</template>

<script setup>
import TableGenerator from "@/components/TableGenerator.vue";
import { useDataStoreLab03 } from "@/stores/dataStoreLab03";
import { useDataStoreLab04 } from "@/stores/dataStoreLab04";
import { onBeforeMount } from "vue";


const dataStoreLab03 = useDataStoreLab03();
const dataStoreLab04 = useDataStoreLab04();

onBeforeMount(() =>{
  dataStoreLab03.generatedValues;
});

</script>

<style scoped>
p {
  text-align: center;
}
</style>
