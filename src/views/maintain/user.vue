<template>
  <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
  <div class="container">
    <div class="header">
      <a-button
        type="primary"
        @click="dialogVisible = true"
      >
        <a-icon type="plus" />新建
      </a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          <a-button @click="mutilUpdate">
            <a-icon type="check" /> 启用
          </a-button>

          <a-button>
            <a-icon type="stop" />禁用
          </a-button>

          <a-button
            type="danger"
            @click="mutilDelete"
          >
            <a-icon type="close" /> 删除
          </a-button>

          <a-select
            defaultValue="更多操作"
            style="width: 120px"
            @change="handleSelectChange"
          >
            <a-select-option value="jack">禁用</a-select-option>
            <a-select-option value="lucy">删除</a-select-option>
          </a-select>
        </template>
      </span>

      <div class="tips">
        <template v-show="hasSelected">
          {{`已选择 ${selectedRowKeys.length} 项`}}
          <span
            @click="clearSelect"
            class="clearSelect"
            v-if="hasSelected"
          > 清空</span>
        </template>
      </div>
    </div>

    <a-table
      :columns="columns"
      :dataSource="tableData"
      @change="onChange"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      class="table"
    >
      <template
        slot="operation"
        slot-scope="text, record, index"
      >
        <a
          href="javascript:;"
          class="modify"
          @click="()=>edit(record)"
        >修改</a>
      </template>

    </a-table>

    <!-- 弹出表单 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        :model="addForm"
        :rules="rules2"
        ref="addForm"
        label-width="90px"
        class="ruleForm"
      >

        <el-form-item label="角色">
          <el-select v-model="addForm.roleId">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="账号:"
          prop="loginCode"
        >
          <el-input
            v-model="addForm.loginCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="姓名:"
          prop="userName"
        >
          <el-input
            v-model="addForm.userName"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- ****************** -->
        <el-form-item label="性别">
          <el-select v-model="addForm.sex">
            <el-option
              label="男"
              value="1"
            ></el-option>
            <el-option
              label="女"
              value="0"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- ****************** -->

        <el-form-item
          label="密码:"
          prop="password"
        >
          <el-input
            type="password"
            v-model="addForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="确认密码:"
          prop="password2"
        >
          <el-input
            type="password"
            v-model="addForm.password2"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- ****************** -->
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
           @click="createUser('addForm')"
        >保 存</el-button>
      </span>
    </el-dialog>

    <!-- 修改表单 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editVisible"
      width="600px"
    >
      <el-form
        :model="editForm"
        :rules="editRule"
        ref="editForm"
        label-width="90px"
        class="ruleForm"
      >

        <el-form-item label="角色">
          <el-select v-model="editForm.roleId">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="账号:"
          prop="loginCode"
        >
          <el-input
            v-model="editForm.loginCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="姓名:"
          prop="userName"
        >
          <el-input
            v-model="editForm.userName"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- ****************** -->
        <el-form-item label="性别">
          <el-select v-model="editForm.sex">
            <el-option
              label="男"
              value="1"
            ></el-option>
            <el-option
              label="女"
              value="0"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- ****************** -->

        <el-form-item
          label="登录密码:"
          prop="password"
        >
          <el-input
            v-model="editForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="确认密码:"
          prop="passwordSrc"
        >
          <el-input
            v-model="editForm.passwordSrc"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- ****************** -->
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser('editForm')">保 存</el-button>
      </span>
    </el-dialog>

  </div>

</template>
<script>
import { getRoleListByPage, getUserListByPage, updateUser, deleteUser, addUser } from '@/api/user'



const columns = [{
  title: '角色',
  dataIndex: 'roleId',
  filters: [{
    text: '管理员',
    value: '管理员',
  }, {
    text: '员工',
    value: '员工',
  }],
  // specify the condition of filtering result
  // here is that finding the name started with `value`
  onFilter: (value, record) => record.roleId == value
  // sorter: (a, b) => a.name.length - b.name.length,
},

{
  title: '账号',
  dataIndex: 'loginCode',
  key: 'loginCode',
},


{
  title: '姓名',
  dataIndex: 'userName',
  key: 'userName',
  // sorter: (a, b) => a.age - b.age,
}, {
  title: '性别',
  key: 'sex',
  dataIndex: 'sex',
  filters: [{
    text: '男',
    value: 1,
  }, {
    text: '女',
    value: 0,
  }],
  filterMultiple: false,
  onFilter: (value, record) => {
    if(record.sex == 1){
      record.sex = '男'
    }else{
      record.sex = '女'
    }
    record.sex == value
  },
  // sorter: (a, b) => a.address.length - b.address.length,
},
{
  title: '状态',
  dataIndex: 'disabled',
  key: 'disabled',
  filters: [{
    text: '启用',
    value: '启用',
  }, {
    text: '禁用',
    value: '禁用',
  }],
  filterMultiple: false,
  onFilter: (value, record) => record.disabled == value,
  // sorter: (a, b) => a.address.length - b.address.length,
},
{
  title: '操作',
  key: 'operation',
  width: 100,
  scopedSlots: { customRender: 'operation' },
},
];
function onChange (pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}
function filterTableData (data) {



  data.forEach(item => {
    if (item.roleId == 1) {
      item.roleId = "管理员"
    } else if (item.roleId == 2) {
      item.roleId = "员工"
    } else {
      item.roleId = "主管"
    }
    if (item.sex == 1) {
      item.sex = '男'
    } else {
      item.sex = '女'
    }

    if (item.disabled == 1) {
      item.disabled = '启用'
    } else {
      item.disabled = '禁用'
    }
  })
  return data
}

