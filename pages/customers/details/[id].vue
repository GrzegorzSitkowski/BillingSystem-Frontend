<template>
    <VCard>
        <v-toolbar color="transparent">
            <template v-slot:prepend>
                <v-btn icon="mdi-chevron-left" to="/customers"></v-btn>
            </template>

            <v-toolbar-title>
                {{ 'Details' }}
            </v-toolbar-title>
        </v-toolbar>

        <VSkeletonLoader v-if="loading" type="paragraph, actions"></VSkeletonLoader>
        <VForm v-else @submit.prevent="submit" :disabled="saving">
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6">
                        <VCardText>                         
                            <VTextField v-model="viewModel.fullName" variant="outlined" label="Full name" filled readonly></VTextField>
                            <VTextField v-model="viewModel.phoneNumber" variant="outlined" label="Phone number" filled readonly></VTextField>
                            <VTextField v-model="viewModel.address" variant="outlined" label="Address" filled readonly></VTextField>
                            <VTextField v-model="viewModel.postCode" variant="outlined" label="Post code" filled readonly></VTextField>
                        </VCardText>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <VCardText>                                                
                            <VTextField v-model="viewModel.city" variant="outlined" label="City" filled readonly></VTextField>
                            <VTextField v-model="viewModel.email" variant="outlined" label="Email" filled readonly></VTextField>
                            <VTextField v-model="viewModel.payRate" variant="outlined" label="Pay rate" filled readonly></VTextField>
                            <VTextField v-model="viewModel.balance" variant="outlined" label="Balance" filled readonly></VTextField>
                        </VCardText>
                    </v-col>
                </v-row>
            </v-container>

            <VCardText class="text-righ">
                <VBtn variant="flat" color="primary" type="submit" :to="`/customers/edit/${route.params.id}`">Edit</VBtn>
            </VCardText>
        </VForm>
    </VCard>
</template>

<script setup>

const route = useRoute();
const { getErrorMessage } = useWebApiResponseParser();
const globalMessageStore = useGlobalMessageStore();

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
        get();
    }
}

const get = () => {
    useWebApiFetch(`/Customer/GetCustomer`, {
        method: 'GET',
        body: { ...viewModel.value, id: isAdd.value ? undefined : route.params.id },
        watch: false,
        onResponseError: ({ response }) => {
            let message = getErrorMessage(response, {});
            globalMessageStore.showErrorMessage(message);
        }
    })
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