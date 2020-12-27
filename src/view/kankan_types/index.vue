<template>
  <div>
    <div class="tab-btn-wrapper">
      <button
        class="ivu-btn ivu-btn-primary"
        @click="createKankanTypeModalVisible = true"
      >
        添加分类
      </button>
      <Modal
        v-model="createKankanTypeModalVisible"
        :title="addText + '分类'"
        :ok-text="addText"
        @on-ok="addTab"
      >
        <Form
          :model="editKankanType"
          :label-width="60"
        >
          <FormItem label="分类名称">
            <Input v-model="editKankanType.typeDesc" placeholder="请输入" />
          </FormItem>
        </Form>
      </Modal>
    </div>
    <Table
      :columns="headers"
      :data="kankanTypes"
    >
      <template slot="action" slot-scope="{ row }">
        <Button
          type="primary"
          size="small"
          style="margin-right: 10px;"
          class="action-button"
          @click="openEditKankanType(row)"
        >
          修改
        </Button>
      </template>
    </Table>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

export default {
  data () {
    return {
      createKankanTypeModalVisible: false,
      headers: [
        {
          key: 'typeDesc',
          title: '分类名称'
        },
        {
          slot: 'action',
          align: 'center',
          title: '操作'
        }
      ],
      kankanTypes: [],
      editKankanType: {
        typeDesc: '',
        id: ''
      },
      tabTypes: this.$config.tabTypes
    }
  },

  created () {
    this.fetchKankanTypes()
  },

  computed: {
    addText () {
      return this.editKankanType.tabId
        ? '修改'
        : '添加'
    },

    headlineText () {
      return this.editHeadline.id
        ? '修改'
        : '添加'
    }
  },

  methods: {
    fetchKankanTypes () {
      return axios.request({
        url: '/admin/kankan/listType',
        method: 'post'
      }).then(({ data }) => {
        this.kankanTypes = data.data
      })
    },

    openEditKankanType (type) {
      this.editKankanType = {
        ...type
      }
      this.createKankanTypeModalVisible = true
    },

    addTab () {
      if (this.editKankanType.id) {
        axios.request({
          url: '/admin/kankan/updateType',
          method: 'post',
          data: {
            typeDesc: this.editKankanType.typeDesc,
            typeOrder: this.editKankanType.typeOrder,
            id: this.editKankanType.id
          }
        }).then(({ data }) => {
          const oldKankanTypeIndex = this.kankanTypes.findIndex(item => item.id === this.editKankanType.id)
          this.kankanTypes.splice(oldKankanTypeIndex, 1, this.editKankanType)
          this.resetEditKankanType()
        })
      } else {
        axios.request({
          url: '/admin/kankan/addType',
          data: {
            typeDesc: this.editKankanType.typeDesc,
            typeOrder: this.kankanTypes.length
          },
          method: 'post'
        }).then(({ data }) => {
          this.kankanTypes.push({
            typeDesc: this.editKankanType.typeDesc,
            typeOrder: this.kankanTypes.length,
            id: data.data.id
          })
          this.resetEditKankanType()
        })
      }
    },

    resetEditKankanType () {
      this.editKankanType = {
        typeDesc: '',
        typeOrder: 1,
        id: ''
      }
    },

    createOrUpdateHeadline () {
      axios.request({
        url: '/admin/headerLine/headerLineInfo',
        method: 'post',
        data: {
          ...this.editHeadline
        }
      }).then(({ data }) => {
        const headLine = this._findHeadline({
          id: this.editHeadline.tabId
        })
        if (headLine) {
          headLine.title = this.editHeadline.title
          headLine.id = data.data.id
        } else {
          this.headlines.push({
            ...this.editHeadline,
            id: data.data.id
          })
        }
        this.$Message.success({
          content: `${this.headlineText}成功`
        })
      }).catch(() => {
        this.$Message.error({
          content: `${this.headlineText}失败`
        })
      }).finally(() => {
        this.resetHeadline()
        this.headlineModalVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tab-btn-wrapper {
  margin-bottom: 20px;
  text-align: right;
}

.action-button {
  margin-right: .5rem;
}
</style>
