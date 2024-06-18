<template>
    <VCard>
        <v-toolbar color="transparent">
            <template v-slot:prepend>
                <v-btn icon="mdi-chevron-left" to="/customers"></v-btn>
            </template>

            <v-toolbar-title>
                {{ isAdd ? 'Add new customer' : 'Edit customer' }}
            </v-toolbar-title>
        </v-toolbar>

        <VSkeletonLoader v-if="loading" type="paragraph, actions"></VSkeletonLoader>
        <VForm v-else @submit.prevent="submit" :disabled="saving">
            <VCardText>
                <VTextField v-model="viewModel.fullName" variant="outlined" label="Full name"></VTextField>
                <VTextField v-model="viewModel.phoneNumber" variant="outlined" label="Phone number"></VTextField>
                <VTextField v-model="viewModel.address" variant="outlined" label="Address"></VTextField>
                <VTextField v-model="viewModel.postCode" variant="outlined" label="Post code"></VTextField>
                <VTextField v-model="viewModel.city" variant="outlined" label="City"></VTextField>
                <VTextField v-model="viewModel.email" variant="outlined" label="Email"></VTextField>
                <VTextField v-model="viewModel.payRate" variant="outlined" label="Pay rate"></VTextField>
                <VTextField v-model="viewModel.balance" variant="outlined" label="Balance"></VTextField>
            </VCardText>

            <VCardText class="text-righ">
                <VBtn prepend-icon="mid-content-save" variant="flat" color="primary" type="submit" :loading="saving"
                    :disabled="loading">Save
                </VBtn>
            </VCardText>
        </VForm>
    </VCard>
</template>

<script setup>

const route = useRoute();
const { getErrorMessage } = useWebApiResponseParser();
const globalMessageStore = useGlobalMessageStore();

const saving = ref(false);
const loading = ref(false);

const viewModel = ref({
    fullName: '',
    phoneNumber: '',
    address: '',
    postCode: '',
    city: '',
    email: '',
    payRate: 0,
    balance: 0
});

const submit = async (ev) => {
    const {valid} = await ev;
    if(valid){
        save();
    }
}

const save = () => {
    saving.value = true;

    useWebApiFetch(`/Customer/CreateOrUpdate`, {
        method: 'POST',
        body: { ...viewModel.value, id: isAdd.value ? undefined : route.params.id },
        watch: false,
        onResponseError: ({ response }) => {
            let message = getErrorMessage(response, {});
            globalMessageStore.showErrorMessage(message);
        }
    })
        .then((response) => {
            if (response.data.value) {
                globalMessageStore.showSuccessMessage('Saved changes.');
                router.push({ path: '/customer' });
            }
        })
        .finally(() => {
            saving.value = false;
        });
}

const isAdd = computed(() => {
    return route.params.id === 'add';
});

const loadData = () => {
    loading.value = true;

    useWebApiFetch('/Customer/GetCustomer', {
        query: {id: route.params.id },
    }).then(({ data, error}) => {
        if(data.value){
            viewModel.value = data.value;
        }else if(error.value){
            globalMessageStore.showErrorMessage("Error dowloading data")
        }
    }).finally(() => {
        loading.value = false;
    });
};

onMounted(() => {
    if(!isAdd.value){
        loadData();
    }
});

</script>