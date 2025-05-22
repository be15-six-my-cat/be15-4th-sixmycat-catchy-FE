<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  text: String,
  selected: { type: Boolean, default: false },
  goTo: String,
});

const router = useRouter();

const handleClick = () => {
  if (props.goTo) {
    router.push(props.goTo);
  }
};
</script>

<template>
  <button :class="selected ? 'selected-item' : 'unselected-item'" @click="handleClick">
    <span class="text">{{ text }}</span>
  </button>
</template>

<style scoped>
.unselected-item {
  height: 41px;
  width: 240px;
  border-radius: 8px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.unselected-item .text {
  color: #333333;
  text-align: left;
  vertical-align: text-top;
  font-size: 16px;
  font-family: Anuphan;
  line-height: 1.5;
  border-style: hidden;
  outline: none;
  width: 224px;
}

.selected-item {
  background-color: #ffe0ea;
  height: 41px;
  width: 240px;
  border-radius: 8px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.selected-item .text {
  color: #ff5c8d;
  text-align: left;
  vertical-align: text-top;
  font-size: 16px;
  font-family: Anuphan;
  line-height: 1.5;
  border-style: hidden;
  outline: none;
  width: 224px;
}
</style>
