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
    <FormItem label="新闻封面">
      <div class="cover-wrapper">
        <div
          v-if="news.picture"
          class="cover-image"
        >
          <img :src="news.picture">
        </div>
        <FileUpload
          ref="fileUpload"
          accept="images/*"
          @change="updateCover"
        />
      </div>
    </FormItem>
    <FormItem label="分类">
      <Select
        v-model="news.tabId"
        :placeholder="tabPlaceholder"
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
import FileUpload from '_c/file-upload'

export default {
  components: {
    TipTapEditor,
    FileUpload
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

  computed: {
    tabPlaceholder () {
      return this.tabs.length
        ? '请选择'
        : '没有可选的分类，请先添加分类'
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
        this.tabs = data.data.filter((tab) => tab.tabType === 2)
      })
    },

    updateCover (url) {
      this.news.picture = url
    },

    createNews () {
      const newsdata = {
        ...this.news
      }
      delete newsdata.id
      return axios.request({
        url: '/admin/news/create',
        data: newsdata,
        method: 'post'
      }).then(({ data }) => {
        this.$router.push({
          name: 'news_index'
        })
      })
    }
  }
}
</script>

<style lang="less">
  .cover-image {
    width: 50%;

    img {
      max-width: 100%;
    }
  }
</style>
