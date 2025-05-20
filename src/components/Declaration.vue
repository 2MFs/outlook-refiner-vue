<template v-if="!isDeclaration">
    <div id="alert-additional-content-1" class="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
    <div class="flex items-center">
        <svg class="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span class="sr-only">{{ $t("Declaration") }}</span>
        <h3 class="text-lg font-medium">{{ $t("Declaration")}}</h3>
    </div>
    <div class="mt-2 mb-4 text-sm">
        <ol class="list-decimal mx-4">
            <li>{{ $t("Declaration list 1")}}</li>
            <li>{{ $t("Declaration list 2")}}</li>
            <li>{{ $t("Declaration list 3")}}</li>
            <li>{{ $t("Declaration list 4")}}</li>        
        </ol>
    </div>
    <div class="flex">
        
        <button id="alert-additional-content-button" type="button" class="cursor-pointer text-white bg-green-800 hover:bg-green-900 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700"  aria-label="Close">
        {{ $t('Agree') }}
        </button>
    </div>
    </div>

</template>

<script setup>
    import { ref, onMounted } from "vue";
    import { Dismiss } from 'flowbite';
    
    const isDeclaration = ref(false);

    // options object
    const options = {
    transition: 'transition-opacity',
    duration: 500,
    timing: 'ease-out',

    // callback functions
    onHide: (context, targetEl) => {
        //console.log('element has been dismissed')
        //console.log(targetEl)
        isDeclaration.value = true;
        localStorage.setItem('declaration', true)
    }
    };

    // instance options object
    const instanceOptions = {
    id: 'alert-additional-content-button',
    override: true
    };

    onMounted( () => {

        isDeclaration.value = localStorage.getItem("declaration") || false;

        // target element that will be dismissed
        const $targetEl = document.getElementById('alert-additional-content-1');

        // optional trigger element
        const $triggerEl = document.getElementById('alert-additional-content-button');

        const dismiss = new Dismiss($targetEl, $triggerEl, options, instanceOptions);
        
        

    })
    
</script>