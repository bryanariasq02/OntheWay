console.log('hello');

const dentrolinks = document.querySelectorAll('.dentro')
const fueralinks = document.querySelectorAll('.fuera')

//login Check
const loginCheck = user => {
    if(user){
        dentrolinks.forEach(link => link.style.display = 'block');
        fueralinks.forEach(link => link.style.display = 'none');
    }else{
        dentrolinks.forEach(link => link.style.display = 'none');
        fueralinks.forEach(link => link.style.display = 'block');
    }
}


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
        if (rol == "Pasajero"){
            window.location.href = './traveler.html';
        }
        else{
            window.location.href = './driver.html';
        }
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
            window.location.href = './traveler.html'
            //cerrar el modal
            $('#signupModal').modal('hide');
            console.log('signIn');
        }) 
});

//SignIn With GOOGLE

const googlebutton = document.querySelector('#googleLogin');

// googlebutton.addEventListener('click', e =>{
//     e.preventDefault();

//     const provider = new firebase.auth.GoogleAuthProvider();
//     auth.signInWithPopup(provider)
//         .then(resul => {
//             console.log("entrooo")
//             window.location.href = './traveler.html'

//         })
//         .catch(err => {
//             console.log(err)
//         })

    // const email = document.querySelector('#login-email').value
    // const password = document.querySelector('#login-password').value
    console.log("googleeee")
    // auth
    //     .signInWithEmailAndPassword(email, password)
    //     .then(userCredential => {
    //         signupForm.reset();
    //         const user = userCredential.user;
    //         console.log(user);

    //         //cerrar el modal
    //         $('#signupModal').modal('hide');
    //         console.log('signIn');
    //     }) 
//});

//LOGOUT
const logout = document.querySelector('#logout');

logout.addEventListener('click', e =>{
    e.preventDefault();

    auth.signOut().then(() => {
        console.log('sign Out');
        window.location.href = './index.html';
    })
});


//Viajes disponibles

const listaViajes = document.querySelector('.viajesDisponibles')

const setupViajes = data =>{
    if(data.length) {
        let html = '';
        data.forEach(doc => {
            const viajes = doc.data()
            console.log(viajes)
            const li = `
            <li class="list-group-item list-group-item-action">
                <h5>${viajes.origen}</h5>
                <p>${viajes.destino}</p>
            </li>            
            `;
            html += li;
        });
        listaViajes.innerHTML = html;
    }else{
        listaViajes.innerHTML = `<p class="text-center">Inicia sesion para ver viajes disponibles</p>`
    }
}

//Eventos
//Listar datos para usuarios autenticados

auth.onAuthStateChanged(user => {
    if(user){
        loginCheck(user)
        console.log("iniciado")
        fs.collection('viajesDisponibles')
            .get()
            .then((snapshot) => {
                console.log(snapshot.docs)
                setupViajes(snapshot.docs)
            })
    }else{
        setupViajes([])
        console.log("NADA")
        loginCheck(user)
    }
})