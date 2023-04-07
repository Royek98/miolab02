<template>
  <div>
    <label for="a">a = </label>
    <input
      name="a"
      type="number"
      v-model.number="a"
      :class="isValidA ? '' : 'error'"
    />
    <label for="b">b = </label>
    <input
      name="b"
      type="number"
      v-model="b"
      :class="isValidB ? '' : 'error'"
    />
    <label for="N">N = </label>
    <input name="N" type="number" v-model="N" disabled />
    <label for="decimalPlaces"> Decimal Places = </label>
    <select name="decimalPlaces" v-model="selected">
      <option
        v-for="(item, index) in decimalPlaces"
        :key="index"
        :value="index + 2"
      >
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { useDataStore } from "@/stores/dataStore";
import { ref, computed, watch, onMounted } from "vue";

const dataStore = useDataStore();

// default values
const a = ref(-4),
  b = ref(12),
  selected = ref(3),
  N = 10,
  decimalPlaces = ref([0.01, 0.001, 0.0001]);

const L = computed(() => Math.ceil(Math.log2((1/decimalPlaces.value[selected.value-2])*(b.value - a.value)+1)));

const isValidA = computed(() => {
  // v-model.number converts to a number so if input has letters value of dataStore.a is <empty string>
  return a.value !== "" && a.value <= b.value;
});
const isValidB = computed(() => {
  return b.value !== "" && b.value > a.value;
});

watch([() => a.value, () => b.value, () => selected.value], ([av, bv, sv]) => {
  if (isValidA.value && isValidB.value) {
    generateValues(a.value, b.value, N, sv);
  }
});

onMounted(() => {
  generateValues(a.value, b.value, N, selected.value);
});

const generateValues = (a, b, N, decimalPlaces) => {
  dataStore.getGeneratedValues.length = 0; // clears array
  let xr1 = [], xi1 = [], xb1 = [], xi2 = [], xr2 = [];
  for (let i = 0; i < N; i++) {
    xr1.push(getRandomNumber(a, b, decimalPlaces));
    xi1.push(realToInt(xr1[i]));
    xb1.push(intToBin(xi1[i]));
    xi2.push(binToInt(xb1[i]));
    xr2.push(intToReal(xi2[i], decimalPlaces));
  }
  for (let i = 0; i < N; i++) {
    dataStore.getGeneratedValues.push({
      xr1: xr1[i],
      xi1: xi1[i],
      xb1: xb1[i],
      xi2: xi2[i],
      xr2: xr2[i]
    });
  }
};

const getRandomNumber = (min, max, decimalPlaces) => {
  return (Math.random() * (max - min) + min).toFixed(decimalPlaces);
};

const realToInt = (real) => Math.ceil((1/(b.value - a.value)) * (real - a.value) * (Math.pow(2, L.value) - 1));
const intToBin = (xint) => xint.toString(2);
const binToInt = (xbin) => parseInt(xbin, 2);
const intToReal = (xint, decimalPlaces) => ((xint * (b.value - a.value))/(Math.pow(2, L.value) - 1) + a.value).toFixed(decimalPlaces);

</script>

<style scoped>
label {
  display: block;
  margin-bottom: 5px;
}
input[type="number"],
select {
  background-color: #333;
  border: none;
  border-radius: 3px;
  color: #eee;
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}

input[type="number"]:disabled {
  background-color: #333;
  border: none;
  border-radius: 3px;
  color: #929090;
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}

.error {
  background-color: rgb(82, 1, 1) !important;
}
</style>
