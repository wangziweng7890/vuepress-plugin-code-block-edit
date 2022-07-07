console.log(__filename);
module.exports = {
  title: "文档",
  description: "文档",
  // lastUpdated: 'Last Updated', // string | boolean
  smoothScroll: true,
  // evergreen: true, // 不进行babel编译，需要时测试IE时在放开
  chainWebpack: (config, isServer) => {
    config.resolve.alias.set("core-js/library/fn", "core-js/features"); // 解决corejs报错
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
        // ...require('../../aliases.config').webpack
      },
    },
  },
  themeConfig: {
    displayAllHeaders: true,
    sidebarDepth: 2,
    sidebar: {
      "/guide/": [
        {
          title: "测试菜单1", // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          sidebarDepth: 1, //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          children: [
            ["card.md", "子菜单1"], //菜单名称为'子菜单1'
          ],
        },
      ],
    },
    // page meta
    editLinkText: "在 GitHub 上编辑此页",
    lastUpdatedText: "上次更新",
    contributorsText: "贡献者",
    nav: [
      {
        text: "Languages",
        ariaLabel: "Language Menu",
        items: [
          { text: "Chinese", link: "/language/chinese/" },
          { text: "Japanese", link: "/language/japanese/" },
        ],
      },
    ],
  },
  nav: [
    { text: "Home", link: "/" },
    { text: "Guide", link: "/guide/" },
    { text: "External", link: "https://google.com" },
  ],
  plugins: [["code-block-edit", {}]],
};
