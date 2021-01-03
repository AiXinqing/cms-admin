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
      <template slot="approval" slot-scope="{ row }">
        <div>
          {{ _getApprovalText(row.approval) }}
        </div>
      </template>
      <template slot="publishAt" slot-scope="{ row }">
        <div>
          {{ new Date(row.publishTime).toLocaleDateString() }}
        </div>
      </template>
      <template slot="author" slot-scope="{ row }">
        <div>
          {{ _findUser(row.userId).userName }}
        </div>
      </template>
      <template slot="actions" slot-scope="{ row }">
        <Button
          v-if="_shouldApproval(row)"
          type="primary"
          size="small"
          class="action-button"
          @click="openApprovalModal(row)"
        >审核</Button>
        <Button
          type="info"
          size="small"
          class="action-button"
          @click="openPreviewModal(row)"
        >详情</Button>
      </template>
    </Table>

    <Modal
      v-model="previewModalVisible"
      :title="previewWork ? previewWork.title : ''"
      :width="768"
      footer-hide
    >
      <div class="editor-wrapper" v-if="previewWork">
        <TipTapEditor
          v-if="previewWork.type === 0"
          :value="previewWork.content"
          readonly
          min-height="100px"
        />
        <video v-else width="100%" height="480px">
          <source :src="previewWork.videoUrl" type="video/mp4" />
          <span>视频没找到</span>
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
      slot: 'approval',
      title: '审核状态',
      key: 'approval'
    }, {
      title: '发布时间',
      key: 'publishTime',
      slot: 'publishAt'
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
      previewWork: null,
      previewModalVisible: false,
      loading: false
    }
  },

  created () {
    this.fetchWorks()
    this.fetchUsers()
  },

  methods: {
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

    openPreviewModal (work) {
      this.previewWork = work
      this.previewModalVisible = true
    },

    openApprovalModal (work) {
      this.approvalWork = work
      this.$Modal.confirm({
        title: `确认通过审核`,
        okText: `通过`,
        cancelText: `取消`,
        onOk: () => {
          this.approve()
        }
      })
    },

    approve () {
      axios.request({
        url: `/admin/work/${this.approvalWork.id}/approve`,
        method: 'post'
      }).then(() => {
        this.approvalWork.approval = 2
      }).catch(() => {
        this.$Message.error({
          content: '通过失败'
        })
      }).finally(() => {
        this.$Modal.remove()
      })
    },

    _findType (type) {
      return this.typeList.find(item => item.value === type) || { label: '没有分类' }
    },

    _findUser (userId) {
      return this.users.find(user => user.userId === userId) || { userName: '' }
    },

    _shouldApproval (row) {
      return ![2, 3].includes(row.approval)
    },

    _getApprovalText (state) {
      switch (state) {
        case 3:
          return '未通过'
        case 2:
          return '已通过'
        default:
          return '待审核'
      }
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
