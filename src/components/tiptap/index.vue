<template>
  <div class="editor">
    <div class="editor-menu-bar">
      <editor-menu-bar
        :editor="editor"
        v-slot="{ commands, isActive }"
      >
        <div
          :class="{ 'menu-item-active': isActive.heading({ level: 2 }) }"
          class="menu-item"
          @click="commands.heading({ level: 2 })"
        >
          <Icon type="md-reorder" />
        </div>
      </editor-menu-bar>
    </div>
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Heading,
  Link,
  History
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar
  },

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      editor: new Editor({
        extensions: [
          new Heading({ level: [2] }),
          new Link(),
          new History()
        ],
        content: this.value,
        onUpdate: ({ getJSON, getHTML }) => {
          this.json = getJSON()
          console.log(this.json)
          this.html = getHTML()
        }
      }),
      json: '',
      html: ''
    }
  },

  methods: {
    clearContent () {
      this.editor.clearContent(true)
      this.editor.focus()
    },

    setContent (value) {
      this.editor.setContent(value, true)
      this.editor.focus()
    },

    encodeValue () {},

    decodeValue () {}
  }
}
</script>

<style lang="less">
.ProseMirror {
  padding: 0px 10px;
  outline: none;

  &:focus {
    outline: none;
  }
}

.editor {
  .editor-menu-bar {
    display: flex;
    flex-direction: row;
    border: 1px solid #dddddd;
    width: 100%;
  }

  .menu-item {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .editor__content {
    border: 1px solid #dddddd;
    margin-top: -1px;
  }
}
</style>
