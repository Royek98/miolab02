<template>
  <table-generator>
    <template #tableHeader>
      <th>LP</th>
      <th>x<sup>real</sup></th>
      <th>f(x<sup>real</sup>)</th>
      <th>g(x)</th>
      <th>P(x)</th>
      <th>q(x)</th>
      <th>r</th>
      <th>Populacja po selekcji x<sup>real</sup></th>
    </template>
    <template #tableBody>
      <tr
        v-for="(item, index) in generatedValues"
        :key="item"
        @mouseenter="(event) => event.originalTarget.classList.add('green')"
        @mouseleave="(event) => event.originalTarget.classList.remove('green')"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.real }}</td>
        <td>{{ item.fx }}</td>
        <td>{{ item.gx }}</td>
        <td>{{ item.px }}</td>
        <td>{{ item.qx }}</td>
        <td>{{ item.r }}</td>
        <td>{{ item.ps }}</td>
      </tr>
    </template>
  </table-generator>
</template>

<script setup>
import TableGenerator from "@/components/TableGenerator.vue";
import { useDataStore } from "@/stores/dataStore";
import { computed } from "vue";

const dataStore = useDataStore();

const L = computed(() =>
  Math.ceil(
    Math.log2(
      (1 / dataStore.decimalPlaces[dataStore.selected - 2]) *
        (dataStore.b - dataStore.a) +
        1
    )
  )
);

const generatedValues = computed(() => {
  dataStore.canShowLab04Table = true;
  const data = [],
    fxs = [],
    gxs = [],
    pxs = [],
    qxs = [];
  const real = dataStore.getGeneratedValues;
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

  dataStore.getPs.length = 0; // clears array
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

    dataStore.getPs.push(ps);
  }

  return data;
});

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
      if (r >= 0 && r < qxs[i]) return real[i];
    } else {
      if (r >= qxs[i - 1] && r < qxs[i]) return real[i];
    }
  }
}

const mantissa = (real) => Math.abs(real) % 1;
</script>

