<template>
  <section class="board">
    <!-- {{ "Hello, " + $adal.user.profile.name + ' (' + $adal.user.profile.unique_name + ')' }} -->
    <div class="actions">
        <GreenSeal />
        <div class="centered">
          <a class="button filter" :class="{'active': period === 'week'}" @click="setPeriod('week')">semana</a>
          <a class="button filter" :class="{'active': period === 'month'}" @click="setPeriod('month')">mês</a>
          <a class="button filter" :class="{'active': period === 'quarter'}" @click="setPeriod('quarter')">quarter</a>
        </div>
        <div class="right">
          <router-link class="button" to="/register" title="Libera ai seu Kudo, vai.">+ Enviar</router-link>
        </div>
    </div>
    <div class="content-center" v-if="cards.length === 0">
        <img src="../assets/travolta-kudo.gif">
    </div>
    <div class="cards" v-if="cards.length > 0">
        <Card
            v-for="card in cards"
            v-bind:key="card.id"
            :card="card"
            :color="getColor(card.meme)" />
    </div>
  </section>
</template>

<script>
import GreenSeal from '@/components/GreenSeal'
import Card from '@/components/Card'
import axios from 'axios'
import moment from 'moment'

import { uri, team } from '@/tenant'

import Vue from 'vue'
import Loading from 'vue-loading-overlay'

// eslint-disable-next-line
import 'vue-loading-overlay/dist/vue-loading.css'
Vue.use(Loading)

export default {
  name: 'Board',
  components: {
    GreenSeal,
    Card
  },
  data: function () {
    return {
      cards: [],
      memes: [],
      period: 'week'
    }
  },
  methods: {
    loadBoard () {
      const loader = this.$loading.show()
      axios
        .get(`${uri}/board/${team}?period=${this.$data.period}`)
        .then(res => {
          loader.hide()
          this.$data.cards = res.data.sort((a, b) => moment(b.timestamp).diff(moment(a.timestamp)))
        })
        .catch(error => {
          console.log(error)
          loader.hide()
        })
    },
    loadMemes () {
      fetch(`private/${team}/memes.json`)
        .then(response => {
          if (response.status !== 200) {
            alert('Time não configurado, verifique com seu time ou fale com seu gestor.')
            return []
          }
          return response.json()
        })
        .then(myJson => {
          this.$data.memes = myJson
        })
    },
    getColor (meme) {
      const filtered = this.$data.memes.filter(e => e.image === meme)[0] || {}
      return filtered.color
    },
    setPeriod (period) {
      if (this.$data.period !== period) {
        this.$data.period = period
        this.loadBoard()
      }
    }
  },
  created () {
    this.loadMemes()
    this.loadBoard()
  }
}
</script>

<style scoped>
.cards {
    grid-template-columns: repeat(4, 1fr);
    display: grid;
    grid-gap: 24px;
    width: calc(100% - 46px);
    padding-left: 24px;
    padding-right: 24px;
    overflow-y: auto;
    max-height: calc(100vh - 180px);
}

@media(max-width: 1840px) {
    .cards {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media(max-width: 1240px) {
    .cards {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media(max-width: 870px) {
    .cards {
        grid-template-columns: repeat(1, 1fr);
    }
}

.actions {
    margin-left: 25px;
    margin-right: 35px;
    margin-top: 10px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 95px 1fr 95px;
}

</style>
