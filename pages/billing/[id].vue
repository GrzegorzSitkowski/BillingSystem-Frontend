<template>
    <VCard>
        <v-toolbar color="transparent">
            <template v-slot:prepend>
                <v-btn icon="mdi-chevron-left" to="/billing"></v-btn>
            </template>

            <v-toolbar-title>
                {'Create new invoice'}
            </v-toolbar-title>
        </v-toolbar>

        <VSkeletonLoader v-if="loading" type="paragraph, actions"></VSkeletonLoader>
        <VForm v-else @submit.prevent="submit" :disabled="saving">
            <VCardText>
                <VTextField v-model="viewModel.readingId" variant="outlined" label="ReadingId"></VTextField>
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
    readingId: 0
});

const submit = async (ev) => {
    const {valid} = await ev;
    if(valid){
        save();
    }
}

const save = () => {
    saving.value = true;

    useWebApiFetch(`/Invoices/CreateOrUpdate`, {
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
                router.push({ path: '/billing' });
            }
        })
        .finally(() => {
            saving.value = false;
        });
}



const loadData = () => {
    loading.value = true;

    useWebApiFetch('/Invoices/GetInvoice', {
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