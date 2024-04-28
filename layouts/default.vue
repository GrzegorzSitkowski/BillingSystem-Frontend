<template>
    <v-app>
        <v-app-bar>
            <v-app-bar-nav-icon v-if="mobile" @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-app-bar-title>Billing System</v-app-bar-title>
        </v-app-bar>

        <v-navigation-drawer :order="mobile ? -1 : 0" v-model="drawer">
            <!--  -->
        </v-navigation-drawer>

        <v-main>
            <div class="pa-8">
                <NuxtPage />
            </div>       
        </v-main>
    </v-app>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay();

const drawer = ref(false)
</script>
