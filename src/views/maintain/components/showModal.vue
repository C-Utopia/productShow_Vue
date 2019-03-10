<!--  -->
<template>
  <div class="modal-container">
    
      <header class="form-title">添加用户信息</header>
    
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {

    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
    }

  },
  methods: {
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    handleSelectChange (value) {
      console.log(value);
      // this.form.setFieldsValue({
      //   note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
      // });W
    },
    handleRoleSelectChange (value) {
      console.log(value);
    }
  }
}

</script>
<style scoped>
.modal-container {
  width: 600px;
  background: #fff;
  z-index: 999;
}
.ruleForm {
  width: 95%;
  height: 100%;
}

.form-title {
  height: 40px;
  color: #333;
  line-height: 40px;
  margin-bottom: 10px;
  border-radius: 15px;
  border-bottom: 1px solid #eee;
}
</style>