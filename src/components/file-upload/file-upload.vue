<template>
  <div class="file-upload">
    <input
      ref="fileInput"
      :accept="accept"
      type="file"
      style="display: none;"
      @change="uploadFile"
    >
    <Button
      type="primary"
      size="small"
      @click="openFilePickerDialog"
    >
      选择文件
    </Button>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

export default {
  props: {
    accept: {
      type: String,
      default: '*'
    }
  },

  data () {
    return {
      file: null,
      uploading: false
    }
  },

  methods: {
    openFilePickerDialog () {
      this.$refs.fileInput.click()
    },

    uploadFile (event) {
      this.file = event.target.files.item(0)
      if (this.file) {
        this.uploading = true
        const data = new FormData()
        data.append('file', this.file)
        axios.request({
          url: '/file/upload',
          method: 'post',
          data
        }).then(({ data }) => {
          const [, fileId] = data.data.match(/fileId=(.+)/)
          this.$refs.fileInput.value = ''
          this.$emit('change', `http://47.94.33.237:8081/file/download?fileId=${fileId}`)
        }).finally(() => {
          this.uploading = false
        })
      }
    }
  }
}
</script>
