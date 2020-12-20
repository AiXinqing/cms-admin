<template>
  <div>
    <Table
      :columns="$options.newsHeaders"
      :data="newsList"
    >
      <template slot="tabId" slot-scope="{ row }">
        {{ _findTab(row.tabId).tabName }}
      </template>
      <template slot="approval" slot-scope="{ row }">
        {{ row.approval ? '已通过' : '待审核' }}
      </template>
      <template slot="actions" slot-scope="{ row }">
        <Button
          type="primary"
          size="small"
          @click="openApprovalModal(row)"
        >审核</Button>
      </template>
    </Table>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import TipTapEditor from '_c/tiptap'

export default {
  components: {
    TipTapEditor
  },

  newsHeaders: [
    {
      key: 'id',
      title: '新闻id'
    },
    {
      key: 'title',
      title: '新闻标题'
    },
    {
      key: 'tabId',
      title: '分类名称',
      slot: 'tabId'
    },
    {
      key: 'approval',
      title: '审核状态',
      slot: 'approval'
    },
    {
      title: '操作',
      slot: 'actions'
    }
  ],

  data () {
    return {
      newsList: [],
      tabs: [],
      approvalNews: null,
      approvalModalVisible: false
    }
  },

  created () {
    this.fetchTabs()
    this.fetchNews()
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

    fetchNews () {
      return axios.request({
        url: '/admin/news/list',
        method: 'post'
      }).then(({ data }) => {
        this.newsList = data.data
      })
    },

    openApprovalModal (news) {
      this.approvalNews = news
      this.approvalModalVisible = true
    },

    _findTab (id) {
      return this.tabs.find(tab => tab.tabId === id) || {
        tabName: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
