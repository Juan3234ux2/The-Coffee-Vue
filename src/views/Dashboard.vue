<script setup>
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import PopularCategories from '@/components/dashboard/PopularCategories.vue';
import PopularRooms from '@/components/dashboard/PopularRooms.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
</script>

<template>
    <div class="grid grid-cols-12 gap-5 overflow-hidden">
        <StatsWidget />
        <div class="col-span-12 flex gap-5 flex-col xl:flex-row">
            <RevenueStreamWidget class="xl:!w-[66.1%]" />
            <PopularCategories class="grow" />
        </div>
        <RecentSalesWidget class="col-span-12" />
        <div class="col-span-12 flex gap-5 flex-col xl:flex-row">
            <BestSellingWidget class="xl:!w-[66.1%]" />
            <PopularRooms class="grow" />
        </div>
    </div>
</template>
