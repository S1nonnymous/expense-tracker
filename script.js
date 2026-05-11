// Get elements
const balance = document.getElementById('balance');
const incomeTotal = document.getElementById('income-total');
const expenseTotal = document.getElementById('expense-total');
const transactionList = document.getElementById('transactionList');
const form = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

// Load transactions from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Save to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add transaction
function addTransaction(description, amount) {
    const transaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        date: new Date().toLocaleDateString()
    };
    
    transactions.push(transaction);
    saveTransactions();
    updateUI();
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateUI();
}

// Calculate totals
function calculateTotals() {
    const income = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const total = income - expense;
    
    return { total, income, expense };
}

// Display transactions
function displayTransactions() {
    transactionList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionList.innerHTML = '<div class="empty-state">No transactions yet</div>';
        return;
    }
    
    transactions.sort((a, b) => b.id - a.id).forEach(transaction => {
        const type = transaction.amount > 0 ? 'income' : 'expense';
        const sign = transaction.amount > 0 ? '+' : '';
        
        const div = document.createElement('div');
        div.className = `transaction ${type}`;
        div.innerHTML = `
            <div class="transaction-info">
                <h4>${transaction.description}</h4>
                <p>${transaction.date}</p>
            </div>
            <div class="transaction-amount">${sign}RM ${Math.abs(transaction.amount).toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">×</button>
        `;
        
        transactionList.appendChild(div);
    });
}

// Update balance
function updateBalance() {
    const { total, income, expense } = calculateTotals();
    
    balance.textContent = `RM ${total.toFixed(2)}`;
    incomeTotal.textContent = `RM ${income.toFixed(2)}`;
    expenseTotal.textContent = `RM ${expense.toFixed(2)}`;
    
    // Change balance color based on value
    if (total < 0) {
        balance.style.color = '#dc2626';
    } else if (total > 0) {
        balance.style.color = '#059669';
    } else {
        balance.style.color = '#1e293b';
    }
}

// Full UI update
function updateUI() {
    displayTransactions();
    updateBalance();
}

// Form submit handler
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();
    
    if (!description || !amount) {
        alert('Please fill in all fields');
        return;
    }
    
    addTransaction(description, amount);
    
    // Reset form
    descriptionInput.value = '';
    amountInput.value = '';
    descriptionInput.focus();
});

// Initial render
updateUI();