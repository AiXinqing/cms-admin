<template>
  <div>
    <div>
      <button
        class="ivu-btn ivu-btn-primary"
        @click.stop="creaetNewsModalVisible = true"
      >
        新建新闻
      </button>
      <Modal
        v-model="creaetNewsModalVisible"
        title="新建新闻"
        ok-text="新建"
        @on-ok="saveNews"
      >
        <Form
          :model="editNews"
          label-position="top"
        >
          <FormItem label="新闻标题">
            <Input v-model="formRight.input1" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

export default {
  data () {
    return {
      creaetNewsModalVisible: false,
      news: [],
      tabs: [],
      editNews: {
        title: '',
        content: '',
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
      const newsdata = {
        ...this.editNews
      }
      delete newsdata.id
      return axios.request({
        url: '/admin/news/create',
        data: JSON.stringify(newsdata),
        method: 'post'
      }).then(({ data }) => {
        this.news.push({
          ...newsdata,
          id: data.id
        })
      })
    }
  }
}
</script>
