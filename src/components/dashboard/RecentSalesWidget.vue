<script setup>
import { onMounted, ref } from 'vue';

const chartData = ref(null);
const chartOptions = ref(null);

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, documentStyle.getPropertyValue('--p-primary-400'));
    gradient.addColorStop(1, 'rgba(255,255,255,0.1)');
    return {
        labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
        datasets: [
            {
                label: 'Ingresos',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                backgroundColor: gradient,
                tension: 0.4
            }
        ]
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    display: false
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    display: false
                }
            }
        }
    };
}

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="card !mb-2">
        <div class="flex justify-between items-center mb-6">
            <p class="font-semibold text-xl text-black !mb-0">Flujo de ingresos</p>
            <SelectButton default-value="Semanal" :options="['Semanal', 'Mensual']" />
        </div>
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-80" />
    </div>
</template>
