
const totalAmount = document.getElementById('totalAmount')
const expensesForm = document.getElementById('expensesForm');
const submitButton = document.getElementById('submit');
const expenseTable = document.getElementById('expense-table');
const filterCategory = document.getElementById('filter-category');
const displayBudget = document.getElementById('display-budget');
const displayBudgetWarning = document.getElementById('display-budget-warning')
const displayBalance = document.getElementById('display-balance')

document.getElementById('set-budget').addEventListener('click', (e)=>{
    e.preventDefault()
    budget = document.getElementById('monthly-budget').value;
})


let expenses = [];
let users = {};
let currentFilter = "All";
let spent = 0 ;
let monthlyChartInstance = null;
let budget = 0

// Get logged-in user from sessionStorage (current session)
const currentUserId = sessionStorage.getItem('currentUserId');
const userId = currentUserId; // Use email as userId
// User expenses and budget are stored in localStorage, keyed by userId (email)

// Per-user localStorage functions
function saveExpensesForUser(userId, expensesArray) {
    if (!userId) return;
    try {
        const key = `expenseTracker.expenses.${userId}`;
        localStorage.setItem(key, JSON.stringify(expensesArray));
    } catch (e) {
        console.error('Failed to save expenses for user', userId, e);
    }
}

function loadExpensesForUser(userId) {
    if (!userId) return [];
    try {
        const key = `expenseTracker.expenses.${userId}`;
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Failed to load expenses for user', userId, e);
        return [];
    }
}

function saveUserData(userId, userData) {
    if (!userId) return;
    try {
        const key = `expenseTracker.user.${userId}`;
        localStorage.setItem(key, JSON.stringify(userData));
    } catch (e) {
        console.error('Failed to save user data', userId, e);
    }
}