export default {

  data () {
    // this.cacheData = tableData.map(item => ({ ...item }))
    return {
      dialogVisible: false, //是否显示增加用户弹框
      dialogTitle: '添加用户信息',
      editVisible: false,
      editTitle: '添加用户信息',
      selectedRowKeys: [], // 表格选中列的id
      tableData: [], //表格数据
      columns, //列名
      // 增加用户表单数据
      addForm: {
        roleId: '管理员',
        userName: '',
        loginCode: '',
        sex: '男',
        password: '',
        password2: '',
      },
      editForm: {
        roleId: '管理员',
        userName: '',
        loginCode: '',
        sex: '男',
        password: '',
        passwordSrc: '',
      },
      //增加用户表单验证规则
      rules2: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请确认密码', trigger: 'blur' }
        ],
        loginCode: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
        ,
      },
      editRule: {
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        passwordSrc: [
          { required: true, message: '请确认密码', trigger: 'blur' }
        ],
        loginCode: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
        ,

      },
      roleList: [], // 动态角色列表，存放后台的角色列表
      userList: [], // 用户数据列表，存放每一页的用户数据
      currentPage: 1, // 动态页码，初始1
      filter: { // 筛选器
        roleIds: [], // 角色筛选条件（若默认所有，则 roles = roleList）
        sex: '', //  性别筛选条件
        disabled: '' // "是否启用"筛选条件（传 1 或 0）
      }

    }
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    onChange,
    filterTableData,
    init () {
      this.initRoleList()
      this.initUserList()
    },
    initRoleList () {
      getRoleListByPage({ page: 1 }).then(response => {
        this.roleList = response.data.data
      })
    },

    initUserList () {
      getUserListByPage({ page: 1 }).then(response => {

        this.tableData = this.filterTableData(response.data.data)
      })
    },

    // 批量修改，只涉及“启用/禁用”
    mutilUpdate () {
      updateUser({ id: 0, ids: this.selectedRowKeys,disabled:1 }).then(response => {
        console.log('批量“启用/禁用”',response)
      })
    },

    // 批量删除，记得传id=0
    mutilDelete () {
      deleteUser({ id: 0, ids: this.selectedRowKeys }).then(response => {
        if (response.resultCode == 200) {
          this.$message({ message: '成功', type: 'success' })
          this.initUserList()
        } else {
          this.$message({ message: '删除失败', type: 'error' })
        }

      })
    },

    //添加用户
    createUser (formName) {
      let data = this.addForm
      console.log(data)
      this.$refs[formName].validate((valid) => {
        if (valid) {

          addUser(data.roleId,data.userName,data.sex,data.password,data.loginCode).then(res => {
            if (res.resultCode == 200) {
              console.log(res)
              this.$message({ message: '添加成功', type: 'success' })
              this.initUserList()
              this.dialogVisible = false
            } else {
              this.$message({ message: '添加失败', type: 'error' })
            }

          })
        } else {
          this.$message({ message: '请填写完整信息', type: 'error' })
          return false;
        }
      });


    },
    edit (data) {
      this.editVisible = true
      this.editForm = {
        roleId: data.roleId,
        loginCode: data.loginCode,
        password: data.password,
        passwordSrc: data.passwordSrc,
        userName: data.userName,
        sex: data.sex
      }
      
    },
    editUser () {

      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.$message({ message: '修改成功', type: 'success' })
          // 此处完成修改
        } else {
          this.$message({ message: '请填写完整信息', type: 'error' })
          return false;
        }
      });
      this.mutilUpdate()
    },
    // **********************************************
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys
    },
    clearSelect () {
      this.selectedRowKeys = []
    },
    handleSelectChange (value) {
      console.log(`selected ${value}`);
    },
    saveUser () {
      this.dialogVisible = false;
      let user = this.addForm

    }


  }
}
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: #eee;
  padding: 20px 0 20px 0;
}

.table {
  width: 95%;
  background-color: #fff;
  margin: 0 auto;
  padding: 20px;
}
.header {
  width: 95%;
  background-color: #fff;
  margin: 0 auto;
  padding: 20px 20px 0 20px;
}
.tips {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding-left: 5px;
  margin-top: 15px;
}
.clearSelect {
  color: #1890ff;
  cursor: pointer;
  margin-left: 30px;
}
.editable-row-operations a {
  margin-right: 8px;
}
.modify {
  color: #1890ff;
}
.ruleForm {
  width: 450px;
  margin: 0 auto;
}
</style>
<style>
.el-dialog__header {
  border-bottom: 1px solid #eee;
}
.el-dialog__body {
  padding: 20px 10px;
  border-bottom: 1px solid #eee;
}
.el-dialog__title {
  color: #333;
  font-size: 16px;
}
</style>
