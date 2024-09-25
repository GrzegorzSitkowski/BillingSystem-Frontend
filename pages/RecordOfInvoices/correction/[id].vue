<template>
    <VCard>
        <v-toolbar color="transparent">
            <template v-slot:prepend>
                <v-btn icon="mdi-chevron-left" to="/customers"></v-btn>
            </template>

            <v-toolbar-title>
                {{ 'Create correction'}}
            </v-toolbar-title>
        </v-toolbar>

        <VSkeletonLoader v-if="loading" type="paragraph, actions"></VSkeletonLoader>
        <VForm v-else @submit.prevent="submit" :disabled="saving">
            <VCardText>
                <VTextField v-model="viewModel.amount" variant="outlined" label="Amount"></VTextField>
                <VTextField v-model="viewModel.reason" variant="outlined" label="Reason"></VTextField>
                <VTextField v-model="viewModel.describe" variant="outlined" label="Describe"></VTextField>
                <VTextField v-model="viewModel.invoiceId" variant="outlined" label="InvoiceId"></VTextField>
                <VTextField v-model="viewModel.customerId" variant="outlined" label="Customer ID"></VTextField>
            </VCardText>

            <VCardText class="text-righ">
                <VBtn  variant="flat" color="primary" type="submit" :loading="saving"
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
const router = useRouter();

const saving = ref(false);
const loading = ref(false);

const isAdd = computed(() => {
    return route.params.id === 'add';
});

const viewModel = ref({
    amount: 0,
    reason: '',
    describe: '',
    invoiceId: 0,
    customerId: 0
});

const model = ref({
    id: 0
});


const submit = async (ev) => {
    const {valid} = await ev;
    if(valid){
        save();
    }
}

const save = () => {
    saving.value = true;

    useWebApiFetch(`/Corrections/Create`, {
        method: 'POST',
        body: { ...viewModel.value},
        watch: false,
        onResponseError: ({ response }) => {
            let message = getErrorMessage(response, {});
            globalMessageStore.showErrorMessage(message);
        }
    })
        .then((response) => {
            if (response.data.value) {
                globalMessageStore.showSuccessMessage('Saved changes.');
                router.push({ path: 'RecordOfInvoices/Correction' });
            }
        })
        .finally(() => {
            saving.value = false;
        });
}



const loadData = () => {
    loading.value = true;
    console.log(viewModel.value.id)

    useWebApiFetch('/Invoices/GetInvoice', {
        query: {id: route.params.id },
    }).then(({ data, error}) => {
        if(data.value){
            //viewModel.value = data.value
            
            model.value = data.value;         
            viewModel.value = model.value;
            viewModel.value.invoiceId = model.value.id

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