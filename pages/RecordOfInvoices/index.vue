<template>
    <VCard>
        <v-toolbar color="transparent">
            <v-toolbar-title>
                Record of Invoices
            </v-toolbar-title>
        </v-toolbar>

        <v-text-field v-model="search" style="margin: 10px;" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

		<v-data-table :loading="loading" :items="items" :headers="headers" :search="search" items-per-page-text="Rows"
            :items-per-page-options="[10, 20, 50]" page-text="{0}-{1} of {2}" no-data-text="Not found any invoices." loading-text="Loading"> 
    

            <template v-slot:item.url="{ value }">
                <a :href="value" target="_blank">{{ value }}</a>
            </template>        

            <template v-slot:item.createDate="{ value }">
                {{ dayjs(value).format('DD.MM.YYYY') }}
            </template><template v-slot:item.dueDate="{ value }">
                {{ dayjs(value).format('DD.MM.YYYY') }}
            </template>
            
            <template v-slot:item.action="{ item }">              
                <div class="text-no-wrap">
                    <VBtn icon="mdi-magnify-plus" title="Details" variant="flat" :to="`/RecordOfInvoices/details/${item.id}`"></VBtn>
                    <VBtn icon="mdi-printer" title="Print" variant="flat" @click="print(item)"></VBtn>
                    <VBtn icon="mdi-marker-cancel" title="Correction" variant="flat" :to="`/RecordOfInvoices/Correction/${item.id}`"></VBtn>
                    <VBtn icon="mdi-delete" title="Delete" variant="flat" :loading="item.deleting" @click="deleteInvoice(item)"></VBtn>
                </div>
            </template>
        </v-data-table>
        <ConfirmDialog ref="confirmDialog" />
    </VCard>
</template>

<script setup>



const globalMessageStore = useGlobalMessageStore();
const { getErrorMessage } = useWebApiResponseParser();
const dayjs = useDayjs();
const loading = ref(false);
const items = ref([]);

const confirmDialog = ref(null);

const search = ref('');

const headers = ref([
    {title: 'Id', value: 'id'},
    {title: 'Amount', value: 'amount'},
    {title: 'Document Number', value: 'documentNumber'},
    {title: 'CustomerId', value: 'customerId'},
    {title: 'Create Date', value: 'createDate'},
    {title: 'Due Date', value: 'dueDate'},
    {title: '', value: 'action', align: 'end'},
]);

const loadData = () => {
    loading.value = true;

    useWebApiFetch('/Invoices/List')
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
};

onMounted(() => {
    loadData();
});


const deleteInvoice = (item) => {
    confirmDialog.value.show({
        title: 'Confirm delete',
        text: 'Are you sure?',
        confirmBtnText: 'Delete',
        confirmBtnColor: 'error'
    }).then((confirm) => {
        if (confirm) {
            item.deleting = true;
            useWebApiFetch('/Invoices/Delete', {
                method: 'POST',
                body: { id : item.id },
                watch: false,
                onResponseError: ({ response }) => {
                    let message = getErrorMessage(response, {});
                    globalMessageStore.showErrorMessage(message);
                }
            })
            .then((response) => {
                if (response.data.value) {
                    globalMessageStore.showSuccessMessage('Invoice was deleted.');
                    let indexToDel = items.value.findIndex(i => i.id === item.id);
                    if (indexToDel > -1) {
                        items.value.splice(indexToDel, 1);
                    }
                }
            })
            .finally(() => {
                item.deleting = false;
            });
        }
    })
}

const print = (item) => {
    confirmDialog.value.show({
        title: 'Confirm print',
        text: 'Do you print this invoice?',
        confirmBtnText: 'Yes',
        confirmBtnColor: 'success'
    }).then((confirm) => {
        if(confirm){
            useWebApiFetch(`/Invoices/PrintInvoice`, {
        method: 'GET',
        query: { id: item.id},
        watch: false,
        onResponseError: ({ response }) => {
            let message = getErrorMessage(response, {});
            globalMessageStore.showErrorMessage(message);
            }
        }).then((response) => {
            if(response.data.value){
                globalMessageStore.showSuccessMessage('Print is done.')
            }
        })
        }
    })
}
</script>