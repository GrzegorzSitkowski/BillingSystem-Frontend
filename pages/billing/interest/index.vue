<template>
    <VCard>
        <v-toolbar color="transparent">
            <v-toolbar-title>
                Customers with interests
            </v-toolbar-title>        
        
        </v-toolbar>

        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

		<v-data-table :loading="loading" :items="items" :headers="headers" :search="search" items-per-page-text="Rows"
            :items-per-page-options="[10, 20, 50]" page-text="{0}-{1} of {2}" no-data-text="No customers with interest" loading-text="Loading">

            <template v-slot:item.url="{ value }">
                <a :href="value" target="_blank">{{ value }}</a>
            </template>

            <template v-slot:item.createDate="{ value }">
                {{ dayjs(value).format('DD.MM.YYYY HH:mm') }}
            </template>

            <template v-slot:item.action="{ item }">
                <div class="text-no-wrap">                  
                    <!-- <VBtn icon="mdi-svg" title="Invoice" variant="flat" :to="`/billing/${item.id}`"></VBtn> -->
                    <VBtn icon="mdi-svg" title="Invoice" variant="flat" @click="calculateInterest(item)"></VBtn>
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

const search=ref('');

const headers = ref([
    {title: 'Id', value: 'id'},
    {title: 'Amount', value: 'amount'},
    {title: 'Customer Id', value: 'customerId'},
    {title: 'Due Date', value: 'dueDate'},
    {title: 'Paid', value: 'paid'},
    {title: '', value: 'action', align: 'end'},
]);

const loadData = () => {
    loading.value = true;

    useWebApiFetch('/Billing/ListToInterest')
        .then(({ data, error }) => {
            if (data.value) {
                items.value = data.value.invoices;
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

const calculateInterest = (item) => {
    confirmDialog.value.show({
        title: 'Confirm invoicing',
        text: 'Do you calculate interest?',
        confirmBtnText: 'Yes',
        confirmBtnColor: 'success'
    }).then((confirm) => {
        if(confirm){
            useWebApiFetch(`/InterestNotes/Create`, {
        method: 'POST',
        body: { invoiceId: item.id},
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