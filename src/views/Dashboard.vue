<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Budget Planner Dashboard</h1>
      <div class="user-info">
        <span>Welcome, {{ userName }}</span>
        <button @click="handleLogout" class="btn-logout">Logout</button>
      </div>
    </header>
    
    <div class="dashboard-content">
      <div class="summary-cards">
        <div class="summary-card income">
          <h3>Total Income</h3>
          <p class="amount">${{ totalIncome.toFixed(2) }}</p>
        </div>
        <div class="summary-card expense">
          <h3>Total Expenses</h3>
          <p class="amount">${{ totalExpenses.toFixed(2) }}</p>
        </div>
        <div class="summary-card balance" :class="{ negative: balance < 0 }">
          <h3>Balance</h3>
          <p class="amount">${{ balance.toFixed(2) }}</p>
        </div>
      </div>
      
      <div class="main-content">
        <div class="left-column">
          <TransactionForm @add-transaction="addTransaction" />
          <TransactionList 
            :transactions="transactions" 
            @delete-transaction="deleteTransaction" 
          />
        </div>
        <div class="right-column">
          <PieChart :transactions="transactions" />
          <BarChart :transactions="transactions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  getDocs
} from 'firebase/firestore'
import { auth, db } from '../firebase'
import TransactionForm from '../components/TransactionForm.vue'
import TransactionList from '../components/TransactionList.vue'
import PieChart from '../components/PieChart.vue'
import BarChart from '../components/BarChart.vue'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  userId: string
}

const router = useRouter()
const transactions = ref<Transaction[]>([])
const userId = ref<string>('')
const userName = ref('User')

const totalIncome = computed(() => {
  return transactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpenses = computed(() => {
  return transactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const balance = computed(() => totalIncome.value - totalExpenses.value)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid
      userName.value = user.displayName || user.email?.split('@')[0] || 'User'
      
      // Load transactions from Firestore
      const q = query(collection(db, 'transactions'), where('userId', '==', user.uid))
      
      // Real-time listener for transactions
      onSnapshot(q, (snapshot) => {
        transactions.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[]
      })
    } else {
      router.push('/login')
    }
  })
})

const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
  try {
    await addDoc(collection(db, 'transactions'), {
      ...transaction,
      userId: userId.value
    })
  } catch (err) {
    console.error('Error adding transaction:', err)
  }
}

const deleteTransaction = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'transactions', id))
  } catch (err) {
    console.error('Error deleting transaction:', err)
  }
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (err) {
    console.error('Error logging out:', err)
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}

.dashboard-header {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  color: #333;
  font-size: 24px;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info span {
  color: #666;
}

.btn-logout {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #da190b;
}

.dashboard-content {
  padding: 30px 40px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.summary-card h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: 500;
}

.summary-card .amount {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.summary-card.income .amount {
  color: #4CAF50;
}

.summary-card.expense .amount {
  color: #f44336;
}

.summary-card.balance .amount {
  color: #2196F3;
}

.summary-card.balance.negative .amount {
  color: #f44336;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 1024px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>
