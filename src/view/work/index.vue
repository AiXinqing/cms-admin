<template>
  <div>
    <Table
      :columns="$options.workHeaders"
      :data="workList"
    >
      <template slot="type" slot-scope="{ row }">
        <div>
          {{ _findType(row.type).label }}
        </div>
      </template>
      <template slot="author" slot-scope="{ row }">
        <div>
          {{ _findUser(row.userId).userName }}
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

export default {
  workHeaders: [
    {
      key: 'id',
      title: '编号',
      width: 80
    }, {
      key: 'title',
      title: '标题'
    }, {
      key: 'type',
      slot: 'type',
      title: '类别'
    }, {
      key: 'userId',
      title: '作者',
      slot: 'author'
    }
  ],

  data () {
    return {
      workList: [],
      users: [],
      typeList: this.$config.kankanTypes
    }
  },

  created () {
    this.fetchWorks()
    this.fetchUsers()
  },

  methods: {
    fetchWorks () {
      return axios.request({
        url: '/admin/work/list',
        method: 'get'
      }).then(({ data }) => {
        this.workList = data.data
      })
    },

    fetchUsers () {
      return axios.request({
        url: '/admin/kankan/user/list',
        method: 'post'
      }).then(({ data }) => {
        this.users = data.data
      })
    },

    _findType (type) {
      return this.typeList.find(item => item.value === type) || { label: '没有分类' }
    },

    _findUser (userId) {
      return this.users.find(user => user.userId === userId) || { userName: '' }
    }
  }
}
</script>
