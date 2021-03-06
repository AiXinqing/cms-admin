<template>
  <div class="editor">
    <editor-menu-bar
      :editor="editor"
      v-if="!readonly"
      v-slot="{ commands, isActive }"
    >
      <div class="editor-menu-bar">
        <div
          :class="{ 'menu-item-active': isActive.bold() }"
          class="menu-item"
          @click="commands.bold()"
          title="加粗"
        >
          <Icon custom="i-icon i-icon-text-bold" />
        </div>
        <div
          :class="{ 'menu-item-active': isActive.strike() }"
          class="menu-item"
          @click="commands.strike()"
          title="删除线"
        >
          <Icon custom="i-icon i-icon-text-strikethrough" />
        </div>
        <div
          :class="{ 'menu-item-active': isActive.italic() }"
          class="menu-item"
          @click="commands.italic()"
          title="倾斜"
        >
          <Icon custom="i-icon i-icon-text-italic" />
        </div>
        <div
          :class="{ 'menu-item-active': isActive.underline() }"
          class="menu-item"
          @click="commands.underline()"
          title="下划线"
        >
          <Icon custom="i-icon i-icon-text-underline" />
        </div>
        <div
          :class="{ 'menu-item-active': isActive.heading({ level: 2 }) }"
          class="menu-item"
          @click="commands.heading({ level: 2 })"
          title="小标题"
        >
          <Icon custom="i-icon i-icon-heading" />
        </div>
        <div
          class="menu-item"
          @click="selectFile(commands.image)"
          title="图片"
        >
          <Icon custom="i-icon i-icon-image" />
        </div>
        <div
          :class="{ 'is-active': isActive.ordered_list() }"
          class="menu-item"
          @click="commands.ordered_list"
          title="有序列表"
        >
          <Icon custom="i-icon i-icon-list-ol" />
        </div>
        <div
          :class="{ 'is-active': isActive.bullet_list() }"
          class="menu-item"
          @click="commands.bullet_list"
          title="无序列表"
        >
          <Icon custom="i-icon i-icon-list-ul" />
        </div>
        <div
          class="menu-item"
          title="新增表格"
          @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: true })"
        >
          <Icon custom="i-icon i-icon-table" />
        </div>
        <div v-if="isActive.table()" style="display: inline-flex;">
          <div
            class="menu-item"
            @click="commands.deleteTable"
            title="删除表格"
          >
            <Icon custom="i-icon i-icon-table-delete" />
          </div>
          <div
            class="menu-item"
            @click="commands.addColumnBefore"
            title="之前插入一列"
          >
            <Icon custom="i-icon i-icon-insert-col-left" />
          </div>
          <div
            class="menu-item"
            @click="commands.addColumnAfter"
            title="之后插入一列"
          >
            <Icon custom="i-icon i-icon-insert-col-right" />
          </div>
          <div
            class="menu-item"
            @click="commands.deleteColumn"
            title="删除当前列"
          >
            <Icon custom="i-icon i-icon-delete-col" />
          </div>
          <div
            class="menu-item"
            @click="commands.addRowBefore"
            title="之前插入一行"
          >
            <Icon custom="i-icon i-icon-insert-row-above" />
          </div>
          <div
            class="menu-item"
            @click="commands.addRowAfter"
            title="之后插入一行"
          >
            <Icon custom="i-icon i-icon-insert-row-below" />
          </div>
          <div
            class="menu-item"
            @click="commands.deleteRow"
            title="删除当前行"
          >
            <Icon custom="i-icon i-icon-delete-row" />
          </div>
          <div
            class="menu-item"
            @click="commands.toggleCellMerge"
            title="合并单元格"
          >
            <Icon custom="i-icon i-icon-merge-cells" />
          </div>
        </div>
      </div>
    </editor-menu-bar>
    <editor-content
      :class="{ readonly: readonly }"
      :editor="editor"
      :style="{ minHeight: minHeight }"
      class="editor__content"
      @click.native.stop="focusEditor"
    />
    <file-upload
      v-if="!readonly"
      ref="fileUpload"
      accept="images/*"
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
  Strike,
  Italic,
  Underline,
  Placeholder,
  ListItem,
  OrderedList,
  BulletList,
  Table,
  TableHeader,
  TableCell,
  TableRow
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
    },

    readonly: {
      type: Boolean,
      default: false
    },

    minHeight: {
      type: String,
      default: '240px'
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

    const extensions = [
      new Heading({ level: [2] }),
      new Link(),
      new Bold(),
      new Strike(),
      new Italic(),
      new Image(),
      new Underline(),
      new ListItem(),
      new OrderedList(),
      new BulletList(),
      new Table({
        resizable: true
      }),
      new TableHeader(),
      new TableCell(),
      new TableRow()
    ]
    if (!this.readonly) {
      extensions.push(
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: this.placeholder,
          showOnlyWhenEditable: false,
          showOnlyCurrent: false
        })
      )
    }
    return {
      command: null,
      editor: new Editor({
        editable: !this.readonly,
        extensions,
        content: initValue,
        onBlur: ({ state }) => {
          this.$emit('input', JSON.stringify(state.doc.toJSON()))
        }
      })
    }
  },

  watch: {
    value (newValue) {
      var initValue = {}
      try {
        initValue = JSON.parse(this.value)
      } catch (error) {
        console.log(error)
        initValue = {}
      }
      this.setContent(initValue)
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

  &.resize-cursor {
    cursor: col-resize;
  }

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

  ol, ul {
    padding: revert;
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

    &.readonly {
      border-color: transparent;
    }

    table{
      border-collapse: collapse;
      width: 100%;

      td,th{
        min-width: 1em;
        border: 2px solid #ddd;
        padding: 3px 5px;
        vertical-align: top;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        position: relative;
      }
    }
  }

  p.is-editor-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }

  .tableWrapper{
    margin: 1em 0;
    overflow-x: auto;
  }
}
</style>
