<template>
  <div class="pie-chart">
    <h2>Expense Categories</h2>
    <div v-if="hasData" class="chart-container">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="no-data">
      No expense data to display
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

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

const expenseTransactions = computed(() => {
  return props.transactions.filter(t => t.type === 'expense')
})

const hasData = computed(() => expenseTransactions.value.length > 0)

const categoryColors: Record<string, string> = {
  'food': '#FF6384',
  'transport': '#36A2EB',
  'utilities': '#FFCE56',
  'entertainment': '#4BC0C0',
  'shopping': '#9966FF',
  'health': '#FF9F40',
  'other-expense': '#C9CBCF'
}

const categoryLabels: Record<string, string> = {
  'food': 'Food',
  'transport': 'Transport',
  'utilities': 'Utilities',
  'entertainment': 'Entertainment',
  'shopping': 'Shopping',
  'health': 'Health',
  'other-expense': 'Other'
}

const chartData = computed(() => {
  const categoryTotals: Record<string, number> = {}
  
  expenseTransactions.value.forEach(transaction => {
    categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount
  })
  
  const labels = Object.keys(categoryTotals).map(cat => categoryLabels[cat] || cat)
  const data = Object.values(categoryTotals)
  const colors = Object.keys(categoryTotals).map(cat => categoryColors[cat] || '#C9CBCF')
  
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        padding: 15,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          return `${label}: $${value.toFixed(2)}`
        }
      }
    }
  }
}
</script>

<style scoped>
.pie-chart {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pie-chart h2 {
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
