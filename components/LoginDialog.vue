<template>
    <VDialog v-model="show" persistent width="400" scroll-strategy="none">
        <VCard class="py-4">
            <VCardTitle class="text-center">Logging</VCardTitle>
            <VForm @submit.prevent="submit">
                <VCardText>
                    <v-text-field class="mb-4" variant="outlined" v-model="viewModel.email" label="Email"></v-text-field>
                    <v-text-field class="mb-4" variant="outlined" v-model="viewModel.password" type="password" label="Password"></v-text-field>
                </VCardText>
                <VCardActions>
                    <v-btn class="mx-auto" color="primary" type="submit" variant="elevated">Log in</v-btn>
                </VCardActions>
            </VForm>
        </VCard>
    </VDialog>
</template>

<style lang="scss" scoped>

</style>

<script setup>
const show = ref(true)

const viewModel = ref({
    email: '',
    password: ''
});

const submit = () => {
    console.log(viewModel.value);
}

</script>