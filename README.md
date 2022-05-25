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
  plugins: ['vuepress-plugin-code-block-edit']
}
```

在`.md` 文件中使用以下语法

~~~markdown
::: demo

```vue
<template>
  <div>
    <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
  </div>
</template>
<script>
  // import FileList from '@/components/fileList/index'; // 支持 import导入
  export default {
    components: {
      // FileList
    }
  };
</script>
```

~~~

## 进阶

如果您没有自己的vuepress项目，本插件也支持一键生vuepress配置，安装相关npm包

在您的项目根目录下使用

```
kfvuepress init
```



## 致谢

1. 本插件代码参考 https://github.com/waycowei/vuepress-plugin-demo-container-v2 
   author：@waycowei
2. code-block 与 code-edit 出自于明源云大客服前端团队 @luchx @suxiaoqiang

向以上人员致谢



# 许可

MIT License