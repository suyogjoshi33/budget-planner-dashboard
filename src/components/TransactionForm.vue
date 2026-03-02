<template>
  <div class="transaction-form">
    <h2>Add Transaction</h2>
    <form @submit.prevent="submitTransaction">
      <div class="form-group">
        <label for="type">Type</label>
        <select v-model="transaction.type" id="type" required>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="amount">Amount</label>
        <input 
          type="number" 
          v-model.number="transaction.amount" 
          id="amount" 
          min="0" 
          step="0.01" 
          required 
        />
      </div>
      
      <div class="form-group">
        <label for="category">Category</label>
        <select v-model="transaction.category" id="category" required>
          <option value="">Select Category</option>
          <option v-if="transaction.type === 'income'" value="salary">Salary</option>
          <option v-if="transaction.type === 'income'" value="investment">Investment</option>
          <option v-if="transaction.type === 'income'" value="other-income">Other</option>
          <option v-if="transaction.type === 'expense'" value="food">Food</option>
          <option v-if="transaction.type === 'expense'" value="transport">Transport</option>
          <option v-if="transaction.type === 'expense'" value="utilities">Utilities</option>
          <option v-if="transaction.type === 'expense'" value="entertainment">Entertainment</option>
          <option v-if="transaction.type === 'expense'" value="shopping">Shopping</option>
          <option v-if="transaction.type === 'expense'" value="health">Health</option>
          <option v-if="transaction.type === 'expense'" value="other-expense">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <input 
          type="text" 
          v-model="transaction.description" 
          id="description" 
          required 
        />
      </div>
      
      <div class="form-group">
        <label for="date">Date</label>
        <input 
          type="date" 
          v-model="transaction.date" 
          id="date" 
          required 
        />
      </div>
      
      <button type="submit" class="btn-submit">Add Transaction</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const emit = defineEmits(['add-transaction'])

const transaction = reactive({
  type: 'expense',
  amount: null as number | null,
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

// Reset category when type changes
watch(() => transaction.type, () => {
  transaction.category = ''
})

const submitTransaction = () => {
  if (transaction.amount && transaction.amount > 0 && transaction.category && transaction.description && transaction.date) {
    emit('add-transaction', { ...transaction })
    
    // Reset form
    transaction.amount = null
    transaction.category = ''
    transaction.description = ''
    transaction.date = new Date().toISOString().split('T')[0]
  }
}
</script>

<style scoped>
.transaction-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.transaction-form h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #45a049;
}
</style>
