<template>
    <div class="d-flex align-center justify-center fill-height">
        <VCard width="600">
            <VCardTitle>Register</VCardTitle>
            <VForm @submit.prevent="submit" :disabled="loading">
                <VCardText>
                    <v-text-field class="mb-4" :rules="[ruleRequired, ruleEmail]" variant="outlined"
                        v-model="viewModel.email" label="Email"></v-text-field>
                    <v-text-field class="mb-4" :rules="[ruleRequired]" variant="outlined" v-model="viewModel.password"
                        type="password" label="Password"></v-text-field>
                    <v-text-field class="mb-4" :rules="[ruleRequired, rules.samePassword]" variant="outlined"
                        type="password" label="Repeat password"></v-text-field>
                    <VAlert v-if="errorMsg" type="error" variant="tonal">{{ errorMsg }}</VAlert>
                </VCardText>
                <VCardActions class="justify-center">
                    <v-btn color="primary" type="submit" variant="elevated" :loading="loading">Create account</v-btn>
                </VCardActions>
            </VForm>
        </VCard>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script setup>
definePageMeta({
    layout: "no-auth"
});

var globalMessageStore = useGlobalMessageStore();

const viewModel = ref({
    email: '',
    password: ''
});

const errorMsg = ref("");
const loading = ref(false);

const { getErrorMessage } = useWebApiResponseParser();
const { ruleRequired, ruleEmail } = useFormValidationRules();
const router = useRouter();

const rules = {
    samePassword: (v) => v === viewModel.value.password || "Passwords are different",
}

const submit = async (ev) => {
    const { valid } = await ev;
    if(valid){
        register();
    }
}

const register = () => {
    loading.value = true;
    errorMsg.value = "";

    useWebApiFetch('/Users/CreateUserWithAccount', {
        method: 'POST',
        body: { ...viewModel.value },
        onResponseError: ({ response }) => {
            errorMsg.value = getErrorMessage(response, { "AccountWithThisEmailAlreadyExists": "Account with this email already exists"});
        }
    })
    .then((response) => {
        if(response.data.value){
            globalMessageStore.showSuccessMessage("Account created. You're logged.")
            router.push({ path: '/' });
        }
    })
    .finally(() => {
        loading.value = false;
    });
};



</script>