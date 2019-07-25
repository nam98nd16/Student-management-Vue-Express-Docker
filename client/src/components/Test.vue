<template>
  <div>
    <h1>Testing</h1>
    <div v-for='test in test'>
      <p>
        <span><b>{{ test.title }}</b></span><br />
        <span>{{ test.description }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import TestApi from '@/services/TestApi'
export default {
  name: 'TestApi',
  data () {
    return {
      test: []
    }
  },
  mounted () {
    this.getTest()
  },
  methods: {
    async getTest () {
      const response = await TestApi.fetchTest()
      this.test = response.data
    }
  }
}
</script>