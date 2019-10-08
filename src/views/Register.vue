<template>
    <div class="body">
      <div id="app">
          <router-link to="/" class="button back-button">Voltar para Wall</router-link>

          <nav class="header-form">
              <h3>"{{titles[aba-1]}}"</h3>
          </nav>

          <ul class="abas">
              <li :class="`aba ${aba === 1 ? 'current' : ''}`" @click="goTo(1)">
                  Quem?
              </li>
              <li :class="`aba ${aba === 2 ? 'current' : ''}`" @click="goTo(2)">
                  Qual?
              </li>
              <li :class="`aba ${aba === 3 ? 'current' : ''}`" @click="goTo(3)">
                  O quê?
              </li>
              <li :class="`aba ${aba === 4 ? 'current' : ''}`">
                  Como?
              </li>
          </ul>

          <section class="content">
              <div v-if="aba === 1">
                  <label class="question-label">Escolha!</label>

                  <div class="question" v-if="aba === 1">
                      <div v-for="(memberO, index) in filteredMembers()" :key="index" class="member" @click="setMember(memberO)">
                          <img :src="`https://www.gravatar.com/avatar/${md5(memberO.email)}?s=60`" class="member-image">

                          <label class="member-name">
                              {{ memberO.name }}
                          </label>
                      </div>
                  </div>
              </div>

              <div v-if="aba === 2">
                  <label class="question-label">Escolha!</label>
                  <div class="question">
                      <div v-for="(meme, index) in memes" :key="index" class="meme" @click="setMeme(meme)">
                          <img :src="`private/${team}/memes/${meme.image}`">
                          <label :class="meme.color">{{ meme.title }}</label>
                      </div>
                  </div>
              </div>

              <div class="description" v-if="aba === 3">
                  <label>Deixe o seu recado! <small>(Ele deve ser anônimo, não diga seu nome!)</small></label>
                  <textarea v-model="description" rows="10" required maxlength="256"></textarea>
                  <div class="action">
                      <button type="button" @click="preview" :disabled="description === ''">Próximo</button>
                  </div>
              </div>

              <div v-if="aba === 4">
                  <label class="ql">SEU KUDO ESTA PRONTO! <small>(SÓ FALTAR VOCÊ COLAR NO WALL)</small></label>

                  <div class="centered m15">
                    <Card style="max-width: 450px" :card="getCard()" :color="meme.color" />
                  </div>

                  <div class="action">
                      <a @click="confirm" class="button">Enviar Kudo!</a>
                  </div>
              </div>

          </section>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import { team, uri } from '../tenant'
import * as md5sum from 'md5'
import Card from '../components/Card'

export default {
  name: 'Register',
  components: {
    Card
  },
  data: function () {
    return {
      members: [],
      memes: [],
      meme: null,
      description: '',
      member: '',
      aba: 1,
      team: team,
      titles: [
        'melhor um kudo na wall, do que dois voando',
        'pimenta no kudo dos outros, é refresco',
        'O que o coração não diz, o kudo não sente',
        'Mostre-me os seus Kudos, e te direi quem tu és.'
      ]
    }
  },
  methods: {
    loadJson (name) {
      fetch(`private/${team}/${name}.json`)
        .then(response => response.json())
        .then(json => {
          this.$data[name] = json
        })
        .catch(error => {
          console.log(error)
          this.$router.push('/')
        })
    },
    setMember (member) {
      this.$data.member = member.name
      this.$data.aba = 2
    },
    setMeme (memeNew) {
      this.$data.meme = memeNew
      this.$data.aba = 3
    },
    goTo (aba) {
      if (this.$data.aba > aba) {
        this.$data.aba = aba
      }
    },
    preview () {
      this.$data.aba = 4
    },
    confirm () {
      const card = this.getCard()

      axios.post(`${uri}/card/${team}`, card)
        .then(response => {
          this.$toastr.s('Seu Kudo é Meu agora!', 'Ta salvo')
          this.$router.push('/')
        })
        .catch(error => {
          console.log(error)
          this.$toastr.e('Vish, deu ruim')
        })
    },
    md5 (value) {
      return md5sum(value)
    },
    getCard () {
      return {
        member: this.$data.member,
        description: this.$data.description,
        meme: this.$data.meme.image,
        title: this.$data.meme.title,
        author: this.$adal.user.profile.unique_name
      }
    },
    filteredMembers () {
      return this.$data.members.filter(member => member.email !== this.$adal.user.profile.unique_name)
    }
  },
  created () {
    this.loadJson('memes')
    this.loadJson('members')
  }
}
</script>

