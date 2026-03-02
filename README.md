# Budget Planner Dashboard

A Vue.js 3 application with Firebase Authentication and Firestore for managing personal finances.

## Features
- User Authentication (Login/Register)
- Dashboard with summary cards (Income, Expenses, Balance)
- Transaction management (Add/Delete)
- Pie Chart for expense categories
- Bar Chart for monthly comparison
- Responsive UI

## Setup

### 1. Firebase Configuration
The Firebase config is already set up in `src/firebase.js` with your project credentials.

### 2. Firebase Firestore Rules
Go to Firestore → Rules → Paste:

```
javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click "Publish".

### 3. Enable Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. Turn on the toggle for Email/Password

### 4. Run the Project
```
bash
npm run dev
```

The app will be available at http://localhost:5173/

## Deployment

### Option 1 - Netlify (Easiest)
1. Run `npm run build`
2. Upload the `dist` folder to Netlify

### Option 2 - GitHub + Netlify
1. Push the code to GitHub
2. Connect the repository to Netlify
3. Netlify will auto-deploy on every push

## Project Structure
```
src/
├── components/
│    ├── TransactionForm.vue
│    ├── TransactionList.vue
│    ├── PieChart.vue
│    └── BarChart.vue
├── views/
│    ├── Login.vue
│    ├── Register.vue
│    └── Dashboard.vue
├── firebase.js
├── router.js
├── App.vue
└── main.ts
