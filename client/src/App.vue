<template>
  <div id="app">
    <Navigation v-if='currentUser'></Navigation>
    <keep-alive include="chat">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'
import {mapState} from 'vuex'
export default {
  name: 'App',
  components: {Navigation},
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>
