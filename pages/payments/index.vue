<template>
    <VCard>
        <v-toolbar color="transparent">
            <v-toolbar-title>
                List of Payments
            </v-toolbar-title>

            <template v-slot:append>
                <div class="ml-2">
                    <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" to="/payments/add">Add</v-btn>
                </div>
            </template>
        </v-toolbar>

        <v-text-field v-model="search" style="margin: 10px;" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

		<v-data-table :loading="loading" :items="items" :headers="headers" :search="search" items-per-page-text="Rows"
            :items-per-page-options="[10, 20, 50]" page-text="{0}-{1} of {2}" no-data-text="Not added any payment" loading-text="Loading">

            <template v-slot:item.url="{ value }">
                <a :href="value" target="_blank">{{ value }}</a>
            </template>

            <template v-slot:item.createDate="{ value }">
                {{ dayjs(value).format('DD.MM.YYYY HH:mm') }}
            </template>
            
            <template v-slot:item.action="{ item }">
                <div class="text-no-wrap">
                    <VBtn icon="mdi-magnify-plus" title="Details" variant="flat" :to="`/payments/details/${item.id}`"></VBtn>
                    <VBtn icon="mdi-delete" title="Delete" variant="flat" :loading="item.deleting" @click="deletePayment(item)"></VBtn>
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

const search = ref('')

const headers = ref([
    {title: 'Id', value: 'id'},
    {title: 'CustomerId', value: 'customerId'},
    {title: 'Amount', value: 'amount'},
    {title: 'Create Date', value: 'createDate'},
    {title: '', value: 'action', align: 'end'},
]);

const loadData = () => {
    loading.value = true;

    useWebApiFetch('/Payments/List')
        .then(({ data, error }) => {
            if (data.value) {
                items.value = data.value.payments;
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

const deletePayment = (item) => {
    confirmDialog.value.show({
        title: 'Confirm delete',
        text: 'Are you sure?',
        confirmBtnText: 'Delete',
        confirmBtnColor: 'error'
    }).then((confirm) => {
        if (confirm) {
            item.deleting = true;
            useWebApiFetch('/Payments/Delete', {
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
                    globalMessageStore.showSuccessMessage('Payment was deleted.');
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

</script>