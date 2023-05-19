import { defineStore } from "pinia";
import { ref, computed } from "vue";
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

  if (dataStore.eliteChecked) {
    console.log("yes")
  }

  const decimalPlaces = dataStore.selected;

  var qx = 0.0;
  var min = 10000;
  var gxSum = 0;
  for (let i = 0; i < dataStore.N; i++) {
    const fx = calculatefx(real[i], decimalPlaces);

    if (fx < min) {
      min = fx;
    }

    fxs.push(fx);
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
    });

    dataStore.getPs[i] = ps;
  }

  return data;
  };


  const calculatefx = (real, decimalPlaces) => {
    const m = mantissa(real).toFixed(decimalPlaces);
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

  return { generatedValues, generateValues };
});
