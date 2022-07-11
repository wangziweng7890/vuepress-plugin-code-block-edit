::: demo

```vue
<template>
  <div>
    <p>index-{{message}}</p>
    <input v-model="message" placeholder="输入"></input>
    <hello/> 
  </div>
</template>
<script>
  import hello from './hello.vue';
  export default {
    components: {
      hello
    },
    data() {
      return {
        message: ''
      }
    },
    created() {}
  };
</script>
```
