<template>
  <div>
    <div class="tab-btn-wrapper">
      <button
        class="ivu-btn ivu-btn-primary"
        @click="createKankanUserModalVisible = true"
      >
        添加看看用户
      </button>
      <Modal
        v-model="createKankanUserModalVisible"
        title="添加看看用户"
        ok-text="添加"
        @on-ok="addKankanUser"
      >
        <Form
          :model="kankanUser"
          :label-width="60"
        >
          <FormItem label="用户id">
            <Input v-model="kankanUser.userId" placeholder="请输入" />
          </FormItem>
          <FormItem label="用户名字">
            <Input v-model="kankanUser.userName" placeholder="请输入" />
          </FormItem>
          <FormItem label="用户分类">
            <Select v-model="kankanUser.userType">
              <Option
                v-for="type in kankanTypes"
                :key="type.id"
                :value="type.id"
              >{{ type.typeDesc }}</Option>
            </Select>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="kankanUser.remark" placeholder="请输入" />
          </FormItem>
        </Form>
      </Modal>
    </div>
    <Table
      :columns="headers"
      :data="kankanUsers"
    >
      <template slot="userType" slot-scope="{ row }">
        {{ _findKankanType(row.userType).typeDesc }}
      </template>
    </Table>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

export default {
  data () {
    return {
      createKankanUserModalVisible: false,
      headers: [
        {
          key: 'userId',
          title: '用户id'
        },
        {
          key: 'userName',
          title: '用户名字'
        },
        {
          key: 'userType',
          title: '用户分类',
          slot: 'userType'
        },
        {
          key: 'remark',
          title: '备注'
        }
      ],
      kankanTypes: [],
      kankanUsers: [],
      kankanUser: {
        userId: '',
        userName: '',
        userType: '',
        remark: ''
      }
    }
  },

  created () {
    this.fetchKankanTypes()
    this.fetchKankanUsers()
  },

  methods: {
    fetchKankanTypes () {
      return axios.request({
        url: '/admin/kankan/listType',
        method: 'post'
      }).then(({ data }) => {
        this.kankanTypes = data.data
      })
    },

    fetchKankanUsers () {
      return axios.request({
        url: '/admin/kankan/user/list',
        method: 'post'
      }).then(({ data }) => {
        this.kankanUsers = data.data
      })
    },

    addKankanUser () {
      axios.request({
        url: '/admin/kankan/user/create',
        data: {
          ...this.kankanUser
        },
        method: 'post'
      }).then(({ data }) => {
        this.kankanTypes.push({
          ...this.kankanUser,
          id: data.data.id
        })
        this.resetKankanUser()
      })
    },

    resetKankanUser () {
      this.kankanUser = {
        userId: '',
        userName: '',
        userType: '',
        remark: ''
      }
    },

    _findKankanType (typeId) {
      return this.kankanTypes.find(type => type.id === typeId) || { typeDesc: '' }
    }
  }
}
</script>

<style lang="less" scoped>
.tab-btn-wrapper {
  margin-bottom: 20px;
  text-align: right;
}

.action-button {
  margin-right: .5rem;
}
</style>
