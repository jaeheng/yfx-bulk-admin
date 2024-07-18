<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 200px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script>
import '@wangeditor-next/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'

export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: { Editor, Toolbar },
  methods: {
    handleChange(editor) {
      if (editor.getText().length > 0) {
        this.$emit('update:modelValue', editor.getHtml())
      } else {
        this.$emit('update:modelValue', '')
      }
    }
  },
  setup(props) {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref('')

    onMounted(() => {
      valueHtml.value = props.modelValue
    })

    const toolbarConfig = {
      toolbarKeys: [
        'redo',
        'undo',
        'bold',
        'underline',
        'italic',
        'through',
        'code',
        'sub',
        'sup',
        'clearStyle',
        'color',
        'bgColor',
        'fontSize',
        'fontFamily',
        'indent',
        'delIndent',
        'justifyLeft',
        'justifyRight',
        'justifyCenter',
        'justifyJustify',
        'lineHeight',
        'insertImage',
        'divider',
        'emotion',
        'insertLink',
        'codeBlock',
        'blockquote',
        'headerSelect',
        'todo',
        'fullScreen',
        'bulletedList',
        'numberedList',
        'insertTable',
        'insertVideo'
      ]
    }
    const editorConfig = { placeholder: '请输入内容...' }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    const setDefault = (content) => {
      console.log(content)
      console.log(editorRef)
      const editor = editorRef.value
      if (editor == null) return
      editor.setHtml(content)
    }

    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      setDefault
    }
  }
}
</script>
