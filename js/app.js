console.log('hello');

//MENSAJES DE ALERTA

const MENSAJE_OK =()=>{
    Swal.fire(
        'Registrado exitosamente!',
        'Verifica la cuenta en tu correo electronico para Iniciar sesión',
        'success'
      )
}

const MENSAJE_OK_VIAJE =()=>{
    Swal.fire(
        'Registrado exitosamente!',
        'El viaje ha sido registrado con exito',
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

const MENSAJE_email =()=>{
    Swal.fire(
        'Oops!',
        'Debes verificar la cuenta en el correo electronico',
        'error'
      )
}

const MENSAJE_INICIAR_SESION =()=>{
    Swal.fire(
        'Oops!',
        'Debes iniciar sesion primero',
        'error'
      )
}

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


//Cerrar sesion
function cerrar(){
    auth.signOut().then(() => {
        console.log('sign Out');
        console.log("------------USUARIO CERRADO");
    });

    auth.onAuthStateChanged(user => {
        if(user){
            loginCheck(user);
        }else{
            loginCheck(user);
        }
    })
}

//verificaremail
function VERIFICAREMAIL(){
    var userNew = firebase.auth().currentUser;
    const emailVerified = userNew.emailVerified;
    console.log(emailVerified);
    if(emailVerified == false){
        auth.signOut();
        MENSAJE_email();
    }else{
        checkRol();
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
    })
    
    function verificar() {
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function () {
            console.log("// Email sent.");
            //cerrar()
            //MENSAJE_OK();
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
            //cerrar el modal
            $('#signinModal').modal('hide');
            console.log('signIn');
        })
        .then(function(){
            VERIFICAREMAIL();
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
                <h5>Origen: ${viajes.datosViaje.origen}</h5>
                <p>Destino: ${viajes.datosViaje.destino}</p>
                <p>Día: ${viajes.datosViaje.dias}</p>
                <p>Horario: ${viajes.datosViaje.horarios}</p>
                <p>Cupos: ${viajes.datosViaje.cupos}</p>
                <a href="https://wa.me/${viajes.datosViaje.numerotel}/?text=Hola!!%20Encontré%20esta%20ruta%20en%20OnTheWay" target="_blank">
                <img src="img/wpp.png" width="50" height="50">
                </a>
            </li>            
            `;
            html += li;
        });
        listaViajes.innerHTML = html;
    }else{
        listaViajes.innerHTML = ` <h2 class="display-5">Para ver las solicitudes disponibles inicia sesión</h2>`
    }
}


//Eventos
//Listar datos para usuarios autenticados

auth.onAuthStateChanged(user => {
    if(user){
        if(user.emailVerified == true){
            loginCheck(user);
            console.log(user);
            console.log("iniciado");
            fs.collection('Viajes')
            .get()
                .then((snapshot) => {
                    console.log(snapshot.docs)
                    setupViajes(snapshot.docs)
                })
        }
    }else{
        setupViajes([])
        console.log("NADA")
        loginCheck(user)
    }
})   

//Guardar datos de viaje
        
const guardarViaje = document.querySelector('#form_register');
        
guardarViaje.addEventListener('submit', e =>{
    e.preventDefault();
    const origen = document.querySelector('#start').value
    const destino = document.querySelector('#destiny').value
    const numerotel = document.querySelector('#number').value
    const cupos = document.querySelector('#cupos').value
    const descripcion = document.querySelector('#descriptions').value
    const dias = document.querySelector('#dias').value
    const horarios = document.querySelector('#horarios').value
            
    console.log(origen, destino, numerotel, descripcion, dias, horarios)
    const datosViaje = {
        origen,
        destino,
        numerotel,
        cupos,
        descripcion,
        dias,
        horarios
        }
    auth.onAuthStateChanged(user => {
        if(user){
            fs.collection("Viajes").add({
                datosViaje
            })
            .then(function(docRef){
                MENSAJE_OK_VIAJE();
                console.log("Documento escrito en el id: ",docRef.id);
            })
            .catch(function(error){
                MENSAJE_ERROR();
                console.log("Error añadiendo el documento",error);
            })
        }else{
            MENSAJE_INICIAR_SESION();
            $('#signinModal').modal();
        }
    })         
})
