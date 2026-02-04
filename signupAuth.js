
document.getElementById('signup-submit').addEventListener('click', function(e){
    e.preventDefault()
    register()
});

function register(){
    const userName = document.getElementById('signup-name').value;
    const userEmail = document.getElementById('signup-email').value;
    const userPassword = document.getElementById('signup-password').value;
    const userConfirmPassword = document.getElementById('signup-confirm').value;

    const userData = {
        userName: userName,
        userEmail: userEmail,
        userPassword: userPassword,
        userConfirmPassword: userConfirmPassword
    }

    if(validateUserInput(userData)){
        clearInputFields()
        toastr.options.timeOut = 1500; 
        toastr.success('Signed Up successfully!');
        setTimeout(function() {
            window.location.href = "login.html";
        }, 1500);
    }
    
}

function validateUserInput(userData){

    if(!userData.userName || !userData.userEmail || !userData.userPassword || !userData.userConfirmPassword){
        toastr.options.timeOut = 2000; 
        toastr.warning('Please enter valid details!');
        return false
    }
    else if(userData.userPassword !== userData.userConfirmPassword){
        toastr.options.timeOut = 2000; 
        toastr.error('Password missmatch: Enter valid password!');
        return false
    }
    return true

}

function clearInputFields(){
    document.getElementById('signup-name').value = ''
    document.getElementById('signup-email').value = ''
    document.getElementById('signup-password').value = ''
    document.getElementById('signup-confirm').value = ''
}