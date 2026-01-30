
   const totalAmount = document.getElementById('totalAmount')
    const expensesForm = document.getElementById('expensesForm');
    const submitButton = document.getElementById('submit');
    const expenseTable = document.getElementById('expense-table');

    const filterCategory = document.getElementById('filter-category');


    let expenses = [];
    let currentFilter = "All";

    submitButton.addEventListener('click', function(e){
        e.preventDefault();
        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        const expenseCategory = document.getElementById('expense-category').value;
        const expenseDate = document.getElementById('expense-date').value;

        const expense = {
            id: Date.now(), //the id helps to get the required table row
            expenseName,
            expenseAmount,
            expenseCategory,
            expenseDate
            
        }

        
        
        if(validateData(expense)){
            expenses.push(expense)
            render();
            expensesForm.reset();
        }

        
    })


    function validateData(obj){
        if(!obj.expenseName.trim()  || /\d/.test(obj.expenseName) || !obj.expenseAmount
        || obj.expenseCategory === 'select category' || !obj.expenseDate.trim())
        {
                alert('Please enter the expense details correctly!!')
                return false;
        }
    
        return true
        
    }

    //adding the expenses data into the table
    function addExpenses(expenses){
        expenseTable.innerHTML = ""; //this makes only at the frontend the values are appended to the table body but not in the backend
        expenses.forEach(expense => {
            const tableRow = document.createElement('tr');

            tableRow.innerHTML = 
                `
                    <td> ${expense.expenseName} </td>
                    <td> ${expense.expenseAmount} </td>
                    <td> ${expense.expenseCategory} </td>
                    <td> ${expense.expenseDate} </td>
                    <td> 
                        <button class="edit-btn" id=${expense.id}>Edit</button> 
                        <button class="delete-btn" id=${expense.id}>Delete</button> 
                    </td>
                `
                expenseTable.appendChild(tableRow)
                
        });
    }

    //calculating total expense amount
    function calculateExpensesTotal() {
        const total = expenses.reduce((initialValue, expense) => initialValue + expense.expenseAmount, 0);
        totalAmount.textContent = total ? `${total} Rupees` : `${total} Rupee`
        
    }


    expenseTable.addEventListener('click', function(e){

        if(e.target.classList.contains("delete-btn")){
            const removeId = parseInt(e.target.id)
            expenses = expenses.filter(expense => expense.id !== removeId);
            
            render()
        }

        if(e.target.classList.contains("edit-btn")){
            const removeId = parseInt(e.target.id)
            const expense = expenses.find( (expense) => expense.id === removeId )

            document.getElementById('expense-name').value = expense.expenseName
            document.getElementById('expense-amount').value = expense.expenseAmount
            document.getElementById('expense-category').value = expense.expenseCategory
            document.getElementById('expense-date').value = expense.expenseDate

            expenses = expenses.filter(expense => expense.id !== removeId);

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
    calculateExpensesTotal();
}















