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
    <FormItem label="类型">
      <Select v-model="work.type">
        <Option
          v-for="type in workTypes"
          :key="type.value"
          :value="type.value"
        >{{ type.label }}</Option>
      </Select>
    </FormItem>
    <keep-alive>
      <FormItem v-if="work.type === 0" label="内容">
        <tip-tap-editor v-model="work.content" />
      </FormItem>
    </keep-alive>
    <keep-alive>
      <FormItem v-if="work.type=== 1" label="视频">
        <div class="video-wrapper">
          <div class="video-file" v-if="file">
            {{ file.name }}
          </div>
          <FileUpload
            accept="images/*"
            @file-changed="updateSelectedFile"
            @change="updateContent"
          />
        </div>
      </FormItem>`
    </keep-alive>
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
import TipTapEditor from '_c/tiptap'

export default {
  components: {
    FileUpload,
    TipTapEditor
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
        type: 0,
        userId: 4,
        videoUrl: '',
        id: ''
      },
      workTypes: [
        {
          value: 0,
          label: '文章'
        },
        {
          value: 1,
          label: '视频'
        }
      ]
    }
  },

  methods: {
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
