<template>
    <div>
        <div
            class="absolute top-0 z-10 flex items-center justify-center w-full h-screen bg-black/70"
            v-if="animation"
        >
            <l-bouncy size="60" speed="1.3" color="#049bed" class="mb-52"></l-bouncy>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
const animation = ref(true);
</script>
