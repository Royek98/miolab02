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
    let data = [];
    let postMutation, postSelection;
    for (let i = 0; i < dataStore.T; i++) {
      if (i == 0) {
        postSelection = dataStoreLab03.generateValues(null);
        postSelection = postSelection.map((element) => element.ps);
        postMutation = dataStoreLab04.generateValues(postSelection);
        data.push(postMutation.map((element) => element.fx));
      } 
      else {
        data.push(postMutation.map((element) => element.fx));
        postMutation = postMutation.map(
          (element) => element.mutationPopulationReal
        );
        postSelection = dataStoreLab03.generateValues(postMutation);
        postSelection = postSelection.map((element) => element.ps);
        postMutation = dataStoreLab04.generateValues(postSelection);
      }
    }
    
    // znalezienie maksymalnej fx dla iteracji
    let fxMaxIteration = [];
    for (let i = 0; i < data.length; i++) {
        let max = -Infinity;
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] > max) {
                max = data[i][j];
            }
        }
        fxMaxIteration.push(max);
    }

    let fxMinIteration = [];
    for (let i = 0; i < data.length; i++) {
        let min = Infinity;
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] < min) {
                min = data[i][j];
            }
        }
        fxMinIteration.push(min);
    }

    let fxAvgIteration = [];
    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < data[i].length; j++) {
            sum += data[i][j];
        }
        fxAvgIteration.push(sum/data[i].length);
    }

    return {
        fxMaxIteration: fxMaxIteration,
        fxMinIteration: fxMinIteration,
        fxAvgIteration, fxAvgIteration
    }
  });

  const iterationTable = computed(() => {
    let data = [];
    for (let i = 1; i <= dataStore.T; i++) {
        data.push(i);
    }
    return data;
  }); 

  return { generatedValues, iterationTable };
});
