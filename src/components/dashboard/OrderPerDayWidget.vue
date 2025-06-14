<script setup>
import { onMounted, ref } from 'vue';

const chartData = ref(null);
const chartOptions = ref(null);

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
        datasets: [
            {
                type: 'bar',
                label: 'Pedidos',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                data: [30, 50, 20, 20, 60, 100, 90],
                barThickness: 32
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
            <p class="font-semibold text-xl text-black !mb-0">Pedidos por día</p>
            <SelectButton
                default-value="Semanal"
                :options="['Semanal', 'Mensual']"
                :allowEmpty="false"
            />
        </div>
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80" />
    </div>
</template>
