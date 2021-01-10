<template>
  <div>
    <div class="tab-btn-wrapper">
      <button
        class="ivu-btn ivu-btn-primary"
        @click="createTabModalVisible = true"
      >
        添加角色
      </button>
      <Modal
        v-model="createTabModalVisible"
        :title="'添加角色'"
        @on-ok="addTab"
      >
        <Form
          :model="editTab"
          :label-width="60"
        >
          <!-- <FormItem label="权限名称">
            <Input v-model="editTab.privilegeDesc" placeholder="请输入" />
          </FormItem>
          <FormItem label="权限类型">
            <Select v-model="editTab.privilegeId">
              <Option
                v-for="tabList in privilegeList"
                :key="tabList.value"
                :value="tabList.value"
              >{{ tabList.label }}</Option>
            </Select>
          </FormItem> -->
        </Form>
      </Modal>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      createTabModalVisible: false,
      editTab: {
        privilegeId: '',
        roleId: '',
        roleName: ''
      }
    }
  },

  created () {
    ;
  },

  methods: {
    addTab () {

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
