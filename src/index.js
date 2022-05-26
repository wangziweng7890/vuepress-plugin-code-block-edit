/**
 * 提供 ::: demo xxx ::: 语法，用于构建 markdown 中的示例
 */
const path = require('path');
const renderDemoBlock = require('./common/render');
const demoBlockContainers = require('./common/containers');
import DemoBlock from "./DemoBlock.vue";
import CodeEdit from "./CodeEdit.vue";
module.exports = (options = {}, ctx) => {
  return {
    enhanceAppFiles() {
      return {
        name: "dynamic-code",
        content: `export default ({ Vue }) => { 
          Vue.component('DemoBlock', '${DemoBlock}');
          Vue.component('CodeEdit', '${CodeEdit}');
        }`,
      };
    },
    chainMarkdown(config) {
      config
        .plugin('containers')
        .use(demoBlockContainers(options))
        .end();
    },
    extendMarkdown: md => {
      const id = setInterval(() => {
        const render = md.render;
        if (typeof render.call(md, '') === 'object') {
          md.render = (...args) => {
            const result = render.call(md, ...args);
            const { template, script, style } = renderDemoBlock(result.html);
            result.html = template;
            result.dataBlockString = `${script}\n${style}\n${result.dataBlockString}`;
            return result;
          };
          clearInterval(id);
        }
      }, 10);
    }
  };
};
