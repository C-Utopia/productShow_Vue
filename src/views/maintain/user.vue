<template>
  <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
  <div class="container">
    <div class="header">

      <a-button type="primary">
        <a-icon type="plus" />新建
      </a-button>

      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          <a-button>
            <a-icon type="check" /> 启用
          </a-button>

          <a-button>
            <a-icon type="stop" />禁用
          </a-button>

          <a-button type="danger">
            <a-icon type="close" /> 删除
          </a-button>

          <a-select
            default-value="更多操作"
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
          {{ `已选择 ${selectedRowKeys.length} 项` }}
          <span
            v-if="hasSelected"
            class="clearSelect"
            @click="clearSelect"
          > 清空</span>
        </template>
      </div>

    </div>

    <a-table
      :columns="columns"
      :data-source="data"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      bordered
      class="table"
    >

      <template
        slot="operation"
        slot-scope="text, record, index"
      >
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">Save</a>
            <a-popconfirm
              title="Sure to cancel?"
              @confirm="() => cancel(record.key)"
            >
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a
              class="modify"
              @click="() => edit(record.key)"
            >修改</a>
          </span>
        </div>

      </template>
    </a-table>

  </div>

</template>

<script>

import { getRoleListByPage, getUserListByPage } from '@/api/user'

/** const columns = [{
  title: '角色',
  dataIndex: 'manager',
  width: '15%',
  scopedSlots: { customRender: 'manager' }
}, {
  title: '账号',
  dataIndex: 'account',
  width: '20%',
  scopedSlots: { customRender: 'account' }
}, {
  title: '姓名',
  dataIndex: 'name',
  width: '20%',
  scopedSlots: { customRender: 'name' }
},
{
  title: '性别',
  dataIndex: 'gender',
  width: '15%',
  scopedSlots: { customRender: 'gender' },
  filters: [
    { text: '男', value: 'male' },
    { text: '女', value: 'female' }
  ]
},
{
  title: '状态',
  dataIndex: 'status',
  width: '15%',
  scopedSlots: { customRender: 'status' },
  filters: [
    { text: '启用', value: 'on' },
    { text: '未启用', value: 'off' }
  ]
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' }
}] */

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    manager: '管理员',
    account: `${i}`,
    name: `好的`,
    gender: '男',
    status: `已启用`
  })
}

export default {
  components: {
  },
  data() {
    this.cacheData = data.map(item => ({ ...item }))
    return {
      selectedRowKeys: [], // Check here to configure the default column
      data: '',
      columns: '',
      roleList: '', // 动态角色列表，存放后台的角色列表
      userList: '', // 用户数据列表，存放每一页的用户数据
      currentPage: 1, // 动态页码，初始1
      filter: { // 筛选器
        roleIds: [], // 角色筛选条件（若默认所有，则 roles = roleList）
        sex: '', //  性别筛选条件
        disabled: '' // "是否启用"筛选条件（传 1 或 0）
      }
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    init() {
      this.initRoleList()
      this.initUserList()
    },
    initRoleList() {
      getRoleListByPage({ page: 1 }).then(response => {
        console.log('初始化角色列表： ' + response)
        this.roleList = response.data
      })
    },
    initUserList() {
      getUserListByPage({ page: 1 }).then(response => {
        console.log('初始化用户列表： ' + response)
        this.userList = response.data
      })
    },

    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    clearSelect() {
      this.selectedRowKeys = []
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    handleSelectChange(value) {
      console.log(`selected ${value}`)
    },
    cancel(key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
        delete target.editable
        this.data = newData
      }
    },
    handleAdd() {
      const { count, dataSource } = this
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  background: #ddd;
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

</style>
