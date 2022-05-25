::: demo

```vue
<template>
  <div>
    <p>card-{{message}}</p>
    <input v-model="message" placeholder="输入"></input>
  </div>
</template>
<script>
  // import FileList from '@/components/fileList/fileList';
  export default {
    data() {
      return {
        message: ''
      }
    }
  };
</script>
```
