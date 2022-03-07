console.log('hello');

async function registrarUsuario(email, password, rol) {
    const infoUsuario = await auth.createUserWithEmailAndPassword(
      email,
      password
    ).then((usuarioFirebase) => {
      return usuarioFirebase;
    });
    console.log(infoUsuario.user.uid);
    console.log(infoUsuario);
    
    //const docuRef = fs.doc(fs, 'usuarios/${infoUsuario.user.uid}');
    //fs.setDoc(docuRef, {correo: email, rol: rol});
}
//SignUp
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;
    const check = document.getElementById('toggle');
    var rol = "Conductor";
    if(check.checked == false){
        rol = "Pasajero"
    }
    console.log(email, rol);
    emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((amigo.edu.co))/;
    if (emailRegex.test(email)) {
        registrarUsuario(email, password, rol);
        $('#signupModal').modal('hide');
        console.log('signup');
        console.log('amigo.edu.co');
        console.log(rol);
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
            const user = userCredential.user;
            console.log(user);
            //cerrar el modal
            $('#signupModal').modal('hide');
            console.log('signIn');
        }) 
});

//SignIn With GOOGLE

const signinFor = document.querySelector('#login-form');

signinForm.addEventListener('submit', e =>{
    e.preventDefault();
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value
    
    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            signupForm.reset();
            const user = userCredential.user;
            console.log(user);
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
