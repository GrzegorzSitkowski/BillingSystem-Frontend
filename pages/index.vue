<template>
    <div @click="test">Hello world!</div>
</template>

<script setup>

const globalMessageStore = useGlobalMessageStore();

const test = () => {
    globalMessageStore.showSuccessMessage('test');
}

</script>