<style scoped>
#app {
    max-width: 760px;
    margin: 0 auto;
}

.body {
    height: 100vh;
    align-items: center;
    color: var(--font-color);
    background-image: var(--body-background-image);
    background-color: var(--body-background-color);
    background-repeat: var(--body-background-repeat);
    background-size: var(--body-background-size);
    background-attachment: var(--body-background-attachment);
    background-position-x: var(--body-background-position-x);
    background-position-y: var(--body-background-position-y);
}

.abas {
    padding-top: 15px;
    margin: 0;
    background-color: white;
    position: relative;
    overflow: hidden;
    list-style-type: none;
}

.abas > li {
    position: relative;
    float: left;
    width: 25%;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
}

.abas > li:before {
    content: "";
    display: block;
    background-color: var(--breadcrumb-dot-color);
    border: 5px solid #ccc;
    text-align: center;
    width: 1.7em;
    height: 1.7em;
    line-height: 2em;
    border-radius: 2em;
    position: relative;
    left: 50%;
    margin-bottom: 1em;
    margin-left: -1em;
    z-index: 1;
    padding: 2px;
    cursor: pointer;
}

.abas > .current ~ li:before {
    background-color: #ccc;
    color: #ccc;
    border-color: #ccc;
    cursor: initial;
}

.abas li + li:after {
    content: "";
    display: block;
    width: 100%;
    background-color: var(--breadcrumb-line-color);
    height: 12px;
    position: absolute;
    left: -50%;
    top: 15px;
    z-index: 0;
}

.abas > .current ~ li:after {
    background-color: #ccc;
}

.header-form {
    background-color: var(--form-title);
    color: white;
    padding: 10px;
    margin: 0;
    font-weight: 900;
    text-align: center;
    text-transform: uppercase;
}

.content {
    background-color: white;
    padding: 60px;
    padding-top: 30px;
    height: 100vh;
    max-height: calc(100vh - 370px);
    overflow-y: auto;
}

.question {
    grid-template-rows: auto 1fr;
    grid-template-columns: repeat(4, 1fr);
    display: grid;
    grid-gap: 20px;
    width: 100%;
}

.member {
    border: 1px solid #ccc;
    border-radius: 10px;
    text-align: center;
    padding: 7px;
    min-height: 130px;
    display: grid;
    grid-template-rows: 1fr auto;
}

.member:hover {
    background-color: #ccc;
    cursor: pointer;
}

.member-image {
    border-radius: 40px;
    margin: 0 auto;
}

.member-name {
    font-weight: bold;
    align-content: center;
}

.meme {
    border: 1px solid #ccc;
    border-radius: 10px;
    text-align: center;
    min-height: 80px;
    display: grid;
    grid-template-rows: 1fr auto;
    width: 100%;
}

.meme img {
    margin: 7px auto;
    max-width: 100%;
    max-height: 90px;
}

.meme label {
    border-radius: 0 0 7px 7px;
    height: 60px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    align-items: center;
    justify-content: center;
    display: flex;
}

.meme:hover {
    background-color: #ccc;
    cursor: pointer;
}

.description {
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-gap: 15px;
    width: 100%;
}

.ql, .question-label, .description label {
    text-transform: uppercase;
    font-weight: bolder;
    font-size: 14pt;
}

.question-label {
    margin-bottom: 15px;
    float: left;
}

textarea {
    resize: none;
    font-family: MontSerrat;
    font-size: 12pt;
    padding: 10px;
}

.action {
    display: flex;
    justify-content: flex-end;
}

small {
    font-size: 10pt;
    font-weight: normal;
}

@media(max-width: 760px) {
    .question {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media(max-width: 600px) {
    .question {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media(min-width: 1220px) {
    .back-button {
        position: fixed;
        top: 130px;
        left: calc(calc(50vw - 350px) / 2 - 100px);
    }
}

.m15 { margin: 15px }
</style>
