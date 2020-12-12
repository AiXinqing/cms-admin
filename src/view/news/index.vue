<template>
  <div>
    <div>
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
      creaetNewsModalVisible: false,
      news: [],
      tabs: [],
      editNews: {
        title: '',
        content: '{}',
        keyword: [],
        picture: '',
        tabId: '',
        id: ''
      }
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

    saveNews () {
      if (this.editNews.id) {
        this.updateNews()
      } else {
        this.createNews()
      }
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
