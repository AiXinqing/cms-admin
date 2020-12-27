<template>
  <div>
    <Table
      :columns="$options.workHeaders"
      :data="workList"
    >
      <template slot="type" slot-scope="{ row }">
        <div>
          {{ _findType(row.type).label }}
        </div>
      </template>
      <template slot="author" slot-scope="{ row }">
        <div>
          {{ _findUser(row.userId).userName }}
        </div>
      </template>
      <template slot="actions" slot-scope="{ row }">
        <Button
          type="primary"
          size="small"
          class="action-button"
          @click="openApprovalModal(row)"
        >审核</Button>
      </template>
    </Table>
    <Modal
      v-model="approvalModalVisible"
      :title="'审核 - ' + (approvalWork ? approvalWork.title : '')"
      :loading="loading"
      :width="768"
      ok-text="通过"
      cancel-text="拒绝"
      @on-ok="approve"
      @on-cancel="refuse"
    >
      <div class="editor-wrapper" v-if="approvalWork">
        <TipTapEditor
          v-if="approvalWork.type === 0"
          :value="approvalWork.content"
          readonly
          min-height="100px"
        />
        <video width="400px" height="300px" v-else>
          <source :src="approvalWork.videoUrl" type="video/mp4" />
        </video>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import TipTapEditor from '_c/tiptap'

export default {
  components: {
    TipTapEditor
  },

  workHeaders: [
    {
      key: 'id',
      title: '编号',
      width: 80
    }, {
      key: 'title',
      title: '标题'
    }, {
      key: 'type',
      slot: 'type',
      title: '类别'
    }, {
      key: 'userId',
      title: '作者',
      slot: 'author'
    }, {
      title: '操作',
      slot: 'actions'
    }
  ],

  data () {
    return {
      workList: [],
      users: [],
      typeList: this.$config.kankanTypes,
      approvalWork: null,
      approvalModalVisible: false,
      loading: false
    }
  },

  created () {
    this.fetchWorks()
    this.fetchUsers()
  },

  methods: {
    changeLoading () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },

    fetchWorks () {
      return axios.request({
        url: '/admin/work/list',
        method: 'get'
      }).then(({ data }) => {
        this.workList = data.data
      })
    },

    fetchUsers () {
      return axios.request({
        url: '/admin/kankan/user/list',
        method: 'post'
      }).then(({ data }) => {
        this.users = data.data
      })
    },

    openApprovalModal (work) {
      this.approvalWork = work
      this.approvalModalVisible = true
    },

    approve () {
      axios.request({
        url: `/admin/work/${this.approvalWork.id}/approve`,
        method: 'post'
      }).then(() => {
        this.approvalWork.approval = 2
        this.approvalModalVisible = false
      }).catch(() => {
        this.$Message.error({
          content: '通过失败'
        })
      }).finally(() => {
        this.changeLoading()
      })
    },

    refuse () {
      axios.request({
        url: `/admin/work/${this.approvalWork.id}/refuse`,
        method: 'post'
      }).then(() => {
        this.approvalWork.approval = 3
      }).catch(() => {
        this.$Message.error({
          content: '拒绝失败'
        })
      })
    },

    _findType (type) {
      return this.typeList.find(item => item.value === type) || { label: '没有分类' }
    },

    _findUser (userId) {
      return this.users.find(user => user.userId === userId) || { userName: '' }
    }
  }
}
</script>

<style lang="less" scoped>
.editor-wrapper {
  max-height: 70vh;
  overflow: auto;
}

.action-button {
  margin-right: .5rem;
}
</style>
