<template>
  <div class="kf-preview-block">
    <div class="operate-container">
      <span class="btn" @click="handleRun">
        运行(ctrl + s)
      </span>
      <span class="btn" @click="handleReset">
        重置
      </span>
    </div>
    <div class="preview-panel">
      <div class="preview-source" @keydown.ctrl.s="onCtrlSClick">
        <codemirror v-model="codeSource" :options="cmOptions" />
      </div>
      <div class="preview-code">
        <div id="kfpreviewApp"></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css'; // 核心样式
import 'codemirror/theme/monokai.css'; //编辑器主题样式，配置里面theme需要设置monokai
import 'codemirror/mode/javascript/javascript'; // 这js模式必须引入的
import 'codemirror/mode/css/css';
import 'codemirror/addon/selection/active-line'; //光标行背景高亮，配置里面也需要styleActiveLine设置为true
import 'codemirror/keymap/sublime'; //sublime编辑器效果
import 'codemirror/mode/vue/vue.js'; // 代码风格

function stripScript(content) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

function stripStyle(content) {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

function stripTemplate(content) {
  const result = content.match(/<(template)\s*>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

// 将 css 代码块包裹
function scopedCss(cssContent, wrapper) {
  const reg = /([\s\S]*?)\{([\s\S]*?)\}/gu;
  let scopedHtml = '';
  let result;
  while ((result = reg.exec(cssContent))) {
    const [, selectors, definition] = result;
    scopedHtml += `${selectors
      .replace(/\n/g, '')
      .split(',')
      .map(selector => `.${wrapper} ${selector}`)
      .join(',')}{${definition}}`;
  }
  return scopedHtml;
}

export default {
  name: 'CodePreview',
  components: {
    codemirror
  },
  data() {
    return {
      codeSource: '',
      source: '',
      cmOptions: {
        tabSize: 2,
        theme: 'monokai',
        mode: 'text/x-vue',
        // indentWithTabs: true,
        // smartIndent: true,
        styleActiveLine: true,
        lineNumbers: true,
        // matchBrackets: true, //括号匹配
        autoCloseBrackets: true
      }
    };
  },
  watch: {
    source(nv = '') {
      const html = stripTemplate(nv);
      const script = stripScript(nv);
      const style = stripStyle(nv);
      this.renderCode({ script, html });
      this.insertCss({ style });
    }
  },
  mounted() {
    const source = JSON.parse(sessionStorage.getItem('kf-vue-press-plugin-v1'))
    this.source = source;
    this.codeSource = source;
  },
  methods: {
    onCtrlSClick(event) {
      event.preventDefault();
      this.handleRun();
    },
    renderCode({ script, html }) {
      const js = script.replace(/export default/, 'return ');
      const renderComponent = new Function(js)();
      renderComponent.template = `<div id="kfpreviewApp">${html}</div>`;
      const instance = Vue.extend(renderComponent);
      new instance().$mount('#kfpreviewApp');
    },
    insertCss({ style }) {
      let css = document.querySelector('#preview-style');
      if (!css) {
        css = document.createElement('style');
        css.setAttribute('id', 'preview-style');
        css.setAttribute('type', 'text/css');
      }
      css.innerHTML = scopedCss(style, 'preview-code');
      document.head.appendChild(css);
    },
    handleRun() {
      this.source = this.codeSource;
    },
    handleReset() {
      let res = window.confirm('您当前的代码尚未保存，确认要重置吗？');
      if (res) {
        const code = JSON.parse(sessionStorage.getItem('kf-vue-press-plugin-v1'))
        this.source = code;
        this.codeSource = code;
      }
    }
  }
};
</script>

<style>
.kf-preview-block .btn {
  color: #1f93ff;
  cursor: pointer;
  margin-left: 16px;
}
.kf-preview-block {
  background: #fff;
  display: flex;
  flex-direction: column;
  border: solid 1px #ebebeb;
  border-radius: 3px;
  transition: 0.3s;
  height: 100vh;
  overflow: hidden;
}
.kf-preview-block .operate-container {
  text-align: right;
  padding-right: 40px;
  border-bottom: solid 1px #ebebeb;
}
.kf-preview-block .preview-header {
  display: flex;
  align-items: center;
  height: 60px;
}
.kf-preview-block .preview-panel {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.kf-preview-block .preview-source {
  display: block;
  width: 50%;
  background-color: #f3f4f5;
  overflow: auto;
}
.kf-preview-block .preview-code {
  display: block;
  width: 50%;
  padding: 24px;
  overflow: auto;
}
.kf-preview-block .CodeMirror.cm-s-monokai {
  height: 100%;
}
</style>
