<template>
  <Form
    :model="news"
    :label-width="80"
  >
    <FormItem label="新闻标题">
      <Input
        v-model="news.title"
        placeholder="请输入"
      />
    </FormItem>
    <FormItem label="分类">
      <Select
        v-model="news.tabId"
        placeholder="请选择"
      >
        <Option
          v-for="tab in tabs"
          :key="tab.tabId"
          :value="tab.tabId"
        >{{ tab.tabName }}</Option>
      </Select>
    </FormItem>
    <FormItem label="新闻内容">
      <tip-tap-editor v-model="news.content" />
    </FormItem>
    <FormItem>
      <Button
        type="primary"
        @click.stop="createNews"
      >
        发布
      </Button>
    </FormItem>
  </Form>
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
      tabs: [],
      news: {
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
        this.tabs = data.data
      })
    },

    createNews () {
      const newsdata = {
        ...this.news
      }
      debugger
      delete newsdata.id
      return axios.request({
        url: '/admin/news/create',
        data: newsdata,
        method: 'post'
      }).then(({ data }) => {
        this.news.push({
          ...newsdata,
          id: data.data.id
        })
      })
    }
  }
}
</script>
