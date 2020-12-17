<template>
  <div>
    <div class="news-btn-wrapper">
      <button
        class="ivu-btn ivu-btn-primary"
        @click.stop="createNews"
      >
        新建新闻
      </button>
    </div>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import TipTapEditor from '_c/tiptap'

export default {
  components: {
    TipTapEditor
  },

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

    updateNews () {},

    createNews () {
      this.$router.push({
        name: 'news_create'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.news-btn-wrapper {
  margin-bottom: 20px;
  text-align: right;
}
</style>
