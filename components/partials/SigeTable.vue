<template>
  <div>
    <p> table </p>
  </div>
</template>

<script>
export default {
  name: 'SigeTable',
  props: {
    tableValues: {
      type: Object,
      default: null
    },
    tableHeader: {
      type: Object,
      default: null
    }
  }
}
</script>
