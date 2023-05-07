<template>
  <table-generator>
    <template #tableHeader>
      <th>LP</th>
      <th>x<sup>real</sup></th>
      <th>x<sup>int</sup></th>
      <th>x<sup>bin</sup></th>
      <th>x<sup>int</sup></th>
      <th>x<sup>real</sup></th>
      <th>f(x<sup>real</sup>)</th>
    </template>
    <template #tableBody>
      <tr
        v-for="(item, index) in generatedValues"
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
        <td>{{ item.fx }}</td>
      </tr>
    </template>
  </table-generator>
</template>

<script setup>
import TableGenerator from "@/components/TableGenerator.vue";
import { useDataStore } from "@/stores/dataStore";
import { computed } from "vue";

const dataStore = useDataStore();


const L = computed(() =>
  Math.ceil(
    Math.log2(
      (1 / dataStore.decimalPlaces[dataStore.selected - 2]) *
        (dataStore.b - dataStore.a) +
        1
    )
  )
);

const generatedValues = computed(() => {
  let xr1 = [],
    xi1 = [],
    xb1 = [],
    xi2 = [],
    xr2 = [],
    fx = [];
  for (let i = 0; i < dataStore.N; i++) {
    xr1.push(dataStore.getGeneratedValues[i]);
    xi1.push(realToInt(xr1[i]));
    xb1.push(intToBin(xi1[i]));
    xi2.push(binToInt(xb1[i]));
    xr2.push(intToReal(xi2[i], dataStore.selected));
    fx.push(calculatefx(xr1[i], dataStore.selected));
  }

  const list = [];
  for (let i = 0; i < dataStore.N; i++) {
    list.push({
      xr1: xr1[i],
      xi1: xi1[i],
      xb1: xb1[i],
      xi2: xi2[i],
      xr2: xr2[i],
      fx: fx[i],
    });
  }
    
  return list;
});

const realToInt = (real) =>
  Math.ceil(
    (1 / (dataStore.b - dataStore.a)) *
      (real - dataStore.a) *
      (Math.pow(2, L.value) - 1)
  );

const intToBin = (xint) => {
  const bin = xint.toString(2);
  let result = "";
  if (bin.length < L.value) {
    for (let i = L.value - bin.length; i > 0; i--) {
      result += "0";
    }
  }
  result += bin;
  return result;
};

const binToInt = (xbin) => parseInt(xbin, 2);

const intToReal = (xint, decimalPlaces) =>
  (
    (xint * (dataStore.b - dataStore.a)) / (Math.pow(2, L.value) - 1) +
    dataStore.a
  ).toFixed(decimalPlaces);

const calculatefx = (real, decimalPlaces) => {
  const m = mantissa(real).toFixed(decimalPlaces);
  return (m * (Math.cos(20 * Math.PI * real) - Math.sin(real))).toFixed(
    decimalPlaces
  );
};

const mantissa = (real) => Math.abs(real) % 1;
</script>

