<template>
  <div class="card">
      <div :class="'title ' + color">
          {{card.title}}
      </div>
      <div class="content">
          <img :src="`private/${team}/memes/${card.meme}`" class="meme" alt="imagem da figurinha do card">
          <div class="member">
              <strong>{{card.member}},</strong>
          </div>
          <div class="message">
              {{card.description}}
          </div>
      </div>
  </div>
</template>

<script>
import { team } from '../tenant'
export default {
  name: 'Card',
  props: {
    card: Object,
    color: String
  },
  data: function () {
    return {
      team: team
    }
  }
}
</script>

<style scoped>
.card {
    background-color: #ddd;
    width: 100%;
    border-radius: 5px;
}
.content {
    display: grid;
    grid-template-areas:
    'img member'
    'img message';
    grid-template-rows: auto 1fr;
    grid-template-columns: auto 1fr;
}

.member {
    grid-area: member;
    text-align: left;
    padding-top: 5px;
}

.message {
    display: flex;
    flex-direction: column;
    text-align: left;
    justify-content: center
}

.meme {
    grid-area: img;
    max-height: 150px;
    max-width: 150px;
    padding: 10px;
}

.title {
    background-color: var(--header-color);
    font-size: 18pt;
    font-weight: bold;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    padding: 25px;
    border-radius: 5px 5px 0 0;
}

</style>
