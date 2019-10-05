<template>
    <nav>
        <h1>Kudo Wall</h1>
        <h4>Semana {{weekOfYear}}/{{year}} ({{startWeek}} até {{endWeek}})</h4>
    </nav>
</template>

<script>
import { weekOfYear, year, startWeek, endWeek } from '../tenant'

export default {
  name: 'Header',
  data: function () {
    return {
      weekOfYear,
      year,
      startWeek,
      endWeek
    }
  }
}
</script>

<style scoped>

nav {
  background-color: var(--header-color);
  color: white;
  padding: 15px;
  margin: 0;
  font-weight: 900;
  text-align: center;
}

@media(min-width: 700px) {
  nav {
    background-size: var(--header-bg-size);
    background-image: var(--header-bg-image);
    background-repeat: var(--header-bg-repeat);
    background-position-x: var(--header-bg-position-x);
    background-position-y: var(--header-bg-position-y);
  }
}
</style>
