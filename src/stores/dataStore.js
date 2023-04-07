import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataStore = defineStore("DataStore", () => {
  const getGeneratedValues = ref([]);

  return { getGeneratedValues };
});
