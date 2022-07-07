<template>
  <div
    class="kf-demo-block"
    :class="[{ hover: hovering }]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="source">
      <slot name="demo"></slot>
    </div>
    <div ref="meta" class="meta">
      <div v-if="$slots.description" class="description">
        <slot name="description"></slot>
      </div>
      <div id="highlight" class="highlight">
        <slot name="source"></slot>
      </div>
    </div>
    <div ref="control" :class="['kf-demo-block-control', { 'is-fixed': isExpanded }]" @click="isExpanded = !isExpanded">
      <transition name="text-slide">
        <i v-show="hovering">{{ iconClass }}</i>
      </transition>
      <transition name="text-slide">
        <span v-show="hovering" class="btn">{{ controlText }}</span>
      </transition>
      <div class="control-button-container">
        <span
          v-show="hovering || isExpanded"
          size="small"
          type="text"
          class="control-button copy-button btn"
          @click.stop="handleCopy"
        >
          {{ copyMessage }}
        </span>
        <transition name="text-slide">
          <span
            v-show="hovering || isExpanded"
            class="control-button run-online-button btn"
            @click.stop="handleCodeView"
          >
            在线运行
          </span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import CodeEdit from './CodeEdit.vue';
import Vue from 'vue';

/* eslint-disable */
/**
 * 复制到剪切板
 * @param code 复制内容
 */
function copyToClipboard(code) {
  const selection = document.getSelection();
  /** current selection */
  const selectedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
  const textAreaElement = document.createElement('textarea');
  textAreaElement.value = code;
  textAreaElement.setAttribute('readonly', '');
  textAreaElement.style.position = 'absolute';
  textAreaElement.style.top = '-9999px';
  document.body.appendChild(textAreaElement);
  textAreaElement.select();
  document.execCommand('copy');
  document.body.removeChild(textAreaElement);
  // recover the previous selection
  if (selectedRange && selection) {
    selection.removeAllRanges();
    selection.addRange(selectedRange);
  }
}
export default {
  name: 'CustomDemoBlock',
  props: {
    componentNameList: [Array, String],
  },
  data() {
    return {
      codeSource: '',
      hovering: false,
      isExpanded: false,
      copyMessage: '复制代码',
    };
  },

  computed: {
    iconClass() {
      return this.isExpanded ? '▲' : '▼';
    },

    controlText() {
      return this.isExpanded ? '隐藏代码' : '显示代码';
    },

    codeArea() {
      return this.$el.getElementsByClassName('meta')[0];
    },

    codeAreaHeight() {
      if (this.$el.getElementsByClassName('description').length > 0) {
        return (
          this.$el.getElementsByClassName('description')[0].clientHeight +
          this.$el.getElementsByClassName('highlight')[0].clientHeight +
          20
        );
      }
      return this.$el.getElementsByClassName('highlight')[0].clientHeight;
    },
  },

  watch: {
    isExpanded(val) {
      this.codeArea.style.height = val ? `${this.codeAreaHeight + 1}px` : '0';
    },
  },
  beforeCreate() {
    let isEdit = new URL(location).searchParams.get('edit');
    if (isEdit && !window.isInitCodeEdit) {
      window.isInitCodeEdit = true; // 加个锁
      const instance = Vue.extend(CodeEdit);
      new instance().$mount('#app'); // 覆盖原页面内容
    }
  },
  mounted() {
    // 获取代码块内容
    const highlight = this.$el.querySelector('#highlight pre[class*=language-]');
    if (highlight) {
      this.codeSource = highlight.innerText;
    }
  },

  methods: {
    handleCopy() {
      copyToClipboard(this.codeSource);
      this.copyMessage = '复制成功🎉';
      setTimeout(() => {
        this.copyMessage = '复制代码';
      }, 2000);
    },
    handleCodeView() {
      const codeSource = this.codeSource;
      sessionStorage.setItem('kf-vue-press-plugin-v1', JSON.stringify(codeSource));
      sessionStorage.setItem('kf-vue-press-temp-component', JSON.stringify(this.componentNameList || []));
      window.open(location.origin + location.pathname + '?edit=1');
    },
  },
};
</script>

<style lang="stylus">
.kf-demo-block {
  position: relative;
  border: solid 1px #ebebeb;
  border-radius: 3px;
  transition: 0.3s;

  .btn {
    color: #1f93ff;
    cursor: pointer;
    margin-left: 16px;
  }

  &.hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
  }

  code {
    font-family: Menlo, Monaco, Consolas, Courier, monospace;
  }

  .demo-button {
    float: right;
  }

  .source {
    padding: 24px;
  }

  .meta {
    border-top: solid 1px #eaeefb;
    overflow: hidden;
    height: 0;
    transition: height 0.3s;
  }

  .description {
    padding: 20px;
    box-sizing: border-box;
    border: solid 1px #ebebeb;
    border-radius: 3px;
    font-size: 14px;
    line-height: 22px;
    color: #666;
    word-break: break-word;
    margin: 10px;

    p {
      margin: 0;
      line-height: 26px;
    }
  }

  .highlight {
    div[class*='language-'] {
      border-radius: 0;
    }
  }

  #highlight {
    & > .language-vue > .language-vue {
      padding-top: 0;
      margin-top: 0;
    }
  }

  .kf-demo-block-control {
    position: relative;
    z-index: 9;
    border-top: solid 1px #eaeefb;
    height: 44px;
    box-sizing: border-box;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    margin-top: -1px;
    color: #d3dce6;
    cursor: pointer;
    &.is-fixed {
      position: sticky;
      top: 0;
      bottom: 0;
    }
    > i {
      position: absolute;
      transform: translateX(-30px);
      font-size: 14px;
      line-height: 44px;
      transition: 0.3s;
      display: inline-block;
      color: #1f93ff;
    }

    > span {
      position: absolute;
      transform: translateX(-30px);
      font-size: 14px;
      line-height: 44px;
      transition: 0.3s;
      display: inline-block;
    }

    &:hover {
      background-color: #f9fafc;
    }

    & .text-slide-enter,
    & .text-slide-leave-active {
      opacity: 0;
      transform: translateX(10px);
    }

    .control-button-container {
      line-height: 40px;
      position: absolute;
      top: 0;
      right: 0;
      padding-left: 5px;
      padding-right: 25px;
    }

    .control-button {
      font-size: 14px;
      margin: 0 10px;
    }
  }
}
</style>
