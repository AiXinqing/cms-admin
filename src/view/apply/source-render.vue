<template>
  <div class="files-container">
    <div
      v-for="(file, index) in files"
      :key="index"
      class="file-item"
    >
      <img :src="imageSrc(file)" />
      <div
        v-if="canReload(file)"
        class="reload-button"
      >
        <Button @click="reload(file)" type="error" size="small">重试</Button>
      </div>
    </div>
    <div v-if="!files.length">
      没有选择该类文件
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: {
      type: Array,
      required: true
    }
  },

  methods: {
    reload (file) {
      file.upload()
    },

    canReload (file) {
      return typeof file === 'string'
        ? false
        : file.uploadState === 'failed'
    },

    imageSrc (file) {
      return typeof file === 'string'
        ? file
        : file.fileData
    }
  }
}
</script>

<style lang="less">
.file-item {
  max-width: 240px;
  max-height: 240px;
  position: relative;

  .reload-button {
    background-color: rgba(100, 100, 100, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 100%;
    max-width: 100%;
    display: block;
  }
}

.files-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
