<template>
  <Form
    :model="work"
    :label-width="80"
  >
    <FormItem label="标题">
      <Input
        v-model="work.title"
        placeholder="请输入"
      />
    </FormItem>
    <FormItem label="封面">
      <div class="cover-wrapper">
        <div
          v-if="work.picture"
          class="cover-image"
        >
          <img :src="work.picture">
        </div>
        <FileUpload
          accept="images/*"
          @change="updateCover"
        />
      </div>
    </FormItem>
    <FormItem label="描述">
      <Input
        v-model="work.content"
        :autosize="{minRows: 2,maxRows: 5}"
        type="textarea"
        placeholder="请输入"
      />
    </FormItem>
    <FormItem label="视频">
      <div class="cover-wrapper">
        <div
          v-if="file"
          class="cover-image"
        >
          {{ file.name }}
        </div>
        <FileUpload
          accept="images/*"
          @file-changed="updateSelectedFile"
          @change="updateContent"
        />
      </div>
    </FormItem>
    <FormItem>
      <Button
        type="primary"
        @click.stop="createWork"
      >
        发布
      </Button>
    </FormItem>
  </Form>
</template>

<script>
import axios from '@/libs/api.request'
import FileUpload from '_c/file-upload'

export default {
  components: {
    FileUpload
  },

  data () {
    return {
      tabs: [],
      file: null,
      work: {
        title: '',
        content: '',
        keyword: [],
        picture: '',
        type: 4,
        userId: 4,
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
    // this.fetchTabs()
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
      this.work.picture = url
    },

    updateSelectedFile (file) {
      this.file = file
    },

    updateContent (url) {
      this.work.videoUrl = url
    },

    createWork () {
      const workdata = {
        ...this.work
      }
      delete workdata.id
      return axios.request({
        url: '/admin/work/create',
        data: workdata,
        method: 'post'
      }).then(({ data }) => {
        // this.$router.push({
        //   name: 'work_index'
        // })
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