function loadUserData(userId) {
    if (!userId) return null;
    try {
        const key = `expenseTracker.user.${userId}`;
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.error('Failed to load user data', userId, e);
        return null;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!currentUserId) {
        alert('Please log in first');
        window.location.href = 'login.html';
        return;
    }

    // Verify user exists in localStorage (registered users database)
    const allUsers = localStorage.getItem('expenseTracker.users') || '{}';
    const registeredUsers = JSON.parse(allUsers);
    if (!registeredUsers.hasOwnProperty(currentUserId)) {
        alert('User not found. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    // Load user's expenses and user data from localStorage
    expenses = loadExpensesForUser(currentUserId);
    const userData = loadUserData(currentUserId);
    users[currentUserId] = userData || { budget: 0 };

    // If user already has a budget, display it and lock the input so it cannot be changed
    if (userData && userData.budget) {
        // document.getElementById('budget').value = userData.budget;
        // document.getElementById('budget').disabled = true;
    }

    document.getElementById('profile-img').addEventListener('click', (e) => {
        document.getElementById('profile-menu').classList.toggle('show')
        document.getElementById('user-email').textContent = userId
        e.stopPropagation()

    })

    render();
});

// showing the emptiness of the table
if(expenses.length === 0){
    expenseTable.innerHTML = ` <tr><td colspan = "5" class="empty-msg" > No Expenses found! </td></tr> `
}

submitButton.addEventListener('click', function(e){
    e.preventDefault();
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseCategory = document.getElementById('expense-category').value;
    const expenseDate = document.getElementById('expense-date').value;
    const budgetValue = budget.value;
    const expense = {
        userId: userId,
        rowId: Date.now(), //the id makes every row unique
        expenseName,
        expenseAmount,
        expenseCategory,
        expenseDate      
    }

    if(validateData(expense)){
        expenses.push(expense)
        // Only set and persist budget if the user doesn't already have one
        if ((!users[currentUserId] || !users[currentUserId].budget) && budgetValue) {
            users[currentUserId] = { budget: budgetValue };
            saveUserData(currentUserId, users[currentUserId]);
            // Lock the budget input so it can't be changed
            document.getElementById("budget").disabled = true;
        }

        // Save expenses for user
        saveExpensesForUser(currentUserId, expenses);
        render();

        // Clear only the expense input fields (keep budget displayed and locked)
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-category').value = 'select category';
        document.getElementById('expense-date').value = '';
    }

        
})


function validateData(obj){
    if(!obj.expenseName.trim()  || /\d/.test(obj.expenseName) || !obj.expenseAmount
    || obj.expenseCategory === 'select category' || !obj.expenseDate.trim())
    {
            alert('Please enter the expense details correctly!!')
            document.getElementById("budget").disabled = false;
            return false;
    }
    
    return true
        
}

//adding the expenses data into the table
function addExpenses(expenses){
    expenseTable.innerHTML = ""; //this makes only at the frontend the values are appended to the table body but not in the backend
        
    if(expenses.length === 0){
        expenseTable.innerHTML = ` <tr><td colspan = "5" > No Expenses found! </td></tr> `
    }else{
        const budgetToShow = users[currentUserId] && users[currentUserId].budget ? users[currentUserId].budget : 0;
        displayBudget.textContent = `Budget: ₹ ${budgetToShow}`;
        
        expenses.forEach(expense => {
            
            const tableRow = document.createElement('tr');

            tableRow.innerHTML = 
                `
                    <td> ${expense.expenseName} </td>
                    <td> ${expense.expenseAmount} </td>
                    <td> ${expense.expenseCategory} </td>
                    <td> ${expense.expenseDate} </td>
                    <td> 
                        <button class="edit-btn" id=${expense.rowId}>Edit</button> 
                        <button class="delete-btn" id=${expense.rowId}>Delete</button> 
                    </td>
                `
                expenseTable.appendChild(tableRow)
                
        });
    }
}

//calculating total expense amount
function calculateExpensesTotal(data) {
    // Calculate total spent
    spent = data.reduce((initialValue, expense) => initialValue + Number(expense.expenseAmount || 0), 0);
    totalAmount.textContent = spent;

    // Use the logged-in user's id for budget lookups
    const uid = currentUserId;
    const userBudgetRaw = users[uid] && users[uid].budget !== undefined ? users[uid].budget : 0;
    const userBudget = Number(userBudgetRaw) || 0; 

    displayBudget.textContent = `Budget: ₹ ${userBudget}`;
    displayBalance.textContent = `Balance: ₹ ${userBudget - spent}`;

    // Determine thresholds
    const budgetLimit = userBudget * 0.8;
    const singleExpense = userBudget * 0.25;
    const filteredSingleExpense = expenses.filter((expense) => expense.userId === uid && Number(expense.expenseAmount) >= singleExpense);
        
    if (spent > budgetLimit) {
        // overall budget exceeded
        highlightAmount([], true);
    } else {
        // highlight individual large expenses (may be empty)
        highlightAmount(filteredSingleExpense, false);
    }
        
}


expenseTable.addEventListener('click', function(e){

    if(e.target.classList.contains("delete-btn")){
        const removeId = parseInt(e.target.id)
        expenses = expenses.filter(expense => expense.rowId !== removeId);
        // Save updated expenses for user
        saveExpensesForUser(currentUserId, expenses);
        render()
    }

    if(e.target.classList.contains("edit-btn")){
        const removeId = parseInt(e.target.id)
        const expense = expenses.find( (expense) => expense.rowId === removeId )

        document.getElementById('expense-name').value = expense.expenseName
        document.getElementById('expense-amount').value = expense.expenseAmount
        document.getElementById('expense-category').value = expense.expenseCategory
        document.getElementById('expense-date').value = expense.expenseDate

        expenses = expenses.filter(expense => expense.rowId !== removeId);
        // Save updated expenses for user
        saveExpensesForUser(currentUserId, expenses);

        render()
            
    }
})


filterCategory.addEventListener("change", (e) => {
    currentFilter = e.target.value;
    render();
});


function render(){
    let data = expenses;

    if(currentFilter !== "All"){
        data = expenses.filter(
            e => e.expenseCategory.trim() === currentFilter.trim()
        );
    }

    addExpenses(data);
    calculateExpensesTotal(data);
    generateMonthlyExpenseChart();
}

function highlightAmount(typOfExpense, budgetExceeded = false){
    // Clear previous highlights and warnings
    displayBudgetWarning.textContent = "";
    document.querySelectorAll('tr.single-expense-row').forEach(r => r.classList.remove('single-expense-row'));

    
    // If typOfExpense is an array with items, highlight matching rows
    if (Array.isArray(typOfExpense) && typOfExpense.length > 0) {
        typOfExpense
            .map(e => document.getElementById(e.rowId)?.closest("tr"))
            .filter(Boolean)
            .forEach(row => row.classList.add("single-expense-row"));
    } else if (budgetExceeded) {
        displayBudgetWarning.textContent = "You spent more of your budget!"
    }

}












