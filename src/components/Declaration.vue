<template>
    <div v-if="isDeclaration"
        class="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
        role="alert">
        <div class="flex items-center">
            <svg class="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                viewBox="0 0 20 20">
                <path
                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span class="sr-only">{{ $t("Declaration") }}</span>
            <h3 class="text-lg font-medium">{{ $t("Declaration") }}</h3>
        </div>
        <div class="mt-2 mb-4 text-sm">
            <ol class="list-decimal mx-4">
                <li>{{ $t("Declaration list 1") }}</li>
                <li>{{ $t("Declaration list 2") }}</li>
                <li>{{ $t("Declaration list 3") }}</li>
                <li>{{ $t("Declaration list 4") }}</li>
            </ol>
        </div>
        <div class="flex">

            <button @click="declarationDismiss" type="button"
                class="cursor-pointer text-white bg-green-800 hover:bg-green-900 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700">
                <svg class="me-1 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

                {{ $t('Agree') }}
            </button>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from "vue";

const dismiss = ref(null);
const isDeclaration = ref(false);
onMounted(() => {
    
    const declaration = localStorage.getItem("declaration") || false;

    if (!declaration) {
        isDeclaration.value = true;
    }

})

function declarationDismiss() {
    //console.log('element has been dismissed')

    isDeclaration.value = false;
    localStorage.setItem('declaration', true)
    //dismiss.hide();
}

</script>