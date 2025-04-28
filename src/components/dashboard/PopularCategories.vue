<template>
    <div class="card col-span-12 xl:col-span-4 h-fit">
        <div class="font-semibold text-black text-xl mb-4">Total Recaudado</div>
        <Chart
            type="doughnut"
            :data="chartData"
            :options="chartOptions"
            class="w-[17rem] mx-auto"
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
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [540, 325, 702],
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-primary-500'),
                    documentStyle.getPropertyValue('--p-green-500'),
                    documentStyle.getPropertyValue('--p-black')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-primary-400'),
                    documentStyle.getPropertyValue('--p-green-400'),
                    documentStyle.getPropertyValue('--p-black')
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
