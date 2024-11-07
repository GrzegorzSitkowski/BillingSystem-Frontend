<template>
    <VCard>
        <v-toolbar color="transparent">
            <template v-slot:prepend>
                <v-btn icon="mdi-chevron-left" to="/payments"></v-btn>
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
                            <VTextField v-model="viewModel.id" variant="outlined" label="Id" filled readonly></VTextField>
                            <VTextField v-model="viewModel.customerId" variant="outlined" label="CustomerId" filled readonly></VTextField>
                            <VTextField v-model="viewModel.documentId" variant="outlined" label="DocumentId" filled readonly></VTextField>                    
                        </VCardText>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <VCardText>
                            <VTextField v-model="viewModel.documentNumber" variant="outlined" label="Document Number" filled readonly></VTextField>                                             
                            <VTextField v-model="viewModel.amount" variant="outlined" label="Amount" filled readonly></VTextField>
                            <VTextField v-model="viewModel.createDate" variant="outlined" label="Created Date" filled readonly></VTextField>
                        </VCardText>
                    </v-col>
                </v-row>
            </v-container>

            <VCardText class="text-righ">
                <VBtn variant="flat" color="primary" type="submit" :to="`/payments/${route.params.id}`">Edit</VBtn>
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
    id: 0,
    customerId: 0,
    documentId: 0,
    documentNumber: '',
    amount: 0,
    createDate: '',
});

const submit = async (ev) => {
    const {valid} = await ev;
    if(valid){
        get();
    }
}

const get = () => {
    useWebApiFetch(`/Payments/GetPayment`, {
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

    useWebApiFetch('/Payments/GetPayment', {
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