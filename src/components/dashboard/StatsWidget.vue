<template>
    <div class="col-span-12 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between">
                <div>
                    <span class="stat-title">Recaudado</span>
                    <div class="stat-info">$2.100</div>
                </div>
                <i class="pi pi-dollar !text-xl"></i>
            </div>
            <span class="text-muted-color">+20.1% vs mes anterior</span>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between">
                <div>
                    <span class="stat-title">Pedidos</span>
                    <div class="stat-info">152</div>
                </div>
                <i class="pi pi-shopping-cart !text-xl"></i>
            </div>
            <span class="text-muted-color">+20.1% vs mes anterior</span>
        </div>
    </div>
    <div class="col-span-12 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between">
                <div>
                    <span class="stat-title">Clientes</span>
                    <div class="stat-info">28441</div>
                </div>
                <i class="pi pi-users !text-xl"></i>
            </div>
            <span class="text-muted-color">+20.1% vs mes anterior</span>
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
</style>
