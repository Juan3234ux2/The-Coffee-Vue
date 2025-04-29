<template>
    <div class="col-span-12 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between">
                <div>
                    <span class="stat-title">Total Recaudado</span>
                    <div class="stat-info">$15.100</div>
                </div>
                <i class="pi pi-dollar stat-icon"></i>
            </div>
            <span class="text-green-700 font-semibold">+20.1% vs mes anterior</span>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between">
                <div>
                    <span class="stat-title">Total Gastado</span>
                    <div class="stat-info">$10.000</div>
                </div>
                <i class="pi pi-wallet stat-icon"></i>
            </div>
            <span class="text-red-700 font-semibold">-4.3% vs mes anterior</span>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between">
                <div>
                    <span class="stat-title">Pedidos</span>
                    <div class="stat-info">152</div>
                </div>
                <i class="pi pi-shopping-bag stat-icon"></i>
            </div>
            <span class="text-green-700 font-semibold">+10.1% vs mes anterior</span>
        </div>
    </div>
</template>
<style scoped>
.stat-title {
    @apply block text-black font-medium mb-4 text-lg;
}
.stat-info {
    @apply block  font-semibold text-black text-3xl mb-3;
}
.stat-icon {
    @apply !text-xl text-primary rounded-full border bg-surface-100 h-fit px-2 py-1;
}
</style>
