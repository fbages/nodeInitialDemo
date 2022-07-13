var socket = io();

const jugadorsSocket = io("/jugadors");
const missatgesSocket = io("/missatges"); 
const xatsSocket = io("/xats"); 


var formReg = document.getElementById("registre");
var inputReg = document.getElementById("inputregistre");

var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(input.value);
  if (input.value) {
    missatgesSocket.emit("chat message", input.value);
    input.value = "";
  }
});

document.getElementById("registerbutton").addEventListener("click", ()=>{
  console.log(inputReg.value);
  jugadorsSocket.emit("nouJugador", inputReg.value, jugadorsSocket.id, missatgesSocket.id, xatsSocket.id);
})



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
  let socketinvitat = document.getElementById("peticiosocket").value;
  console.log("invitat per: " + socketinvitat);
  xatsSocket.emit('Si accepto', socketinvitat);
})

//Informat que has sigut acceptat
xatsSocket.on('Acceptat', ()=>{
  document.getElementById("privatsocket").style.backgroundColor = "green";
})

//Enviar missatge privat
document.getElementById('missatgeprivat').addEventListener("click", ()=>{
  let text = document.getElementById("enviamissatgeprivat").value;
  let socketroom = document.getElementById("peticiosocket").value || xatsSocket.id;
  xatsSocket.emit('Missatge privat', socketroom, text )
});

//rebre missatge privat
xatsSocket.on('Missatge privat reenviat', (socketid, msg)=>{
  console.log("Missatge enviat per "+ socketid, msg);
})

