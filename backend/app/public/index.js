var socket = io();

const jugadorsSocket = io("/jugadors");
const missatgesSocket = io("/missatges"); 
const xatsSocket = io("/xats"); 


var formReg = document.getElementById("registre");
var inputReg = document.getElementById("inputregistre");

var form = document.getElementById("form");
var input = document.getElementById("input");

let nomJugador = "";
let xatPrivat = "";


form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(input.value);
  if (input.value) {
    missatgesSocket.emit("chat message", input.value);
    console.log(input.value);
    input.value = "";
  }
});

document.getElementById("registerbutton").addEventListener("click", ()=>{
  console.log(inputReg.value);
  jugadorsSocket.emit("nouJugador", inputReg.value, jugadorsSocket.id, missatgesSocket.id, xatsSocket.id);
  nomJugador = inputReg.value;
})


function prova(){
  setTimeout(() => {
    jugadorsSocket.emit("prova", "Hola aixo es una prova");
    console.log("enviada prova");
  }, 3000);
}
prova();


missatgesSocket.on("chat message", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

//Peticio de conectar-se a un xat privat
document.getElementById("privatxat").addEventListener("click", ()=>{
  let socketinvitacio = document.getElementById("privatsocket").value;
  console.log(socketinvitacio);
  xatsSocket.emit('Peticio', socketinvitacio);
})
//Rebre peticio exterior
xatsSocket.on('Aceptacio parlar', (msg, usuariPeticio) =>{
  console.log('Has rebut peticio de : '+ usuariPeticio);
  document.getElementById("peticiosocket").value = usuariPeticio;
})

//Confirmar peticio exterior
document.getElementById("peticioxat").addEventListener("click", ()=>{
  let invitador = document.getElementById("peticiosocket").value;
  console.log("invitat per: " + invitador);
  xatsSocket.emit('Si accepto', invitador);
  xatPrivat = invitador;
})

//Informat que has sigut acceptat
xatsSocket.on('Acceptat', (invitador)=>{
  document.getElementById("privatsocket").style.backgroundColor = "green";
  xatPrivat = invitador;
})

//Enviar missatge privat
document.getElementById('missatgeprivat').addEventListener("click", ()=>{
  let text = document.getElementById("enviamissatgeprivat").value;
  //let socketRoom = document.getElementById("peticiosocket").value || xatsSocket.id;
  xatsSocket.emit('Missatge privat',xatPrivat, nomJugador, text )
});

//rebre missatge privat
xatsSocket.on('Missatge privat distribuit', (anfitrioRoom, nomMissatger, msg)=>{
  console.log(`Missatge: ${msg}, enviat per ${nomMissatger}, distribuit a la sala socket de ${anfitrioRoom}`);
})

