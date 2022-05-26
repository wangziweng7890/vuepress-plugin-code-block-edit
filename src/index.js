/**
 * 提供 ::: demo xxx ::: 语法，用于构建 markdown 中的示例
 */
const path = require("path");
const renderDemoBlock = require("./common/render");
const demoBlockContainers = require("./common/containers");

const resolvePath = (p) => path.resolve(__dirname, p).replace(/\\/g, "/");

module.exports = (options = {}, ctx) => {
  const defaultOpts = {
    demoBlockComponent: resolvePath("DemoBlock.vue"),
    codeEditComponent: resolvePath("CodeEdit.vue"),
  };
  options = Object.assign(defaultOpts, options);
  return {
    enhanceAppFiles() {
      return {
        name: "dynamic-code",
        content: `
          export default ({ Vue, router }) => {
            Vue.component('DemoBlock', () => import('${options.demoBlockComponent}'));
            Vue.component('CodeEdit', () => import('${options.codeEditComponent}'));
          }
         `,
      };
    },
    beforeDevServer(app, server) {
      app.post("/code-edit", function (req, res) {
        console.log("==========", req, res);
        res.json({ custom: "response" });
      });
    },
    chainMarkdown(config) {
      config.plugin("containers").use(demoBlockContainers(options)).end();
    },
    extendMarkdown: (md) => {
      const id = setInterval(() => {
        const render = md.render;
        if (typeof render.call(md, "") === "object") {
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
    },
  };
};
