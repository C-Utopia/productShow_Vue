<!--  -->
<template>
  <div>

  </div>

</template>

<script>
import { test } from '@/api/user'

export default {
  data () {
    return {
    };
  },

  mounted () {
    this.foo()
  },
  methods: {
    foo () {
      let addForm = {
        roleId: 1,
        userName: '1',
        loginCode: '666',
        sex: 1,
        password: '2',
      }
        test(addForm).then(res => {
          console.log(res)
        })
    },
  }
}

</script>
<style lang=''>
</style>