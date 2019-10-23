<template>
  <div>
    <div class="green-seal">
        <i aria-hidden=true></i>
        <label>{{sustainable.papers}} folhas A4 preservadas</label>
    </div>
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
      axios
        .get(`${uri}/sustainable`)
        .then(response => {
          this.$data.sustainable = response.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created () {
    this.loadSustainable()
  }
}
</script>

<style scoped>
.green-seal {
    height: 30px;
    display: grid;
    grid-template-columns: 30px auto;
    padding: 5px;
    border-radius: 10px;
    font-weight: bold;
    color: #00530e;
    cursor: help;
}

.green-seal:hover {
  background-color: #72ee87;
    width: 260px;
    position: absolute;
    z-index: 30;
    height: 40px;
}

.green-seal:hover > label {
    display: block;
    margin-top: 10px;
    margin-left: 5px;
}

.green-seal > i {
    background-image: url(../assets/seal-simple.svg);
    background-repeat: no-repeat;
}

.green-seal > label {
    display: none;
}

</style>
