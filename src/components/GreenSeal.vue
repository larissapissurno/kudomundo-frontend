<template>
  <div>
      <i></i>
      <label>{{sustainable.papers}} folhas A4 preservadas</label>
  </div>
</template>

<script>
import axios from 'axios'
import { uri } from '@/tenant'

export default {
  name: 'GreenSeal',
  data: function () {
    return {
      sustainable: { papers: 0 }
    }
  },
  methods: {
    loadSustainable () {
      axios.get(`${uri}/sustainable`)
        .then(response => {
          this.$data.sustainable = response.data
        })
    }
  },
  created () {
    this.loadSustainable()
  }
}
</script>

<style scoped>
div {
    height: 30px;
    display: grid;
    grid-template-columns: 30px auto;
    padding: 5px;
    border-radius: 10px;
    font-weight: bold;
    color: #00530e;
    cursor: help;
}

div:hover {
    background-color: #72ee87;
}

div > i {
    background-image: url(../assets/seal-simple.svg);
    background-repeat: no-repeat;
}

div > label {
    display: none;
}

div:hover > label {
    display: block;
    margin-top: 5px;
}
</style>
