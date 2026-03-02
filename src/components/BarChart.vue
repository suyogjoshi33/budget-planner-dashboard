<template>
  <div class="bar-chart">
    <h2>Monthly Overview</h2>
    <div v-if="hasData" class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="no-data">
      No data to display
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
}

const props = defineProps<{
  transactions: Transaction[]
}>()

const lastSixMonths = computed(() => {
  const months: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(date.toISOString().slice(0, 7)) // YYYY-MM format
  }
  return months
})

const hasData = computed(() => props.transactions.length > 0)

const chartData = computed(() => {
  const monthlyIncome: Record<string, number> = {}
  const monthlyExpense: Record<string, number> = {}
  
  // Initialize all months with 0
  lastSixMonths.value.forEach(month => {
    monthlyIncome[month] = 0
    monthlyExpense[month] = 0
  })
  
  // Calculate totals for each month
  props.transactions.forEach(transaction => {
    const month = transaction.date.slice(0, 7)
    if (monthlyIncome[month] !== undefined) {
      if (transaction.type === 'income') {
        monthlyIncome[month] = (monthlyIncome[month] || 0) + transaction.amount
      } else {
        monthlyExpense[month] = (monthlyExpense[month] || 0) + transaction.amount
      }
    }
  })
  
  const labels = lastSixMonths.value.map(month => {
    const date = new Date(month + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  })
  
  return {
    labels,
    datasets: [
      {
        label: 'Income',
        data: lastSixMonths.value.map(month => monthlyIncome[month]),
        backgroundColor: '#4CAF50',
        borderRadius: 4
      },
      {
        label: 'Expenses',
        data: lastSixMonths.value.map(month => monthlyExpense[month]),
        backgroundColor: '#f44336',
        borderRadius: 4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        padding: 15,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || ''
          const value = context.raw || 0
          return `${label}: $${value.toFixed(2)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => '$' + value
      }
    }
  }
}
</script>

<style scoped>
.bar-chart {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bar-chart h2 {
  margin-bottom: 20px;
  color: #333;
}

.chart-container {
  height: 300px;
  position: relative;
}

.no-data {
  text-align: center;
  color: #888;
  padding: 40px;
}
</style>
