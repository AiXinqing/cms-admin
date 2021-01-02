<template>
  <div class="file-item">
    <img
      v-if="isImage"
      :src="file.fileData"
    />
    <span v-else>{{ file.file.name }}</span>
    <div
      v-if="file.uploadState === 'failed'"
      class="reload-button"
    >
      <Button @click="reload" type="error" size="small">重试</Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },

  computed: {
    isImage () {
      return /image/ig.test(this.file.file.type)
    }
  },

  methods: {
    reload () {
      this.file.upload()
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
</style>
