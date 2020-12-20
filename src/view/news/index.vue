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
          class="action-button"
          @click="openApprovalModal(row)"
        >审核</Button>
        <Button
          v-if="!row.isHot"
          type="warning"
          size="small"
          class="action-button"
          @click="setAsHot(row)"
        >设为热点</Button>
        <Button
          v-if="!row.isHot"
          type="info"
          size="small"
          class="action-button"
          @click="setAsHeadline(row)"
        >设为头条</Button>
      </template>
    </Table>
    <Modal
      v-model="approvalModalVisible"
      :title="'审核 - ' + (approvalNews ? approvalNews.title : '')"
      :loading="loading"
      :width="768"
      ok-text="通过"
      cancel-text="拒绝"
      @on-ok="approve"
      @on-cancel="refuse"
    >
      <div class="editor-wrapper">
        <TipTapEditor
          :value="approvalNews ? approvalNews.content : ''"
          readonly
          min-height="100px"
        />
      </div>
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
      title: '新闻id',
      width: 80
    },
    {
      key: 'title',
      title: '新闻标题'
    },
    {
      key: 'tabId',
      title: '分类名称',
      slot: 'tabId',
      width: 120
    },
    {
      key: 'approval',
      title: '审核状态',
      slot: 'approval',
      width: 120
    },
    {
      title: '操作',
      width: 300,
      slot: 'actions'
    }
  ],

  data () {
    return {
      newsList: [],
      tabs: [],
      loading: true,
      approvalNews: null,
      approvalModalVisible: false
    }
  },

  created () {
    this.fetchTabs()
    this.fetchNews()
  },

  methods: {
    changeLoading () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },

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

    approve () {
      axios.request({
        url: `/admin/news/${this.approvalNews.id}/approve`,
        method: 'post'
      }).then(() => {
        this.approvalNews.approval = 2
        this.approvalModalVisible = false
      }).catch(() => {
        this.$Message.error({
          content: '通过失败'
        })
      }).finally(() => {
        this.changeLoading()
      })
    },

    refuse () {
      axios.request({
        url: `/admin/news/${this.approvalNews.id}/refuse`,
        method: 'post'
      }).then(() => {
        this.approvalNews.approval = 3
      }).catch(() => {
        this.$Message.error({
          content: '拒绝失败'
        })
      })
    },

    setAsHot (news) {
      axios.request({
        url: '/admin/hot/create',
        method: 'post',
        data: {
          itemId: news.id,
          itemType: 2, // 新闻
          itemOrder: 0
        }
      }).then(() => {
        this.$set(news, 'isHot', true)
        this.$Message.success({ content: '设置成功, 你可以在热点列表里面查看' })
      }).catch(() => {
        this.$Message.error({
          content: '设置失败'
        })
      })
    },

    setAsHeadline (news) {},

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
.editor-wrapper {
  max-height: 70vh;
  overflow: auto;
}

.action-button {
  margin-right: .5rem;
}
</style>
