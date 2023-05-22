import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useDataStore } from "@/stores/dataStore";
import { useDataStoreLab03 } from "@/stores/dataStoreLab03";
import { useDataStoreLab04 } from "@/stores/dataStoreLab04";

export const useDataStoreLab05 = defineStore("DataStoreLab05", () => {
  const dataStore = useDataStore();
  const dataStoreLab03 = useDataStoreLab03();
  const dataStoreLab04 = useDataStoreLab04();

  const generatedValues = computed(() => {

    let postMutation, postSelection;

    let fxMaxIteration = [];
    fxMaxIteration.length = 0;
    let fxMinIteration = [];
    fxMinIteration.length = 0;
    let fxAvgIteration = [];
    fxAvgIteration.length = 0;
    let lastIteration;

    if (dataStoreLab03.elite != null) {
      dataStoreLab03.elite = null;
    }

    // wiem że syf, działa nie ruszać
    for (let i = 0; i < dataStore.T; i++) {
      if (i == 0) {
        postSelection = dataStoreLab03.generateValues(null, null);
        fxMaxIteration.push(postSelection.iterationTableFxMax);
        fxMinIteration.push(postSelection.iterationTableFxMin);
        fxAvgIteration.push(postSelection.iterationTableFxAvg);
        postSelection = postSelection.data.map((element) => element.ps);
        postMutation = dataStoreLab04.generateValues(postSelection);
      } 
      else {
        postMutation = postMutation.map(
          (element) => element.mutationPopulationReal
        );
        postSelection = dataStoreLab03.generateValues(postMutation);
        fxMaxIteration.push(postSelection.iterationTableFxMax);
        fxMinIteration.push(postSelection.iterationTableFxMin);
        fxAvgIteration.push(postSelection.iterationTableFxAvg);
        lastIteration = postSelection.data;
        postSelection = postSelection.data.map((element) => element.ps);
        postMutation = dataStoreLab04.generateValues(postSelection);
      }
    } 
    
    const counts = countValuesInArray(lastIteration);
    const finishTable = [];

    let sumOfCount = 0;
    for (const key in counts) {
      if (counts.hasOwnProperty(key)) {
        sumOfCount += counts[key];
      }
    }

    for (const key in counts) {
      if (counts.hasOwnProperty(key)) {
        const found = getBinAndFxByReal(lastIteration, key)
        // console.log(`Liczba ${key} pojawiła się ${count} razy.`);
        finishTable.push({
          real: key,
          bin: found.bin,
          fx: found.fx,
          proc: ((counts[key] / sumOfCount) * 100).toFixed(2)
        })
      }
    }

    return {
        fxMaxIteration: fxMaxIteration,
        fxMinIteration: fxMinIteration,
        fxAvgIteration, fxAvgIteration,
        finishTable: finishTable.sort((a, b) => b.fx - a.fx)
    }
  });


  const iterationTable = computed(() => {
    let data = [];
    for (let i = 1; i <= dataStore.T; i++) {
        data.push(i);
    }
    return data;
  }); 

  const countValuesInArray = (array) => {
    let reals = array.map((element) => element.real);
    // flattenedArray = flattenedArray.map((element) => element.real);
    const counts = {};
    for (const value of reals) {
      if (value in counts) {
        counts[value] += 1;
      } else {
        counts[value] = 1;
      }
    }
    return counts;
  }

  const getBinAndFxByReal = (array, key) => {
    const found = array.find(element => element.real === key);
    return { bin: found.bin, fx: found.fx};
  }

  return { generatedValues, iterationTable };
});
