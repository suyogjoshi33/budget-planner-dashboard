<template>
  <div class="transaction-list">
    <h2>Transactions</h2>
    <div v-if="transactions.length === 0" class="no-transactions">
      No transactions yet. Add your first transaction above.
    </div>
    <div v-else class="transactions-container">
      <div 
        v-for="transaction in transactions" 
        :key="transaction.id" 
        class="transaction-item"
        :class="transaction.type"
      >
        <div class="transaction-info">
          <span class="transaction-category">{{ formatCategory(transaction.category) }}</span>
          <span class="transaction-description">{{ transaction.description }}</span>
          <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
        </div>
        <div class="transaction-amount" :class="transaction.type">
          {{ transaction.type === 'income' ? '+' : '-' }}${{ transaction.amount.toFixed(2) }}
        </div>
        <button @click="$emit('delete-transaction', transaction.id)" class="btn-delete">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
}

defineProps<{
  transactions: Transaction[]
}>()

defineEmits<{
  (e: 'delete-transaction', id: string): void
}>()

const formatCategory = (category: string): string => {
  const categories: Record<string, string> = {
    'salary': 'Salary',
    'investment': 'Investment',
    'other-income': 'Other Income',
    'food': 'Food',
    'transport': 'Transport',
    'utilities': 'Utilities',
    'entertainment': 'Entertainment',
    'shopping': 'Shopping',
    'health': 'Health',
    'other-expense': 'Other'
  }
  return categories[category] || category
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.transaction-list {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.transaction-list h2 {
  margin-bottom: 20px;
  color: #333;
}

.no-transactions {
  text-align: center;
  color: #888;
  padding: 20px;
}

.transactions-container {
  max-height: 400px;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.transaction-item:hover {
  background: #f9f9f9;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transaction-category {
  font-weight: 600;
  color: #333;
}

.transaction-description {
  color: #666;
  font-size: 14px;
}

.transaction-date {
  color: #999;
  font-size: 12px;
}

.transaction-amount {
  font-weight: 600;
  font-size: 16px;
  margin-right: 10px;
}

.transaction-amount.income {
  color: #4CAF50;
}

.transaction-amount.expense {
  color: #f44336;
}

.btn-delete {
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.2s;
}

.btn-delete:hover {
  color: #f44336;
}
</style>
