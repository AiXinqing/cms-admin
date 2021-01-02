<template>
  <div>
    <div class="section" v-if="!apply.id">
      <h3>申请认证流程</h3>
      <ol style="margin-left: 1em;">
        <li class="section-paragraph">
          <span>准备好认证所需资料</span>
          <ol style="margin-left: 1.5em; margin-top: 0.5em;">
            <li style="padding: 0.25em 0;">
              <span>填写后的</span>
              <a href="#" download="认证申请函模版.doc">认证申请公函</a>
              <span>签字扫描件</span>
            </li>
            <li style="padding: 0.25em 0;">
              <span>认证主体证照扫描件</span>
            </li>
            <li style="padding: 0.25em 0;">
              <span>其它品牌授权文件扫描件(非必须)</span>
            </li>
          </ol>
        </li>
        <li class="section-paragraph">
          <span>填写认证信息及上传认证资料</span>
        </li>
        <li class="section-paragraph">
          <span>发起申请，等待审核</span>
        </li>
      </ol>
    </div>
    <div class="section">
      <h3 v-if="apply.id">
        <span>已发起的认证</span>
        <span
          :class="approved ? 'tag-success' : 'tag-default'"
          class="tag"
        >{{ approved ? '已通过' : '等待审核' }}</span>
      </h3>
      <h3 v-else>发起认证申请</h3>
      <Form label-position="top">
        <FormItem label="认证类型">
          <RadioGroup v-model="apply.type">
            <Radio label="personal" disabled>
              <span>个人认证（个人认证只能从App内发起）</span>
            </Radio>
            <Radio
              label="enterprise"
              :disabled="!!apply.id"
            >
              <span>企业认证</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="管理员姓名">
          <Input
            v-model="apply.name"
            placeholder="请输入"
            :disabled="!!apply.id"
          />
        </FormItem>
        <FormItem label="联系电话">
          <Input
            v-model="apply.phone"
            placeholder="请输入"
            :disabled="!!apply.id"
          />
        </FormItem>
        <FormItem label="认证机构所在城市">
          <Input
            v-model="apply.city"
            placeholder="请输入"
            :disabled="!!apply.id"
          />
        </FormItem>
        <FormItem label="认证主体证照扫描件">
          <FileRender :files="userCredentialsFiles" />
          <FileUpload
            v-if="!apply.id"
            accept="image/*"
            multiple
            @file-changed="userCredentialsSelected"
            @upload-end="uploadUserCredentialsEnd"
          />
        </FormItem>
        <FormItem label="认证申请公函签字扫描件">
          <FileRender :files="applyLetterFiles"
          />
          <FileUpload
            v-if="!apply.id"
            accept="image/*"
            multiple
            @file-changed="applyLetterSelected"
            @upload-end="uploadApplyLettersEnd"
          />
        </FormItem>
        <FormItem label="其它品牌授权文件扫描件">
          <FileRender :files="extraFiles" />
          <FileUpload
            v-if="!apply.id"
            accept="image/*"
            multiple
            @file-changed="extrasSelected"
            @upload-end="uploadExtrasEnd"
          />
        </FormItem>
        <FormItem v-if="!apply.id">
          <Button type="primary" @click="doApply" size="small">
            发起申请
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import FileUpload from './source-upload'
import FileRender from './source-render'

export default {
  components: {
    FileUpload,
    FileRender
  },

  data () {
    return {
      userCredentialsFiles: [],
      applyLetterFiles: [],
      extraFiles: [],
      approved: false,
      apply: {
        id: '',
        type: 'enterprise',
        name: '',
        phone: '',
        city: '',
        userCredentials: [],
        letters: [],
        extras: []
      }
    }
  },

  methods: {
    userCredentialsSelected (files) {
      this.userCredentialsFiles = files
    },

    uploadUserCredentialsEnd () {
      this.apply.userCredentials = this.userCredentialsFiles.reduce((acc, file) => {
        if (file.uploadState === 'uploaded') {
          acc.push(file.url)
        }
        return acc
      }, [])
    },

    applyLetterSelected (files) {
      this.applyLetterFiles = files
    },

    extrasSelected (files) {
      this.extraFiles = files
    },

    uploadExtrasEnd () {
      this.apply.extras = this.extraFiles.reduce((acc, file) => {
        if (file.uploadState === 'uploaded') {
          acc.push(file.url)
        }
        return acc
      }, [])
    },

    uploadApplyLettersEnd () {
      this.apply.letters = this.applyLetterFiles.reduce((acc, file) => {
        if (file.uploadState === 'uploaded') {
          acc.push(file.url)
        }
        return acc
      }, [])
    },

    doApply () {
      const data = {
        ...this.apply
      }
      delete data.id
      axios.request({
        url: '/authorize/kankan',
        method: 'post',
        data
      }).then(({ data }) => {
        this.apply.id = data.data.id
        this.$Message.success({
          content: '认证已发起'
        })
      }).catch(() => {
        this.$Message.error({
          content: '认证发起失败'
        })
      })
    }
  }
}
</script>

<style lang="less">
.section {
  padding: 0 1em;

  h3 {
    font-size: 16px;
    margin:  1em 0;
    margin-left: -1em;

    .tag {
      background-color: white;
      font-size: 12px;
      line-height: 12px;
      padding: 1px 2px;
      border-radius: 2px;
      margin-left: 1em;

      border: 1px solid #999999;
      color: #999999;

      &.tag-success {
        border-color: green;
        color: green;
      }

      &.tag-error {
        border-color: hsl(12, 86%, 50%);
        color: hsl(12, 86%, 50%);
      }
    }
  }

  .section-paragraph {
    font-weight: 500;
    font-size: 12px;
    padding: .5em 0;
  }

  .ivu-form .ivu-form-item-label {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
