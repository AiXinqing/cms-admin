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
        {{ _getApprovalText(row.approval) }}
      </template>
      <template slot="actions" slot-scope="{ row }">
        <Button
          v-if="![2, 3].includes(row.approval)"
          type="primary"
          size="small"
          @click="openApprovalModal(row)"
        >审核</Button>
      </template>
    </Table>
    <Modal
      v-if="approvalModalVisible"
      v-model="approvalModalVisible"
      :title="'审核 - ' + approvalNews.title"
      ok-text="通过"
      cancel-text="拒绝"
    >
    </Modal>
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
    },

    _getApprovalText (state) {
      switch (state) {
        case 3:
          return '未通过'
        case 2:
          return '已通过'
        default:
          return '待审核'
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
