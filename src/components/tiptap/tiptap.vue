<template>
  <div class="editor">
    <editor-menu-bar
      :editor="editor"
      v-slot="{ commands, isActive }"
    >
      <div class="editor-menu-bar">
        <div
          :class="{ 'menu-item-active': isActive.bold() }"
          class="menu-item"
          @click="commands.bold()"
        >
          <Icon custom="i-icon i-icon-text-bold" />
        </div>
        <div
          :class="{ 'menu-item-active': isActive.heading({ level: 2 }) }"
          class="menu-item"
          @click="commands.heading({ level: 2 })"
        >
          <Icon type="md-reorder" />
        </div>
        <div
          class="menu-item"
          @click="selectFile(commands.image)"
        >
          <Icon custom="i-icon i-icon-image" />
        </div>
      </div>
    </editor-menu-bar>
    <editor-content
      class="editor__content"
      :editor="editor"
      @click.native.stop="focusEditor"
    />
    <file-upload
      ref="fileUpload"
      v-show="false"
      @change="insertImage"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Heading,
  Link,
  Image,
  Bold,
  Placeholder
} from 'tiptap-extensions'
import FileUpload from '_c/file-upload'

export default {
  name: 'TiptapEditor',

  components: {
    EditorContent,
    EditorMenuBar,
    FileUpload
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
      command: null,
      editor: new Editor({
        extensions: [
          new Heading({ level: [2] }),
          new Link(),
          new Bold(),
          new Image(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: this.placeholder,
            showOnlyWhenEditable: false,
            showOnlyCurrent: false
          })
        ],
        content: initValue,
        onUpdate: ({ getJSON }) => {
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

    focusEditor () {
      this.editor.focus()
    },

    selectFile (command) {
      this.command = command
      this.$refs.fileUpload.openFilePickerDialog()
    },

    insertImage (src) {
      if (this.command) {
        this.command({ src })
        this.command = null
      }
    },

    encodeValue () {},

    decodeValue () {}
  }
}
</script>

<style lang="less">
.ProseMirror {
  padding: 5px 10px;
  outline: none;

  &:focus {
    outline: none;
  }

  img {
    max-width: 100%;
  }
}

.editor {
  .editor-menu-bar {
    display: flex;
    flex-direction: row;
    border: 1px solid #dddddd;
    width: 100%;
    padding: 5px;
  }

  .menu-item {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    margin-left: 5px;
    border-radius: 2px;

    &:first-child {
      margin-left: 0;
    }

    &:hover {
      background-color: transparent;
      border: 1px solid #dddddd;
    }

    &.menu-item-active {
      border: 1px solid #dddddd;
      background-color: white;

      &:hover {
        background-color: white;
      }
    }
  }

  .editor__content {
    border: 1px solid #dddddd;
    margin-top: -1px;
    min-height: 240px;
    background-color: white;
    font-size: 16px;
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
