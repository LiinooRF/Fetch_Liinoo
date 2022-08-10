//Variables
let sumadorCartasJugador = 0;
let sumadorCartasCasino = 0;
let contadorCartas= 0;
let carta;
let arrayCartasJugador = [];
let arrayCartasCasino = [];
let usuario = JSON.parse(localStorage.getItem(`usuario`))
let terminaMesa;
let terminaJugador
let primeraVez = true ;

//DOM
const ingreso = document.querySelector (`#ingreso`);
const nombre = document.querySelector (`#nombre`);
const bienvenida = document.querySelector (`#bienvenida`);
const inicio = document.querySelector (`#mensajeInicio`);
const botonInicio = document.querySelector(`#botonInicio`);
const botonReinicio = document.querySelector (`#botonReinicio`);
const cartasCasino = document.querySelector (`#cartasCasino`);
const cartasJugador = document.querySelector (`#cartasJugador`);
const seguirJugando = document.querySelector (`#seguirJugando`);
const botonSi = document.querySelector (`#botonSi`);
const botonNo = document.querySelector (`#botonNo`);
const resultadoFinal = document.querySelector (`#resultadoFinal`);
const botonSeguir = document.querySelector (`#seguir`);
const botonTerminar = document.querySelector (`#terminar`);
//LocalStorage si habia algo guardado anteriormente.
const historialJugadas =JSON.parse(localStorage.getItem(`historialJugadas`)) ||[];
//Clase de los objetos que se almacenarán en el Array
class Jugada {
    constructor (usuario,cantCartas,puntaje){
        this.usuario = usuario;
        this.cantCartas = cantCartas;
        this.puntaje = puntaje;
//por defecto queda como que el usuario perdió
        this.resultado="Se retiró";
        this.resumen
    }

//Metodo que se fija si el Usuario perdio o no, hay que ejecutar antes de guardar en el array
    esLiinooJack() {
        if (this.puntaje === 21){
        this.resultado = "¡Ganó!";
        }
        else if (this.puntaje >= 21){
            this.resultado = "No hizo LiinooJack";
        };
    };
    jugadas () {
        return `${this.usuario} sacó ${this.cantCartas} cartas, sumó ${this.puntaje} y ${this.resultado}`;
    }
};

const cargaJugada = (u, contCard, sumCard) => {
    //Se crea un objeto con los datos de la jugada
const jugada1 = new Jugada (u, contCard, sumCard);
//Se llama al método para guardar si se ganó o no
jugada1.esLiinooJack();
jugada1.resumen = jugada1.jugadas();
//Se guarda el objeto en el array
historialJugadas.push (jugada1);
//Se guarda el historial el el LocalStorage
localStorage.setItem('historialJugadas', JSON.stringify(historialJugadas));
};

const borrarCartas = () => {
    cartasJugador.innerHTML = ``;
    cartasCasino.innerHTML= ``;
}


//Función que realiza el informe final del total de las partidas
const informeFinal = (informe)=> {
    //Se muestra el Array en la consola con el historial de los juegos que el jugador realizó consecutivamente
//Se cuenta cuantas veces el jugador ganó y se informa
const tituloHistorial = document.querySelector (`#rondas`);
tituloHistorial.innerHTML = (`Historial de Jugadas: `);
const jugadas = document.querySelector (`#jugadas`);
for (element of informe) {
    let jugada = document.createElement (`li`);
    jugada.innerHTML = `En esta jugada ${element.resumen}`
    jugadas.append(jugada);
}
//Se filtran las partidas ganadas, se guardan en un array y se contabilizan
const ganadas = informe.filter(jugada => jugada.puntaje === 21);
const ganados = document.querySelector (`#ganados`);
const cuentaJuegos = document.createElement (`p`);
cuentaJuegos.innerHTML = `Ganaste ${ganadas.length} juego/s`;
ganados.append (cuentaJuegos);
//Se suman todos los puntajes de las jugadas, se guardan en un array y se informan
const totalPuntaje = informe.reduce((total, jugada) => total + jugada.puntaje,0);
const muestraPuntaje = document.createElement (`h3`);
muestraPuntaje.innerHTML = `Sumaste ${totalPuntaje} puntos`;
ganados.append (muestraPuntaje);
}
//Función para determinar si se termina el juego o no. 
const terminar = () =>{
    botonSeguir.style.display= "inline";
    botonTerminar.style.display= "inline";
    botonSeguir.onclick = () => {
        borrarCartas();
        botonTerminar.style.display= "none";
        botonSeguir.style.display="none";
        ingreso.style.display = "block";
        bienvenida.innerHTML =``;
        seguirJugando.innerHTML= ``;
        resultadoFinal.innerHTML= ``;
        bienvenidaUsuario();
    }
    botonTerminar.onclick = () => {
        Swal.fire({
            title: 'Estás seguro que querés terminar el juego?',
            icon: 'warning',
            background: '#335918',
            color: '#fff', 
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, quiero terminar!',
            cancelButtonText: 'No, quiero seguir jugando!'
            
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Adiós',
                    text: 'Nos vemos la próxima.',
                    icon: 'success', 
                    background: '#335918',
                    color: '#fff',
                    }
                )
                informeFinal (historialJugadas);
                botonTerminar.style.display= "none";
                botonSeguir.style.display="none";
            }
        }) 
        
    }       
}
//Funcion que Imprime Carta
const imprimeCarta = (card) => {
    const contenedorCarta = document.createElement (`div`);
    contenedorCarta.classList.add (`contenedorCarta`)
    contenedorCarta.id = `contenedorCarta`;
    contenedorCarta.innerHTML = `
    <div id="carta" class="marcoCarta">
    <div class="fondoCarta">
        <div class="fondoNumero">
            <h3 class="numeroCarta">${carta}</h3>
        </div>
    </div>
    </div>`
    return contenedorCarta
}

