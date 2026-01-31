
const totalAmount = document.getElementById('totalAmount')
const expensesForm = document.getElementById('expensesForm');
const submitButton = document.getElementById('submit');
const expenseTable = document.getElementById('expense-table');
const filterCategory = document.getElementById('filter-category');
const displayBudget = document.getElementById('display-budget');
const displayBudgetWarning = document.getElementById('display-budget-warning')
let budget = document.getElementById('budget');

let expenses = [];
let users = {};
let currentFilter = "All";
let spent = 0 ;

const userId = `user_${Date.now()}`;

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

    if(!users[userId]){
        users[userId] = {budget: budgetValue}
    }

     
    if(validateData(expense)){
        expenses.push(expense)
        render();
        budget.value = ""
        expensesForm.reset();
        document.getElementById("budget").disabled = true;
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
        displayBudget.textContent = `Your Budget is ₹ ${users[userId].budget}`;
        
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
    spent = data.reduce((initialValue, expense) => initialValue + expense.expenseAmount, 0);
    totalAmount.textContent = spent

    data.forEach( (expense) => id = expense.userId)
    const budgetLimit = users[id].budget * 0.8
    const singleExpense = users[id].budget * 0.25  
    const filteredSingleExpense = expenses.filter( (expense) => expense.userId ===  id && expense.expenseAmount >= singleExpense)

    if(spent >= budgetLimit){
        highlightAmount()
    }else {
        highlightAmount(filteredSingleExpense)
    }
        
}


expenseTable.addEventListener('click', function(e){

    if(e.target.classList.contains("delete-btn")){
        const removeId = parseInt(e.target.id)
        expenses = expenses.filter(expense => expense.rowId !== removeId);   
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
}

function highlightAmount(typOfExpense){
    if(typOfExpense){
        const row = typOfExpense.forEach( (expense) =>  document.getElementById(expense.rowId).closest("tr"))
        row.classList.add("single-expense-row");
    }else{
        displayBudgetWarning.textContent = "You spent more of your budget!"
    }
    
    
}













