<template>
    <div class="d-flex flex-wrap ga-3">
        <v-col cols="12" sm="6">
            <VBtn height="150" min-width="150" style="margin: 5px;" :to="'/customers'">Customers</VBtn>
            <VBtn height="150" min-width="150" style="margin: 5px;" :to="'/readings'">Readings</VBtn>
            <VBtn height="150" min-width="150" style="margin: 5px;" :to="'/billing/readings'">Billing Dashboard</VBtn>
            <VBtn height="150" min-width="150" style="margin: 5px;" :to="'/payments'">Payments</VBtn>
        </v-col>
        <v-col cols="12" sm="6">         
            <VBtn height="150" min-width="150" style="margin: 5px;" :to="'/RecordOfInvoices'">Invoices</VBtn>
            <VBtn height="150" min-width="150" style="margin: 5px;" :to="'/RecordOfInvoices/Correction'">Corrections</VBtn>
            <VBtn height="150" min-width="150" style="margin: 5px;" :to="'/billing/interest'">Interest to bill</VBtn>
            <VBtn height="150" min-width="150" style="margin: 5px;" :to="'/RecordOfInterest'">Interest notes</VBtn>
        </v-col>
</div>
</template>

<script setup>
import { VBtn } from 'vuetify/components';
</script>