//Función para ver si el jugador se retira o no.
const retira = (sumavos, sumamesa) => {
        seguirJugando.innerHTML =  `<p>Tenés ${sumavos} puntos, la casa tiene ${sumamesa}, querés sacar otra carta? </p>`
        botonSi.style.display = "inline";
        botonNo.style.display = "inline";
       // let retirar;
    //    while (retirar) {
            botonSi.onclick = () => {
                botonSi.style.display = "none";
                botonNo.style.display = "none";
                juego();
                };
            botonNo.onclick = () => {
                botonSi.style.display = "none";
                botonNo.style.display = "none";
                while (sumamesa < 17){
                    carta = Math.floor((Math.random()*10)+1);
                    cartasCasino.appendChild (imprimeCarta(carta));
                    sumamesa = carta + sumamesa
                    arrayCartasCasino.push (carta);                    
                }
                seguirJugando.innerHTML =  `<p>Tenés ${sumavos} puntos, la casa sacó ${sumamesa}</p>`
                const resultado = LiinooJack(sumavos, sumamesa);
                resultadoFinal.innerHTML = `<h3>${resultado}</h3>`;
                cargaJugada(usuario, contadorCartas, sumadorCartasJugador)
                
                contadorCartas = 0;
                sumadorCartasJugador = 0;
                sumadorCartasCasino = 0;
                terminar();
            };   
      //  }
};


//Función para decir si se ganó o no
const LiinooJack = (sumaJugador, sumaCasa)=> { 
    seguirJugando.innerHTML =  `<p>Sacaste ${sumaJugador} puntos, la casa tiene ${sumaCasa} puntos</p>` 
    if (sumaJugador>21)
        return "¡Perdiste!"
    else if ((sumaJugador===21) && (sumaCasa !== 21) ) 
        return "¡Ganaste! ¡Liinoo Jack!";
    else if ((sumaJugador===21) && (sumaCasa === 21)) 
        return "¡Empate!";
    else if ((sumaJugador !== 21) && (sumaCasa === 21))
        return "¡Perdiste!";
    else if ((sumaJugador<21) && (sumaCasa > 21)) 
        return "¡Ganaste!";
    else if (sumaJugador>sumaCasa)
        return "¡Ganaste!";
    else 
        return "¡Perdiste!";
};




//Funcion que genera el boton de inicio del juego
const inicioJuego = () => {
    inicio.innerHTML = `Para empezar el Juego, hace click en el botón <b>Empezar</b>`;
    botonInicio.style.display = "block";
}

//Funcion que inicializa el juego
const bienvenidaUsuario = () => {
    if (!!usuario){
        bienvenida.innerHTML = `Bienvenid@ ${usuario}!`;
        ingreso.style.display = "none";  
        inicioJuego ();
    }
    else {
        ingreso.onsubmit = (e) => {
            e.preventDefault ();
            usuario = nombre.value;
            localStorage.setItem('usuario', JSON.stringify(usuario));
            bienvenida.innerHTML = `Bienvenid@ ${usuario}!`;
            ingreso.style.display = "none";
            inicioJuego ();
        }
    }
}

//Funcion del Juego 
const juego = ()=> {
    if (primeraVez){
        carta = Math.floor((Math.random()*10)+1);
        cartasCasino.appendChild (imprimeCarta(carta));
        sumadorCartasCasino = carta + sumadorCartasCasino
        arrayCartasCasino.push (carta);
        carta = Math.floor((Math.random()*10)+1);
        cartasJugador.appendChild (imprimeCarta(carta));
        arrayCartasJugador.push (carta);
        contadorCartas ++;
        sumadorCartasJugador = carta + sumadorCartasJugador;
        primeraVez = false;
    }
    if (sumadorCartasCasino<=17) {
        carta = Math.floor((Math.random()*10)+1);
        cartasCasino.appendChild (imprimeCarta(carta));
        sumadorCartasCasino = carta + sumadorCartasCasino
        arrayCartasCasino.push (carta);
    }
    if (terminaJugador){
        carta = Math.floor((Math.random()*10)+1);
        cartasJugador.appendChild (imprimeCarta(carta));
        arrayCartasJugador.push (carta);
        contadorCartas ++;
        sumadorCartasJugador = carta + sumadorCartasJugador;
    }
    if (sumadorCartasJugador >= 21 ){
        resultado = LiinooJack(sumadorCartasJugador, sumadorCartasCasino);
        resultadoFinal.innerHTML = `<h3>${resultado}</h3>`;
        cargaJugada(usuario, contadorCartas, sumadorCartasJugador);
        contadorCartas = 0;
        sumadorCartasJugador = 0;
        sumadorCartasCasino = 0;
        primeraVez = true;
        terminar();
        return;
    }
    retira(sumadorCartasJugador, sumadorCartasCasino);           
} 

//Programa principal
bienvenidaUsuario ();
botonInicio.onclick = () => {
    inicio.innerHTML = "";
    botonInicio.style.display = "none";
        terminaJugador = true;
        terminaMesa = true;
        juego ();    
    arrayCartasCasino = [];
    arrayCartasJugador = [];

};