console.log('hello');

const dentrolinks = document.querySelectorAll('.dentro')
const fueralinks = document.querySelectorAll('.fuera')


//Cerrar sesion
function cerrar(){
    auth.signOut().then(() => {
        console.log('sign Out');
    })
}


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

const saveUser = (infoUser) =>{
    fs.collection("usuariosNuevos").add({
        infoUser
    })
    .then(function(docRef){
        MENSAJE_OK();
        console.log("Documento escrito en el id: ",docRef.id);
    })
    .catch(function(error){
        MENSAJE_ERROR();
        console.log("Error añadiendo el documento",error);
    })
}

async function registrarUsuario(email, password, name, lastName, cel, rol) {
    const infoUsuario = await auth.createUserWithEmailAndPassword(
      email,
      password
    ).then((usuarioFirebase) => {
        var user = firebase.auth().currentUser;
        user.updateProfile({
         displayName: name
        }).then(function() {
            // Update successful.
        }, function(error) {
            // An error happened.
        });
        //console.log(infoUsuario.user);
        console.log(usuarioFirebase);
        const unicoid = usuarioFirebase.user.uid;
        const usuario = {
            unicoid,
            name,
            lastName,
            cel,
            rol
        }
        saveUser(usuario)
    });
    
    function verificar() {
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function () {
            console.log("// Email sent.");
            cerrar()
            console.log("------------USUARIO CERRADO")
            MENSAJE_OK();
        }).catch(function (error) {
            // An error happened.
        });
    };
    verificar();
}
//SignUp
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#signup-name').value;
    const lastName = document.querySelector('#signup-lastName').value;
    const cel = document.querySelector('#signup-numCel').value;
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
        registrarUsuario(email, password, name, lastName, cel, rol);
        $('#signupModal').modal('hide');
        console.log('signup');
        console.log('amigo.edu.co');
        console.log(rol);       
      } else {
        console.log('incorrecto');
      }
});

//SignIn

function checkRol(){

    const ROL = data =>{
        if(data.length) {
            var userNew = firebase.auth().currentUser;
            console.log(userNew);
            uid = userNew.uid;
            data.forEach(doc => {
                const rolUsuario = doc.data()
                console.log(rolUsuario)
                if(uid == rolUsuario.infoUser.unicoid){
                    verificado = rolUsuario.infoUser.rol;
                }
            });
        }
        if(verificado == "Conductor"){
            window.location.href = './driver.html'
        }else{
            window.location.href = './traveler.html'
        }
    }

    fs.collection('usuariosNuevos')
                .get()
                .then((snapshot) => {
                   ROL(snapshot.docs)
                })
}


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
            //Verificar rol para redigir a pagina
            checkRol();
            //cerrar el modal
            $('#signupModal').modal('hide');
            console.log('signIn');
        }) 
});

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

//MENSAJES DE ALERTA BASE DE DATOS

const MENSAJE_OK =()=>{
    Swal.fire(
        'Registrado exitosamente!',
        'Verifica la cuenta en tu correo electronico para Iniciar sesión',
        'success'
      )
}

const MENSAJE_ERROR =()=>{
    Swal.fire(
        'Oops!',
        'Los datos no fueron guardados',
        'error'
      )
}