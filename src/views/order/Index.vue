<template>
    <div class="order">
        <order-list @listenToDetail="handleToDetail"/>
    </div>
</template>

<script>
import OrderList from '@/components/OrderList';

export default {
  data() {
    return {
    };
  },
  props: [
  ],
  components: {
    OrderList,
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleToDetail() {
    },
  },
  beforeDestroy() {
  },
};
</script>

<style scoped lang="scss">
    @import "../../assets/css/public.scss";

    .order{
        background: #fafafa;
        height: 100%;
    }
</style>
