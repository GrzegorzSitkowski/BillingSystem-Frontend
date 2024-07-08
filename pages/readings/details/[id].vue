<template>
    <VCard>
        <v-toolbar color="transparent">
            <template v-slot:prepend>
                <v-btn icon="mdi-chevron-left" to="/readings"></v-btn>
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
                            <VTextField v-model="viewModel.lessons" variant="outlined" label="Lessons" filled readonly></VTextField>
                            <VTextField v-model="viewModel.price" variant="outlined" label="Price" filled readonly></VTextField>
                            <VTextField v-model="viewModel.period" variant="outlined" label="Period" filled readonly></VTextField>
                            <VTextField v-model="viewModel.customerId" variant="outlined" label="Customer Id" filled readonly></VTextField>
                        </VCardText>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <VCardText>                         
                            <VTextField v-model="viewModel.customerName" variant="outlined" label="Customer Name" filled readonly></VTextField>
                            <VTextField v-model="viewModel.createdBy" variant="outlined" label="Created by" filled readonly></VTextField>
                            <VTextField v-model="viewModel.createDate" variant="outlined" label="Create Date" filled readonly></VTextField>
                        </VCardText>
                    </v-col>
                </v-row>
            </v-container>

            <VCardText class="text-righ">
                <VBtn variant="flat" color="primary" type="submit" :to="`/readings/${route.params.id}`">Edit</VBtn>
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
    lessons: '',
    price: '',
    period: '',
    customerId: '',
    customerName: '',
    createdBy: '',
    createDate: ''
});

const submit = async (ev) => {
    const {valid} = await ev;
    if(valid){
        get();
    }
}

const get = () => {
    useWebApiFetch(`/Readings/GetReading`, {
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

    useWebApiFetch('/Readings/GetReading', {
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