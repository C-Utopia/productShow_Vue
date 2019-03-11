<!--  -->
<template>
  <div class="modal-container">

    <header class="form-title">添加用户信息</header>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >

      <el-form-item
        label="角色"
        prop="rule"
      >
        <el-select
          v-model="ruleForm.role"
          placeholder="请选择角色"
        >
          <el-option
            label="管理员"
            value="manager"
          ></el-option>
          <el-option
            label="员工"
            value="employee"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="账号"
        prop="account"
      >
        <el-input v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名"
        prop="name"
      >
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>

      <!-- ***************** -->
      <el-form-item
        label="性别"
        prop="sex"
      >
        <el-select
          v-model="ruleForm.sex"
          placeholder="请选择性别"
        >
          <el-option
            label="男"
            value="male"
          ></el-option>
          <el-option
            label="女"
            value="female"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="登录密码"
        prop="pass"
      >
        <el-input v-model="ruleForm.pass" type="password"></el-input>
      </el-form-item>

      <el-form-item
        label="确认密码"
        prop="pass2"
      >
        <el-input v-model="ruleForm.pass2"  type="password">></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          @click="resetForm('ruleForm')"
        >取消</el-button>
        <el-button  type="primary" @click="save('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>

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
      ruleForm: {
        rule: '',
        name: '',
        account: '',
        sex: '',
        pass: '',
        pass2: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'change' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        pass2: [
          { required: true, message: '请确认密码', trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.$emit("close")
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