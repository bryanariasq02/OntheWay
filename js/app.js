console.log('hello');
//SignUp
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#signup-email').value
    const password = document.querySelector('#signup-password').value
    
    emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((amigo.edu.co))/;

    if (emailRegex.test(email)) {
        auth
            .createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                signupForm.reset();
                //cerrar el modal
                $('#signupModal').modal('hide');
                console.log('signup');
            })
       console.log('amigo.edu.co');
      } else {
        console.log('incorrecto');
      }

});

//SignIn

const signinForm = document.querySelector('#login-form');

signinForm.addEventListener('submit', e =>{
    e.preventDefault();
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value
    
    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            signupForm.reset();
            //cerrar el modal
            $('#signupModal').modal('hide');
            console.log('signIn');
        }) 
});

const logout = document.querySelector('#logout');

logout.addEventListener('click', e =>{
    e.preventDefault();

    auth.signOut().then(() => {
        console.log('sign Out');
    })
});
