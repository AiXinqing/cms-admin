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
      newsList: [],
      tabs: []
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

    updateNews () {},

    createNews () {
      this.$router.push({
        name: 'news_create'
      })
    }
  }
}
</script>
