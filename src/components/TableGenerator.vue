<template>
  <table>
    <thead>
      <tr>
        <slot name="tableHeader"></slot>
      </tr>
    </thead>
    <tbody>
      <slot name="tableBody"></slot>
    </tbody>
  </table>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  color: #fff;
  background-color: #222;
}

:slotted(th),
:slotted(td) {
  border: 1px solid #444;
  padding: 8px;
  text-align: center;
}

thead {
  background-color: #333;
}

:slotted(th) {
  font-weight: bold;
}

:slotted(sup) {
  font-size: 0.7em;
  font-weight: bold;
}
</style>
