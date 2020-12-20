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
        :title="addText + '分类'"
        :ok-text="addText"
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
      <template slot="headline" slot-scope="{ row }">
        {{ _findHeadline(row) ? _findHeadline(row).title : '未设置' }}
      </template>
      <template slot="action" slot-scope="{ row }">
        <Button
          type="primary"
          size="small"
          style="margin-right: 10px;"
          class="action-button"
          @click="openEditTab(row)"
        >
          修改
        </Button>
        <Button
          type="warning"
          size="small"
          style="margin-right: 10px;"
          class="action-button"
          @click="addOrUpdateHeadline(row)"
        >
          {{ _findHeadline(row) ? '修改头条' : '添加头条' }}
        </Button>
      </template>
    </Table>
    <Modal
      v-model="headlineModalVisible"
      :title="headlineText + '头条'"
      :ok-text="headlineText"
      @on-ok="createOrUpdateHeadline"
      @on-cancel="resetHeadline"
    >
      <Form
        :model="editHeadline"
        :label-width="60"
      >
        <FormItem label="头条名称">
          <Input v-model="editHeadline.title" placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

export default {
  data () {
    return {
      headlineModalVisible: false,
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
          title: '头条',
          slot: 'headline'
        },
        {
          slot: 'action',
          width: 250,
          align: 'center',
          title: '操作'
        }
      ],
      tabs: [],
      headlines: [],
      editTab: {
        tabName: '',
        tabType: 1,
        tabId: ''
      },
      editHeadline: {
        title: '',
        picture: '',
        tabId: '',
        id: ''
      },
      tabTypes: this.$config.tabTypes
    }
  },

  created () {
    this.fetchTabs()
    this.fetchHeadlines()
  },

  computed: {
    addText () {
      return this.editTab.tabId
        ? '修改'
        : '添加'
    },

    headlineText () {
      return this.editHeadline.id
        ? '修改'
        : '添加'
    }
  },

  methods: {
    fetchTabs () {
      return axios.request({
        url: '/admin/tab/list',
        method: 'get'
      }).then(({ data }) => {
        this.tabs = data.data
      })
    },

    fetchHeadlines () {
      return axios.request({
        url: '/admin/headerLine/headerLineInfo/list',
        method: 'get'
      }).then(({ data }) => {
        this.headlines = data.data
      })
    },

    openEditTab (tab) {
      this.editTab = {
        ...tab
      }
      this.createTabModalVisible = true
    },

    addTab () {
      if (this.editTab.tabId) {
        // TODO update tab
        axios.request({
          url: '/admin/tab/update',
          method: 'post',
          data: {
            ...this.editTab
          }
        }).then(({ data }) => {
          const oldTabIndex = this.tabs.findIndex(tab => tab.tabId === this.editTab.tabId)
          this.tabs.splice(oldTabIndex, 1, this.editTab)
          this.resetEditTab()
        })
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
            tabId: data.data.tabId
          })
          this.resetEditTab()
        })
      }
    },

    resetEditTab () {
      this.editTab = {
        tabName: '',
        tabType: 1,
        id: ''
      }
    },

    addOrUpdateHeadline (tab) {
      const headline = this._findHeadline(tab)
      if (headline) {
        this.editHeadline = {
          ...headline
        }
      } else {
        this.editHeadline.tabId = tab.tabId
      }
      this.headlineModalVisible = true
    },

    resetHeadline () {
      this.editHeadline = {
        title: '',
        picture: '',
        tabId: '',
        id: ''
      }
    },

    createOrUpdateHeadline () {
      axios.request({
        url: '/admin/headerLine/headerLineInfo',
        method: 'post',
        data: {
          ...this.editHeadline
        }
      }).then(({ data }) => {
        const headLine = this._findHeadline({
          id: this.editHeadline.tabId
        })
        if (headLine) {
          headLine.title = this.editHeadline.title
          headLine.id = data.data.id
        } else {
          this.headlines.push({
            ...this.editHeadline,
            id: data.data.id
          })
        }
        this.$Message.success({
          content: `${this.headlineText}成功`
        })
      }).catch(() => {
        this.$Message.error({
          content: `${this.headlineText}失败`
        })
      }).finally(() => {
        this.resetHeadline()
        this.headlineModalVisible = false
      })
    },

    _findTabType (tabType) {
      return this.tabTypes.find(item => item.value === tabType)
    },

    _findHeadline (tab) {
      return this.headlines.find(item => item.tabId === tab.tabId)
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
