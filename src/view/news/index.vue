<template>
  <div>
    <Table
      :columns="$options.newsHeaders"
      :data="newsList"
    >
      <template slot="tabId" slot-scope="{ row }">
        {{ _findTab(row.tabId).tabName }}
      </template>
      <template slot="publishAt" slot-scope="{ row }">
        <div>
          {{ new Date(row.publishTime).toLocaleDateString() }}
        </div>
      </template>
      <template slot="actions" slot-scope="{ row }">
        <Button
          v-if="!row.isHot"
          type="warning"
          size="small"
          class="action-button"
          @click="setAsHot(row)"
        >设为热点</Button>
        <Button
          v-if="!row.isHeaderLine"
          type="info"
          size="small"
          class="action-button"
          @click="setAsHeadline(row)"
        >设为头条</Button>
        <Button
          type="default"
          size="small"
          class="action-button"
          @click="openPreviewNewsModal(row)"
        >详情</Button>
      </template>
    </Table>

    <Modal
      v-model="previewModalVisible"
      :title="previewNews ? previewNews.title : ''"
      :width="768"
      footer-hide
    >
      <div class="editor-wrapper">
        <TipTapEditor
          :value="previewNews ? previewNews.content : ''"
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
      title: '发布时间',
      key: 'publishTime',
      slot: 'publishAt',
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
      previewModalVisible: false,
      newsList: [],
      headlines: [],
      tabs: [],
      loading: true,
      approvalNews: null,
      previewNews: null
    }
  },

  created () {
    this.fetchTabs()
    this.fetchNews()
    this.fetchHeadlines()
  },

  methods: {
    fetchHeadlines () {
      return axios.request({
        url: '/admin/headerLine/headerLineInfo/list',
        method: 'get'
      }).then(({ data }) => {
        this.headlines = data.data
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

    openPreviewNewsModal (news) {
      this.previewNews = news
      this.previewModalVisible = true
    },

    setAsHot (news) {
      axios.request({
        url: '/admin/hot/create',
        method: 'post',
        data: {
          itemId: news.id,
          itemType: news.resourceType || 1, // 新闻
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

    setAsHeadline (news) {
      const headline = this._getHeadline(news.tabId)

      if (!headline) {
        const tab = this._findTab(news.tabId)
        this.$Modal.confirm({
          title: `${tab.tabName}没有设置头条，请先添加`,
          content: '是否跳转页面去添加？',
          okText: '跳转',
          onOk: () => {
            this.$router.push({
              name: 'tabs_index'
            })
          }
        })
        return
      }
      axios.request({
        url: '/admin/headerLine/headerLineItem',
        method: 'post',
        data: {
          headerLineId: headline.id,
          resourceId: news.resourceId
        }
      }).then(() => {
        this.$set(news, 'isHeaderLine', true)
        this.$Message.success({ content: '设置成功' })
      }).catch(() => {
        this.$Message.error({
          content: '设置失败'
        })
      })
    },

    _findTab (id) {
      return this.tabs.find(tab => tab.tabId === id) || {
        tabName: ''
      }
    },

    _getHeadline (tabId) {
      return this.headlines.find(item => item.tabId === tabId)
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
