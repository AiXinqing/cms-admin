<template>
  <div>
    <Table
      :columns="$options.newsHeaders"
      :data="newsList"
    >
      <template slot="tabId" slot-scope="{ row }">
        {{ _findTab(row.tabId).tabName }}
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
    }
  ],

  data () {
    return {
      newsList: [],
      tabs: []
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

    _findTab (id) {
      return this.tabs.find(tab => tab.tabId === id) || {
        tabName: ''
      }
    },

    updateNews () {}
  }
}
</script>

<style lang="less" scoped>
</style>
