<template>
    <div class="card col-span-12 xl:col-span-4 h-fit !mb-2">
        <div class="font-semibold text-black text-xl mb-4">Salas Populares</div>
        <Chart
            type="doughnut"
            :data="chartData"
            :options="chartOptions"
            class="mx-auto w-[20rem] xl:h-[20.6rem]"
        />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref(null);

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['Balcón', 'Terraza'],
        datasets: [
            {
                data: [540, 325],
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-black'),
                    documentStyle.getPropertyValue('--p-primary-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-black'),

                    documentStyle.getPropertyValue('--p-primary-400')
                ]
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        cutout: '70%',

        plugins: {
            legend: {
                labels: {
                    color: textColor,
                    usePointStyle: true,
                    pointStyle: 'circle'
                },
                position: 'bottom'
            }
        }
    };
};
</script>
