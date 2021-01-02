<template>
  <div class="file-upload">
    <input
      ref="fileInput"
      :accept="accept"
      :multiple="multiple"
      style="display: none;"
      type="file"
      @change="selectFiles"
    >
    <slot :open-file-picker-dialog="openFilePickerDialog">
      <Button
        type="default"
        size="small"
        @click="openFilePickerDialog"
      >
        选择文件
      </Button>
    </slot>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

class CustomFile {
  constructor (file) {
    this.file = file

    this.progress = 0
    this.uploadState = 'preupload'
    this.uploadRequest = null

    if (/image/gi.test(file.type)) {
      this.fileData = ''
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        this.fileData = event.target.result
      }
      fileReader.readAsDataURL(file)
    }
  }

  upload () {
    if (this.uploadRequest) return this.uploadRequest
    this.uploadState = 'uploading'

    const fileData = new FormData()
    fileData.append('file', this.file)

    this.uploadRequest = axios.request({
      url: '/file/upload',
      method: 'post',
      data: fileData,
      onUploadProgress: (t) => {
        this.progress = t.loaded / t.total
      }
    }).then(({ data }) => {
      this.uploadState = 'uploaded'
      this.url = data.data
      this.progress = 1
    }).catch(() => {
      this.uploadState = 'failed'
      this.progress = 0
    }).finally(() => {
      this.uploadRequest = null
    })

    return this.uploadRequest
  }
}

export default {
  props: {
    accept: {
      type: String,
      default: '*'
    },

    multiple: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      files: [],
      uploadedCount: 0
    }
  },

  methods: {
    openFilePickerDialog () {
      this.$refs.fileInput.click()
    },

    selectFiles (event) {
      this.files = [].map.call(event.target.files, file => new CustomFile(file))
      event.target.value = ''
      this.$emit('file-changed', this.files)

      this.upload()
    },

    upload () {
      this.files.forEach(file => {
        file.upload().finally(() => {
          this.uploadedCount += 1
          if (this.uploadedCount >= this.files.length) {
            this.uploadedCount = 0
            this.$emit('upload-end')
          }
        })
      })
    }
  }
}
</script>
