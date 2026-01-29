//element id's
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const expenseCategory = document.getElementById('expense-category');
const expenseDate = document.getElementById('expense-date')

const totalAmount = document.getElementById('totalAmount')
const expensesForm = document.getElementById('expensesForm');
//submit button for action
const submitButton = document.getElementById('submit');
//expenses table 
const expenseTable = document.getElementById('expense-table');

submitButton.addEventListener('click', function(e){
    e.preventDefault();
    validateData(expenseName,expenseAmount,expenseCategory,expenseDate);
})


function validateData(expenseName,expenseAmount,expenseCategory,expenseDate){
    console.log({ expenseName, expenseAmount, expenseCategory, expenseDate });

    if(!expenseName.value.trim()  || /\d/.test(expenseName.value) || !expenseAmount.value.trim()
        || expenseCategory === 'select category' || !expenseDate.value.trim())
    {
        alert('Please enter the expense details correctly!!')
    }
    else{
        addExpenses(expenseName,expenseAmount,expenseCategory,expenseDate);
    }
}


function createActionCell() {
    //edit and delete buttons
    //edit button
    const editButton = document.createElement('button')
    editButton.className = 'edit-btn action-btn'
    editButton.setAttribute('id', 'editButton')
    editButton.textContent = 'Edit'

    //delete button
    const deleteButton = document.createElement('button')
    deleteButton.className = 'delete-btn action-btn'
    deleteButton.setAttribute('id', 'deleteButton')
    deleteButton.textContent = 'Delete'

    return {editButton, deleteButton};
}

//adding the expenses data into the table
function addExpenses(...args){
    const tableRow = document.createElement('tr')
    const tableData = document.createElement('td')
    for (let arg of args) {
        console.log(arg);
        
        const tableData = document.createElement('td')
        tableData.innerHTML = arg.value

        if(arg.name === 'amount') {
            calculateExpenses(parseInt(arg.value))
        }
        tableRow.appendChild(tableData);
    }
    const {editButton, deleteButton} = createActionCell()
    tableData.append(editButton, deleteButton)
    tableRow.appendChild(tableData)
    expenseTable.appendChild(tableRow)

    //resets the form or empties the form
    expensesForm.reset() 


    //editing the expenses details row
    editButton.addEventListener('click', function(){
        editExpensesDetails(tableRow)
        
    })

    //deleting the expenses details row
    deleteButton.addEventListener('click', function(){
        deleteExpensesDetails(tableRow);
        
    })
}

//calculating total expense amount
function calculateExpenses(amount) {
    let current = parseInt(totalAmount.textContent);
    let updated = current + amount;
    totalAmount.textContent = `${updated} Rupees`
}

// editing the expenses details and save need to do
function editExpensesDetails(tableRow){
    
    console.log(tableRow);
    
    // addExpenses(cells) 
}

//deleting the expenses details
function deleteExpensesDetails(tableRow){
    tableRow.remove()
    //minus the amount
}

//filter the total amount based on the category
//persistent storage -> websocket, local storage













