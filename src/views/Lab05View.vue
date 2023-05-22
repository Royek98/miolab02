<template>
    <table-generator>
    <template #tableHeader>
      <th>LP</th>
      <th>x<sup>real</sup></th>
      <th>x<sup>bin</sup></th>
      <th>f(x)</th>
      <th>%</th>
    </template>
    <template #tableBody>
      <tr
        v-for="(item, index) in dataStoreLab05.generatedValues.finishTable"
        :key="item"
        @mouseenter="(event) => event.originalTarget.classList.add('green')"
        @mouseleave="(event) => event.originalTarget.classList.remove('green')"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.real }}</td>
        <td> {{ item.bin }} </td>
        <td> {{ item.fx }} </td>
        <td> {{ item.proc }} </td>
      </tr>
    </template>
  </table-generator>

  <br/>

  <Line id="chart" :data="data" :options="options"></Line>

</template>

<script setup>
import TableGenerator from "@/components/TableGenerator.vue";
import { useDataStoreLab05 } from "@/stores/dataStoreLab05";
import { useDataStoreLab03 } from "@/stores/dataStoreLab03";
import { Line } from 'vue-chartjs'
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const dataStoreLab05 = useDataStoreLab05();
// watch(dataStoreLab05.iterationTable, () => {

// })


const data = computed(() => { return {
  labels: dataStoreLab05.iterationTable,
  datasets: [
    {
      label: 'fx max',
      backgroundColor: '#ff0000',
      borderColor: "#ff0000",
      data: dataStoreLab05.generatedValues.fxMaxIteration
    }, 
    {
      label: 'fx min',
      backgroundColor: '#00ff00',
      borderColor: "#00ff00",
      data: dataStoreLab05.generatedValues.fxMinIteration
    }, 
    {
      label: 'fx avg',
      backgroundColor: '#0000ff',
      borderColor: "#0000ff",
      data: dataStoreLab05.generatedValues.fxAvgIteration
    }
  ]
}
})

const options = {
  responsive: true,
  lineTension: 0.3
}

</script>

<style scoped>
#chart {
  background-color: white;
}
</style>
