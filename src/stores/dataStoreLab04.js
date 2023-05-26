import { defineStore } from "pinia";
import { computed } from "vue";
import { useDataStore } from "@/stores/dataStore";

export const useDataStoreLab04 = defineStore("DataStoreLab04", () => {
  const dataStore = useDataStore();
  
  const generatedValues = computed(() => {
    return generateValues(dataStore.getPs);
  });

  const L = computed(() =>
    Math.ceil(
      Math.log2(
        (1 / dataStore.decimalPlaces[dataStore.selected - 2]) *
          (dataStore.b - dataStore.a) +
          1
      )
    )
  );

  const generateValues = (getPs) => {
    const data = [];

    for (let i = 0; i < dataStore.N; i++) {
      const xbin = realToBin(getPs[i]);
      const parentsPopulation = calculateParentsPopulation(xbin);
      const pc = parentsPopulation != null ? generatePc() : null;

      data.push({
        ps: getPs[i],
        xbin: xbin,
        parentsPopulation: parentsPopulation,
        pc: pc,
        childrenPopulation: null,
        crossBreedingPopulation: null,
        mutationIndexes: null,
        mutationPopulationBin: null,
        mutationPopulationReal: null,
        fx: null,
      });
    }

    let parents = []; // tablica z samymi rodzicami
    data.forEach((element) => parents.push(element.parentsPopulation));

    // populacja dzieci
    if (checkIfParentsEven(parents)) {
      fillChildrenPopulationData(dataStore.N, data);
    } else {
      let lastIndex = dataStore.N - 1; // ma być indeks ostatniego elementu w parents ktory nie jest nullem
      for (let i = dataStore.N - 1; i > 0; i--) {
        if (parents[i] != null) {
          break;
        }
        lastIndex--;
      }
      fillChildrenPopulationData(lastIndex, data); // skoro nie jest parzyscie to bez ostatniego elementu

      // odnajdz poprzedni element z populacji rodziców, który nie jest nullem
      let prevNotNull = null;
      for (let i = lastIndex - 1; i > 0; i--) {
        if (parents[i] != null) {
          prevNotNull = parents[i];
          break;
        }
      }

      data[lastIndex].childrenPopulation = calculateChildrenPopulation(
        data[lastIndex].pc,
        prevNotNull,
        data[lastIndex].parentsPopulation
      );
    }

    // populacja po krzyżowaniu
    for (let i = 0; i < dataStore.N; i++) {
      data[i].crossBreedingPopulation =
        data[i].childrenPopulation != null
          ? data[i].childrenPopulation
          : data[i].xbin;
    }

    // miejsca mutacji
    for (let i = 0; i < dataStore.N; i++) {
      data[i].mutationIndexes = calculateMutationIndexes(
        data[i].crossBreedingPopulation
      );
    }

    // populacja po mutacji bin
    for (let i = 0; i < dataStore.N; i++) {
      if (data[i].mutationIndexes != null) {
        let indexes = data[i].mutationIndexes.split(", ");
        data[i].mutationPopulationBin = mutation(
          data[i].crossBreedingPopulation,
          indexes
        );
      } else {
        data[i].mutationPopulationBin = mutation(
          data[i].crossBreedingPopulation,
          null
        );
      }
    }

    // populacja po mutacji zamiana w real
    for (let i = 0; i < dataStore.N; i++) {
      data[i].mutationPopulationReal = binToReal(data[i].mutationPopulationBin);
      data[i].fx = calculatefx(data[i].mutationPopulationReal);
    }

    
    // dataStore.getPostMutation.length = 0;
    for (let i = 0; i < dataStore.N; i++) {
      dataStore.getPostMutation[i] = data[i].mutationPopulationReal;
    }

    return data;
  };

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

  const realToBin = (xreal) => {
    const int = realToInt(xreal);
    const bin = intToBin(int);
    return bin;
  };

  const calculateParentsPopulation = (bin) => {
    const r = Math.random();
    if (r <= dataStore.pk) {
      return bin;
    }

    return null;
  };

  let isFirstParentGeneratePc = true;
  let prevPc = 0;
  const generatePc = () => {
    if (isFirstParentGeneratePc) {
      const pc = Math.floor(Math.random() * (L.value - 1)) + 1;
      prevPc = pc;
      isFirstParentGeneratePc = false;
      return pc;
    }

    isFirstParentGeneratePc = true;
    return prevPc;
  };

  const fillChildrenPopulationData = (arraySize, data) => {
    for (let i = 1; i < arraySize; i++) {
      for (let j = i; j < arraySize; j++) {
        if (data[i - 1].pc == data[j].pc && data[i - 1].pc != null) {
          data[i - 1].childrenPopulation = calculateChildrenPopulation(
            data[i - 1].pc,
            data[j].parentsPopulation,
            data[i - 1].parentsPopulation
          );
          data[j].childrenPopulation = calculateChildrenPopulation(
            data[i - 1].pc,
            data[i - 1].parentsPopulation,
            data[j].parentsPopulation
          );
        }
      }
    }
  };

  const calculateChildrenPopulation = (pc, firstParent, secondParent) => {
    
    if (firstParent == null) {
      return null;
    }

    const [firstParentPart1, firstParentPart2] = [
      firstParent.slice(0, pc),
      firstParent.slice(pc),
    ];
    const [secondParentPart1, secondParentPart2] = [
      secondParent.slice(0, pc),
      secondParent.slice(pc),
    ];

    return secondParentPart1 + "" + firstParentPart2;
  };

  const checkIfParentsEven = (parentsPopulation) => {
    let counter = 0;
    parentsPopulation.forEach((parent) => {
      if (parent != null) {
        counter++;
      }
    });
    return counter % 2 == 0;
  };

  const calculateMutationIndexes = (bin) => {
    let result = null;
    for (let i = 0; i < bin.length; i++) {
      const r = Math.random();
      if (r <= dataStore.pm) {
        result = result + (i + 1) + ", ";
      }
    }

    return result;
  };

  const mutation = (bin, indexes) => {
    if (indexes == null) {
      return bin;
    }

    indexes.forEach((index) => {
      for (let i = 0; i < bin.length; i++) {
        if (i == index - 1) {
          let negation = bin[i] ^ 1;
          bin = bin.substr(0, i) + negation + bin.substr(i + 1);
        }
      }
    });
    return bin;
  };

  const binToInt = (xbin) => parseInt(xbin, 2);

  const intToReal = (xint, decimalPlaces) =>
    (
      (xint * (dataStore.b - dataStore.a)) / (Math.pow(2, L.value) - 1) +
      dataStore.a
    ).toFixed(decimalPlaces);

  const binToReal = (bin) => {
    const int = binToInt(bin);
    const real = intToReal(int, dataStore.selected);
    return real;
  };

  const calculatefx = (real) => {
    const m = mantissa(real);
    return m * (Math.cos(20 * Math.PI * real) - Math.sin(real));
  };

  const mantissa = (real) => Math.abs(real) % 1;

  return { generatedValues, generateValues };
});
