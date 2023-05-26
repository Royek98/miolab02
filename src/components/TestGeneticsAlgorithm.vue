<template>
  <br />
  <div>
    <button @click="quickTest" class="quick">QUICK TEST</button>
    <button @click="longTest" class="long">LONG TEST</button>
  </div>
  

  <h2>Best Configurations</h2>
  <table-generator>
    <template #tableHeader>
      <th>LP</th>
      <th>N</th>
      <th>pk</th>
      <th>pm</th>
      <th>T</th>
      <th>f(x)</th>
    </template>
    <template #tableBody>
      <tr
        v-for="(item, index) in bestConfigurations"
        :key="item"
        @mouseenter="(event) => event.originalTarget.classList.add('green')"
        @mouseleave="(event) => event.originalTarget.classList.remove('green')"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.configuration.N }}</td>
        <td>{{ item.configuration.pk }}</td>
        <td>{{ item.configuration.pm }}</td>
        <td>{{ item.configuration.T }}</td>
        <td>{{ item.fxAvg.toFixed(dataStore.selected) }}</td>
      </tr>
    </template>
  </table-generator>

  <br />

  <h2>Worst Configurations</h2>
  <table-generator>
    <template #tableHeader>
      <th>LP</th>
      <th>N</th>
      <th>pk</th>
      <th>pm</th>
      <th>T</th>
      <th>f(x)</th>
    </template>
    <template #tableBody>
      <tr
        v-for="(item, index) in worstConfigurations"
        :key="item"
        @mouseenter="(event) => event.originalTarget.classList.add('green')"
        @mouseleave="(event) => event.originalTarget.classList.remove('green')"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.configuration.N }}</td>
        <td>{{ item.configuration.pk }}</td>
        <td>{{ item.configuration.pm }}</td>
        <td>{{ item.configuration.T }}</td>
        <td>{{ item.fxAvg.toFixed(dataStore.selected) }}</td>
      </tr>
    </template>
  </table-generator>
</template>

<script setup>
import { useDataStoreLab05 } from "@/stores/dataStoreLab05";
import { useDataStore } from "@/stores/dataStore";
import { ref } from "vue";
import TableGenerator from "@/components/TableGenerator.vue";

const dataStoreLab05 = useDataStoreLab05();
const dataStore = useDataStore();
let bestConfigurations = ref([]);
let worstConfigurations = ref([]);

const longTest = async () => {
  const N = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
  const PK = [
    0.0001, 0.0005, 0.001, 0.0015, 0.002, 0.0025, 0.003, 0.0035, 0.004, 0.0045,
    0.005, 0.01,
  ];
  const PM = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9];
  const T = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

  console.log("Loading...")
  testAlgorithm(N, PK, PM.T);
  console.log("Completed");
};

const quickTest = () => {
  const N = [50];
  const PK = [0.0001];
  const PM = [0.5, 0.55];
  const T = [30, 35, 40, 45, 50, 55, 60];
  console.log("Loading...")
  testAlgorithm(N, PK, PM, T);
  console.log("Completed");
};

const testAlgorithm = (N, PK, PM, T) => {
  let bestConfiguration = [];
  let worstConfiguration = [];

  const start = Date.now();
  for (let n = 0; n < N.length; n++) {
    dataStore.N = N[n];
    for (let pk = 0; pk < PK.length; pk++) {
      dataStore.pk = PK[pk];
      for (let pm = 0; pm < PM.length; pm++) {
        dataStore.pm = PM[pm];
        for (let t = 0; t < T.length; t++) {
          dataStore.T = T[t];

          let sumResultAvgFx = 0;
          for (let i = 0; i < 100; i++) {
            const result = dataStoreLab05.geneticsAlgorithm();
            sumResultAvgFx = sumFx(result);
          }

          const fxAvg = sumResultAvgFx / 100;
          const configuration = {
            N: N[n],
            pk: PK[pk],
            pm: PM[pm],
            T: T[t],
          };

          if (bestConfiguration.length < 5) {
            bestConfiguration.push({ configuration, fxAvg });
          } else {
            const worstInBests = findworstConfiguration(bestConfiguration);
            if (fxAvg > worstInBests.fxAvg) {
              bestConfiguration = removeObjectFromArray(
                bestConfiguration,
                worstInBests
              );
              bestConfiguration.push({ configuration, fxAvg });
            }
          }

          if (worstConfiguration.length < 5) {
            worstConfiguration.push({ configuration, fxAvg });
          } else {
            const bestInWorsts = findBestConfiguration(worstConfiguration);
            if (fxAvg < bestInWorsts.fxAvg) {
              worstConfiguration = removeObjectFromArray(
                worstConfiguration,
                bestInWorsts
              );
              worstConfiguration.push({ configuration, fxAvg });
            }
          }
        }
      }
    }
  }

  const end = Date.now();
  console.log(`Execution time: ${end - start} ms`);
  bestConfigurations.value = bestConfiguration.sort(
    (a, b) => b.fxAvg - a.fxAvg
  );
  worstConfigurations.value = worstConfiguration.sort(
    (a, b) => b.fxAvg - a.fxAvg
  );
};

const sumFx = (geneticsAlgorithmResult) => {
  let sumFxAvg = 0;

  for (let i = 0; i < geneticsAlgorithmResult.fxAvgIteration.length; i++) {
    sumFxAvg += geneticsAlgorithmResult.fxAvgIteration[i];
  }

  return sumFxAvg;
};

const findworstConfiguration = (confugurationList) => {
  return confugurationList.sort((a, b) => a.fxAvg - b.fxAvg)[0];
};

const findBestConfiguration = (confugurationList) => {
  return confugurationList.sort((a, b) => b.fxAvg - a.fxAvg)[0];
};

const removeObjectFromArray = (arr, obj) => {
  return arr.filter((element) => element != obj);
};
</script>

<style scoped>
h2 {
  text-align: center;
}

button {
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  margin-left: 0.5em;
} 

.quick {
  background-color: #4caf50;
}

.long {
  background-color: #d35419;
}

div {
  text-align: center;
}
</style>
