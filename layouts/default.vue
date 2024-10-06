<template>
    <v-app>
        <v-app-bar color="brand">
            <v-app-bar-nav-icon v-if="mobile" @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-app-bar-title>Billing System</v-app-bar-title>
            <v-spacer></v-spacer>
            <VBtn icon="mdi-theme-light-dark" title="Switch theme" @click="toggleTheme"></VBtn>
        </v-app-bar>

        <v-navigation-drawer :order="mobile ? -1 : 0" v-model="drawer" v-if="userStore.$state.isLoggedIn === true">
            <v-list-item lines="two">
                <template v-slot:prepend>
                    <v-avatar color="brand" v-if="userStore.$state.userData?.email">
                        {{ userStore.$state.userData.email[0].toUpperCase() }}
                    </v-avatar>
                </template>
                <VListItemTitle v-if="accountStore.$state.accountData?.name"> {{ accountStore.$state.accountData.name }}</VListItemTitle>
                <VListItemSubtitle v-if="userStore.$state.userData?.email"> {{ userStore.$state.userData.email }}</VListItemSubtitle>
            </v-list-item>
            <VDivider></VDivider>
            <VList>
                <VListItem v-for="item in menuItems" :key="item.name" :title="item.name" :prepend-icon="item.icon" :to="item.url"></VListItem>
            </VList>
            <template v-slot:append>
                <div class="pa-2">
                    <v-btn block variant="text" @click="logout" prepend-icon="mdi-logout">
                        Logout
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <v-main>
            <div class="pa-8">
                <NuxtPage v-if="userStore.$state.isLoggedIn === true"/>
            </div>       
        </v-main>
        <LoginDialog ></LoginDialog>
        <ConfirmDialog ref="confirmDialog"/>
    </v-app>   
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { useTheme } from 'vuetify'
import { useStorage } from '@vueuse/core'

const theme = useTheme()
const { mobile } = useDisplay();
const drawer = ref(null)
const currentTheme = useStorage('currentTheme', 'light')
const userStore = useUserStore();
const accountStore = useAccountStore();
const antiForgeryStore = useAntiForgeryStore();
const confirmDialog = ref(null)


const menuItems = [
    {
        name: 'Home',
        icon: 'mdi-home',
        url: '/',
        subItems: [],
    },
    {
        name: 'Customers',
        icon: 'mdi-account',
        url: '/customers',        
    },
    {
        name: 'Readings',
        icon: 'mdi-dns-outline',
        url: '/readings'
    },
    {
        name: 'Record of invoices',
        icon: 'mdi-file-document',
        url: '/RecordOfInvoices',
    },
    {
        name: 'Record of corrections',
        icon: 'mdi-marker-cancel',
        url: '/RecordOfInvoices/Correction',
    },
    {
        name: 'Billing Dashboard',
        icon: 'mdi-file-multiple',
        url: '/billing/readings'
    },
    {
        name: 'Customers with interest',
        icon: 'mdi-file-multiple',
        url: '/billing/interest'
    },
    {
        name: 'Record of Interest Note',
        icon: 'mdi-file-document',
        url: '/RecordOfInterest',
    },
];

const menuItemsGroup = [
    {
        name: 'Search',
        icon: 'mdi-account-search',
        url: '/customers/search',   
    }
];

function toggleTheme () {
    let newTheme = theme.global.current.value.dark ? 'light' : 'dark';
    theme.global.name.value = newTheme;
    currentTheme.value = newTheme;
}

const logout = () => {
    confirmDialog.value.show({
        title: 'Confirm logout',
        text: 'Are you sure?',
        confirmBtnText: 'Logout',
        confirmBtnColor: 'error'
    }).then((confirm) => {
        if (confirm) {
            userStore.logout();
        }
    })
}

await antiForgeryStore.loadAntiForgeryToken();

onMounted(() => {
    theme.global.name.value = currentTheme.value;
    userStore.loadLoggedInUser();
});

</script>
