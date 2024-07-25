<template>
    <VCard>
        <v-toolbar color="transparent">
            <v-toolbar-title>
                Billing Dashboard
            </v-toolbar-title>        
        
        </v-toolbar>    

		<v-data-table :loading="loading" :items="items" :headers="headers" items-per-page-text="Rows"
            :items-per-page-options="[10, 20, 50]" page-text="{0}-{1} of {2}" no-data-text="Not added any readings" loading-text="Loading">

            <template v-slot:item.url="{ value }">
                <a :href="value" target="_blank">{{ value }}</a>
            </template>

            <template v-slot:item.createDate="{ value }">
                {{ dayjs(value).format('DD.MM.YYYY HH:mm') }}
            </template>

            <template v-slot:item.action="{ item }">
                <div class="text-no-wrap">                  
                    <VBtn icon="mdi-svg" title="Invoice" variant="flat" :to="`/billing/${item.id}`"></VBtn>
                    <VBtn icon="mdi-pencil" title="Invoice" variant="flat" @click="invoicing(item)"></VBtn>
                    <!-- <VBtn icon="mdi-pencil" title="Edit" variant="flat" :to="`/readings/${item.id}`"></VBtn> -->
                    <!-- <VBtn icon="mdi-delete" title="Delete" variant="flat" :loading="item.deleting" @click="deleteReading(item)"></VBtn> -->
                </div>
            </template>          
        </v-data-table>
        <ConfirmDialog ref="confirmDialog" />
    </VCard>

    <v-toolbar>
        <template v-slot:append>
            <div class="ml-2">
                <!-- <v-btn color="primary" variant="flat" prepend-icon="mdi-svg" :to="`/billing/${item.id}`">Invoice</v-btn> -->
            </div>
        </template>
    </v-toolbar>
</template>

<script setup>

const globalMessageStore = useGlobalMessageStore();
const { getErrorMessage } = useWebApiResponseParser();
const dayjs = useDayjs();
const loading = ref(false);
const items = ref([]);

const confirmDialog = ref(null);

const headers = ref([
    {title: 'Id', value: 'id'},
    {title: 'Customer Name', value: 'customerName'},
    {title: 'Customer Id', value: 'customerId'},
    {title: 'Lessons', value: 'lessons'},
    {title: 'Price', value: 'price'},
    {title: '', value: 'action', align: 'end'},
]);

const loadData = () => {
    loading.value = true;

    useWebApiFetch('/Readings/List')
        .then(({ data, error }) => {
            if (data.value) {
                items.value = data.value.readings;
            } else if (error.value) {
                items.value = [];
            }
        })
        .finally(() => {
            loading.value = false;
        });
}

onMounted(() => {
    loadData();
});

const invoicing = (item) => {
    confirmDialog.value.show({
        title: 'Confirm invoicing',
        text: 'Do you invoicing this reading?',
        confirmBtnText: 'Yes',
        confirmBtnColor: 'success'
    }).then((confirm) => {
        if(confirm){
            useWebApiFetch(`/Invoices/Create`, {
        method: 'POST',
        body: { readingId: item.id},
        watch: false,
        onResponseError: ({ response }) => {
            let message = getErrorMessage(response, {});
            globalMessageStore.showErrorMessage(message);
            }
        }).then((response) => {
            if(response.data.value){
                globalMessageStore.showSuccessMessage('Invoiced')
            }
        })
        }
    })
}
</script>