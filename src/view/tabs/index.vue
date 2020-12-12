<template>
  <div>
    <div class="tab-btn-wrapper">
      <button
        class="ivu-btn ivu-btn-primary"
        @click="createTabModalVisible = true"
      >
        添加分类
      </button>
      <Modal
        v-model="createTabModalVisible"
        title="添加分类"
        on-text="添加"
        @on-ok="addTab"
      >
        <Form
          :model="editTab"
          :label-width="60"
        >
          <FormItem label="分类名称">
            <Input v-model="editTab.tabName" placeholder="请输入" />
          </FormItem>
          <FormItem label="分类类型">
            <Select v-model="editTab.tabType">
              <Option
                v-for="tabType in tabTypes"
                :key="tabType.value"
                :value="tabType.value"
              >{{ tabType.label }}</Option>
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
        {{ _findTabType(row.tabType).label }}
      </template>
      <template slot="action" slot-scope="{ row }">
        <Button
          type="error"
          size="small"
          @click="removeTab(row)"
        >
          删除
        </Button>
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
          key: 'tabName',
          title: '分类名称'
        },
        {
          key: 'tabType',
          title: '分类类型',
          slot: 'tabType'
        },
        {
          slot: 'action',
          width: 150,
          align: 'center',
          title: '操作'
        }
      ],
      tabs: [],
      editTab: {
        tabName: '',
        tabType: 1,
        id: ''
      },
      tabTypes: [
        {
          value: 1,
          label: '热点'
        },
        {
          value: 2,
          label: '新闻'
        },
        {
          value: 3,
          label: '专栏'
        },
        {
          value: 4,
          label: '视频'
        }
      ]
    }
  },

  created () {
    this.fetchTabs()
  },

  methods: {
    fetchTabs () {
      return axios.request({
        url: '/admin/tab/list',
        method: 'get'
      }).then(({ data }) => {
        this.tabs = data
      })
    },

    addTab () {
      if (this.editTab.id) {
        // TODO update tab
      } else {
        // create tab
        axios.request({
          url: '/admin/tab/add',
          data: {
            tabName: this.editTab.tabName,
            tabType: this.editTab.tabType,
            tabOrder: this.tabs.length
          },
          method: 'post'
        }).then(({ data }) => {
          this.tabs.push({
            tabName: this.editTab.tabName,
            tabType: this.editTab.tabType,
            tabOrder: this.tabs.length,
            id: data.id
          })
          this.resetEditTab()
        })
      }
    },

    removeTab (tab) {
      // 暂时无法删除
      // axios.request({})
    },

    resetEditTab () {
      this.editTab = {
        tabName: '',
        tabType: 1,
        id: ''
      }
    },

    _findTabType (tabType) {
      return this.tabTypes.find(item => item.value === tabType)
    }
  }
}
</script>

<style lang="less" scoped>
.tab-btn-wrapper {
  margin-bottom: 20px;
  text-align: right;
}
</style>
