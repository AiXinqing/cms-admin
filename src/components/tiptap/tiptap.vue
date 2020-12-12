<template>
  <div class="editor">
    <editor-menu-bar
      :editor="editor"
      v-slot="{ commands, isActive }"
    >
      <div class="editor-menu-bar">
        <div
          :class="{ 'menu-item-active': isActive.heading({ level: 2 }) }"
          class="menu-item"
          @click="commands.heading({ level: 2 })"
        >
          <Icon type="md-reorder" />
        </div>
        <div
          :class="{ 'menu-item-active': isActive.heading({ level: 2 }) }"
          class="menu-item"
          @click="commands.heading({ level: 2 })"
        >
          <Icon type="md-reorder" />
        </div>
      </div>
    </editor-menu-bar>
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Heading,
  Link,
  Placeholder
} from 'tiptap-extensions'

export default {
  name: 'TiptapEditor',

  components: {
    EditorContent,
    EditorMenuBar
  },

  props: {
    value: {
      type: String,
      default: '{}'
    },

    placeholder: {
      type: String,
      default: '请输入'
    }
  },

  data () {
    var initValue = {}
    try {
      initValue = JSON.parse(this.value)
    } catch (error) {
      console.log(error)
      initValue = {}
    }
    return {
      editor: new Editor({
        extensions: [
          new Heading({ level: [2] }),
          new Link(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: this.placeholder,
            showOnlyWhenEditable: false,
            showOnlyCurrent: false
          })
        ],
        content: initValue,
        onUpdate: ({ getJSON, getHTML }) => {
          this.$emit('input', JSON.stringify(getJSON()))
        }
      })
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

    beforeDestroy () {
      this.editor.destroy()
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

  p.is-editor-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }
}
</style>
