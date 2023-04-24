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
    <input
      name="N"
      type="number"
      v-model="N"
      :class="isValidN ? '' : 'error'"
    />
    <label for="decimalPlaces"> Decimal Places = </label>
    <select name="decimalPlaces" v-model="selected">
      <option
        v-for="(item, index) in dataStore.decimalPlaces"
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

const a = ref(-4),
    b = ref(12),
    selected = ref(3),
    N = ref(10);

const isValidA = computed(() => {
  // v-model.number converts to a number so if input has letters value of dataStore.a is <empty string>
  return a.value !== "" && a.value <= b.value;
});
const isValidB = computed(() => {
  return b.value !== "" && b.value > a.value;
});

const isValidN = computed(() => {
  return N.value !== "" && N.value > 0;
});

watch(
  [() => a.value, () => b.value, () => selected.value, () => N.value],
  ([av, bv, sv, nv]) => {
    if (isValidA.value && isValidB.value && isValidN.value) {
      generateValues(av, bv, nv, sv);
      dataStore.a = av;
      dataStore.b = bv;
      dataStore.N = nv;
      dataStore.selected = sv;
    }
  }
);

onMounted(() => {
  generateValues(dataStore.a, dataStore.b, dataStore.N, dataStore.selected);
});

const generateValues = (a, b, N, decimalPlaces) => {
  dataStore.getGeneratedValues.length = 0; // clears array

  for (let i = 0; i < N; i++) {
    dataStore.getGeneratedValues.push(getRandomNumber(a, b, decimalPlaces));
  }

};

const getRandomNumber = (min, max, decimalPlaces) => {
  return (Math.random() * (max - min) + min).toFixed(decimalPlaces);
};


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
