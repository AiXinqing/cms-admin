<template>
  <div>
    <div class="section">
      <h3>申请认证流程</h3>
      <div class="section-paragraph">
        <span>
          1. 准备好认证所需资料
        </span>
      </div>
      <div class="section-paragraph">
        <span>
          2. 填写认证信息及上传认证资料
        </span>
      </div>
      <div class="section-paragraph">
        <span>
          3. 发起申请，等待审核
        </span>
      </div>
    </div>
    <div class="section">
      <h3>申请认证所需资料</h3>
      <div class="section-paragraph">
        <span>
          1. 填写后的
        </span>
        <a href="#" download="认证申请函模版.doc">认证申请函</a>
      </div>
      <div class="section-paragraph">
        <span>
          2. 认证所需的
        </span>
        <a href="#" download="认证申请函模版.doc">认证申请函</a>
      </div>
    </div>
    <div class="section">
      <h3>已认证信息</h3>
      <Form :label-width="80">
        <FormItem label="认证类型">
          <span>个人认证</span>
        </FormItem>
      </Form>
    </div>
    <div class="section">
      <h3>发起认证/已发起的认证</h3>
      <Form label-position="top">
        <FormItem label="认证类型">
          <RadioGroup v-model="apply.type">
            <Radio label="personal" disabled>
              <span>个人认证（个人认证只能从App内发起）</span>
            </Radio>
            <Radio label="enterprise">
              <span>企业认证</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="管理员姓名">
          <Input
            v-model="apply.name"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem label="联系电话">
          <Input
            v-model="apply.phone"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem label="认证机构所在城市">
          <Input
            v-model="apply.city"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem label="认证主体证照扫描件">
          <div class="files-container">
            <FileRender
              v-for="file in userCredentialsFiles"
              :key="file.file.name"
              :file="file"
            />
          </div>
          <FileUpload
            accept="image/*"
            multiple
            @file-changed="userCredentialsSelected"
            @upload-end="uploadUserCredentialsEnd"
          />
        </FormItem>
        <FormItem label="认证申请公函签字扫描件">
          <Input
            v-model="apply.phone"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem label="其它品牌授权文件扫描件">
          <Input
            v-model="apply.phone"
            placeholder="请输入"
          />
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
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
      apply: {
        type: 'enterprise',
        name: '',
        phone: '',
        city: '',
        userCredentials: []
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
    }
  }
}
</script>

<style lang="less">
.section {
  padding: 0 1em;

  h3 {
    margin:  1em 0;
    margin-left: -1em;
  }

  .section-paragraph {
    font-weight: 500;
    padding: .5em 0;
  }
}

.files-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
