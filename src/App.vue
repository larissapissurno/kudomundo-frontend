<template>
  <div id="app" v-if="$adal.isAuthenticated()">
    <Header />
    <router-view/>
  </div>
</template>

<script>

import Header from '@/components/Header'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>
