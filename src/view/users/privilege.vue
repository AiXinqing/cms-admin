<template>
  <div>
    <div class="tab-btn-wrapper">
      <button
        class="ivu-btn ivu-btn-primary"
        @click="createTabModalVisible = true"
      >
        添加权限
      </button>
      <Modal
        v-model="createTabModalVisible"
        :title="'添加权限'"
        @on-ok="addTab"
      >
        <Form
          :model="editTab"
          :label-width="60"
        >
          <FormItem label="权限名称">
            <Input v-model="editTab.privilegeDesc" placeholder="请输入" />
          </FormItem>
          <FormItem label="权限类型">
            <Select v-model="editTab.privilegeId">
              <Option
                v-for="tabList in privilegeList"
                :key="tabList.value"
                :value="tabList.value"
              >{{ tabList.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
    <Table
      :columns="headers"
      :data="tabs"
    >
    <template slot="tabType" slot-scope="{ row }">
      {{ _findTabType(row.privilegeId).label }}
    </template>
    </Table>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

export default {
  data () {
    return {
      createTabModalVisible: false,
      headers: [
        {
          key: 'privilegeDesc',
          title: '权限名称'
        },
        {
          key: 'privilegeId',
          title: '权限类型',
          slot: 'tabType'
        }
      ],
      tabs: [],
      editTab: {
        privilegeDesc: '',
        privilegeId: ''
      },
      privilegeList: this.$config.privilegeList
    }
  },

  created () {
    this.fetchTabs()
  },

  methods: {

    fetchTabs () {
      return axios.request({
        url: '/admin/privilege/list',
        method: 'get'
      }).then(({ data }) => {
        this.tabs = data.data
      })
    },

    addTab () {
      axios.request({
        url: '/admin/privilege/add',
        data: {
          privilegeDesc: this.editTab.privilegeDesc,
          privilegeId: this.editTab.privilegeId
        },
        method: 'post'
      }).then(({ data }) => {
        this.tabs.push({
          privilegeDesc: this.editTab.privilegeDesc,
          privilegeId: this.editTab.privilegeId
        })
        this.resetEditTab()
      })
    },

    resetEditTab () {
      this.editTab = {
        privilegeDesc: '',
        privilegeId: ''
      }
    },

    _findTabType (tabType) {
      return this.privilegeList.find(item => item.value === tabType)
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
