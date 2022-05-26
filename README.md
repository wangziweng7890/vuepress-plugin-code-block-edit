# Vuepress v1 插件

## 简介

1. 使用自定义 ::: demo 语法，写一遍示例即可自动生成组件示例与代码示例；
2. 支持示例中的 import 语法；
3. 支持code在线编辑

## 安装

```shell
npm i vuepress-plugin-code-block-edit -D
```

## 使用

在 `.vuepress/config.js`  添加此插件:

```js
module.exports = {
  plugins: ['code-block-edit']
}
```

**如果要在线运行代码调试，需进行以下步骤**
在`.vuepress` 同级目录新建 `code-edit/index.md` 文件并且添加以下代码 以便在线运行代码

```md
---
layout: SpecialLayout
---
```

在`.vuepress/components` 下新建 `SpecialLayout.vue`文件
```vue
<template>
  <code-edit></code-edit>
</template>
<script>
export default {
  name: 'SpecialLayout'
}
</script>
```

## 开发

**在进行完以上操作后，您即可使用本插件所有功能进行文档开发**

在`.md` 文件中使用以下语法

~~~markdown
::: demo

```vue
<template>
  <div>
    <p>{{message}}</p>
    <input v-model="message" placeholder="输入"></input>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        message: ''
      }
    }
  };
</script>
```

~~~

## 进阶

如果您没有自己的vuepress项目，本插件也支持一键生vuepress配置，安装相关npm包

在您的项目根目录下使用

```
npx vuepress-plugin-code-block-edit init
```

## TODO
code-edit中使用import语法

## 致谢

1. 本插件代码参考 https://github.com/waycowei/vuepress-plugin-demo-container-v2 
   author：@waycowei
2. code-block 与 code-edit 出自于明源云大客服前端团队 @luchx @suxq

向以上人员致谢



# 许可

MIT License