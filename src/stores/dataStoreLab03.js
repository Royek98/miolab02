import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";
import { useDataStore } from "@/stores/dataStore";

export const useDataStoreLab03 = defineStore("DataStoreLab03", () => {
  const dataStore = useDataStore();

  const generatedValues = computed(() => {
    return generateValues(null);
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

  let elite = ref(null);
  const generateValues = (getPostMutation) => {
    const data = [],
      fxs = [],
      gxs = [],
      pxs = [],
      qxs = [];
    let real;

    // do labu 5
    if (getPostMutation != null) {
      real = getPostMutation;
    } else {
      real = dataStore.getGeneratedValues;
    }

    const decimalPlaces = dataStore.selected;
    var qx = 0.0;
    var min = 10000;
    var gxSum = 0;

    if (elite.value != null && dataStore.eliteChecked) {
      if (!real.includes(elite.value)){
        let randomIndex = Math.floor(Math.random() * (real.length));
        real[randomIndex] = elite.value;
      }
    }

    for (let i = 0; i < dataStore.N; i++) {
      const fx = calculatefx(real[i], decimalPlaces);

      if (fx < min) {
        min = fx;
      }

      fxs.push(fx);
    }

    const iterationTableFxMax = findMaxFx(fxs);
    const iterationTableFxMin = findMinFx(fxs);
    const iterationTableFxAvg = findAvgFx(fxs);

    if (dataStore.eliteChecked) {
      elite.value = findMaxFxAndRetrunEliteValue(fxs, real);
      
    }

    for (let i = 0; i < dataStore.N; i++) {
      const gx = calculategx(fxs[i], min, decimalPlaces);
      gxSum += gx;
      gxs.push(gx);
    }

    for (let i = 0; i < dataStore.N; i++) {
      const px = calculatepx(gxs[i], gxSum);
      qx += px;
      pxs.push(px);
      qxs.push(qx);
    }

    for (let i = 0; i < dataStore.N; i++) {
      const r = randomNumberInRange2(0, 1);
      const ps = getRealFromRange(real, qxs, r);

      data.push({
        id: i + 1,
        real: real[i],
        fx: fxs[i],
        gx: gxs[i],
        px: pxs[i],
        qx: qxs[i],
        r: r,
        ps: ps,
        bin: realToBin(real[i])
      });

      dataStore.getPs[i] = ps;
    }

    return { data: data, iterationTableFxMax: iterationTableFxMax, iterationTableFxMin: iterationTableFxMin, iterationTableFxAvg: iterationTableFxAvg };
  };

  const calculatefx = (real, decimalPlaces) => {
    // const m = mantissa(real).toFixed(decimalPlaces);
    const m = mantissa(real);
    return m * (Math.cos(20 * Math.PI * real) - Math.sin(real));
  };

  const calculategx = (fx, fmin, decimalPlaces) => {
    return fx - fmin + Math.pow(10, -decimalPlaces);
  };

  const calculatepx = (gx, gxSum) => {
    return gx / gxSum;
  };

  const randomNumberInRange2 = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  const getRealFromRange = (real, qxs, r) => {
    for (let i = 0; i < qxs.length; i++) {
      if (i == 0) {
        if (r > 0 && r <= qxs[i]) return real[i];
      } else {
        if (r > qxs[i - 1] && r <= qxs[i]) return real[i];
      }
    }
  };

  const mantissa = (real) => Math.abs(real) % 1;

  const findMaxFxAndRetrunEliteValue = (fxs, real) => {
    let max = -Infinity;
    let indexOfMaxFx;
    for (let i = 0; i < fxs.length; i++) {
      if (fxs[i] > max) {
        max = fxs[i];
        indexOfMaxFx = i;
      }
    }
    return real[indexOfMaxFx];
  };

  const findMaxFx = (fxs) => {
    let max = -Infinity;
    for (let i = 0; i < fxs.length; i++) {
      if (fxs[i] > max) {
        max = fxs[i];
      }
    }
    return max;
  };

  const findMinFx = (fxs) => {
    let min = Infinity;
    for (let i = 0; i < fxs.length; i++) {
      if (fxs[i] < min) {
        min = fxs[i];
      }
    }
    return min;
  };

  const findAvgFx = (fxs) => {
    let sum = 0;
    for (let i = 0; i < fxs.length; i++) {
      sum += fxs[i];
    }
    return sum/fxs.length
  }

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

  return { generatedValues, generateValues, elite  };
});
