<template>
    <VDialog :model-value="show" persistent width="400" scroll-strategy="none">
        <VCard class="py-4">
            <VCardTitle class="text-center">Logging</VCardTitle>
            <div v-if="userStore.$state.loading === true" class="pa-4 d-flex justify-center">
                <VProgressCircular indeterminate></VProgressCircular>
            </div>
            <VForm v-else @submit.prevent="submit" :disabled="loading">
                <VCardText>
                    <v-text-field class="mb-4" variant="outlined" v-model="viewModel.email" label="Email" :rules="[ruleEmail, ruleRequired]"></v-text-field>
                    <v-text-field class="mb-4" variant="outlined" v-model="viewModel.password" type="password" label="Password" :rules="[ruleRequired]"></v-text-field>
                    <VAlert v-if="errorMsg" type="error" varaint="tonal">{{ errorMsg }}</VAlert>
                </VCardText>
                <VCardActions>
                    <v-btn class="mx-auto" color="primary" type="submit" variant="elevated" :loading="loading">Log in</v-btn>
                </VCardActions>
                <VCardText class="text-caption text-center">You do not have an account? <NuxtLink to="/register">Register account</NuxtLink></VCardText>
            </VForm>
        </VCard>
    </VDialog>
</template>

<style lang="scss" scoped>

</style>

<script setup>

const userStore = useUserStore();
const { getErrorMessage } = useWebApiResponseParser();
const { ruleRequired, ruleEmail } = useFormValidationRules();

const show = computed(() => {
    return userStore.$state.isLoggedIn === false || userStore.$state.loading === true;
});

const errorMsg = ref("");
const loading = ref(false);

const viewModel = ref({
    email: '',
    password: ''
});

const submit = async (ev) => {
    const { valid } = await ev;
    if (valid) {
        login();
    }
}

const login = () => {
    loading.value = true;
    errorMsg.value = "";

    useWebApiFetch('/Users/Login', {
        method: 'POST',
        body: {...viewModel.value},
        onResponseError: ({ response }) => {
            errorMsg.value = getErrorMessage(response, { "InvalidLoginOrPassword": "Invalid login or password"});
        }
    })
    .then((response) => {
        if(response.data.value){
            viewModel.value.password = '';
            userStore.loadLoggedInUser();
        }
    })
    .finally(() => {
        loading.value = false;
    });
};

</script>