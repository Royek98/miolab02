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
    <label for="pk">Pk = </label>
    <input
      name="pk"
      type="number"
      v-model="pk"
      :class="isValidPk ? '' : 'error'"
    />
    <label for="pm">Pm = </label>
    <input
      name="pm"
      type="number"
      v-model="pm"
      :class="isValidPm ? '' : 'error'"
    />
    <label for="t">T = </label>
    <input
      name="t"
      type="number"
      disabled
    />
  </div>
</template>

<script setup>
import { useDataStore } from "@/stores/dataStore";
import { ref, computed, watch, onMounted } from "vue";

const dataStore = useDataStore();

const a = ref(-4),
    b = ref(12),
    selected = ref(3),
    N = ref(10),
    pk = ref(0.75),
    pm = ref(0.005);

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

const isValidPk = computed(() => {
  return pk.value !== "" && pk.value >= 0.5 && pk.value <= 1;
});

const isValidPm = computed(() => {
  return pm.value !== "" && pm.value > 0 && pm.value <= 0.01; // 0.01
});

watch(
  [() => a.value, () => b.value, () => selected.value, () => N.value, () => pk.value, () => pm.value],
  ([av, bv, sv, nv, npk, npm]) => {
    if (isValidA.value && isValidB.value && isValidN.value && isValidPk.value && isValidPm.value) {
      generateValues(av, bv, nv, sv);
      dataStore.a = av;
      dataStore.b = bv;
      dataStore.N = nv;
      dataStore.selected = sv;
      dataStore.pk = npk;
      dataStore.pm = npm;
      dataStore.canShowLab04Table = false;
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
