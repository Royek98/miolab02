import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataStore = defineStore("DataStore", () => {
  const getGeneratedValues = ref([]);
  // default values
  const a = ref(-4),
    b = ref(12),
    selected = ref(3),
    N = ref(10),
    decimalPlaces = ref([0.01, 0.001, 0.0001]),
    pk = ref(0.75),
    pm = ref(0.005);

  const getPs = ref([]); // populacja po selekcji

  return { getGeneratedValues, a, b, selected, decimalPlaces, N, getPs, pk, pm };
});
