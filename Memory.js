//Constructor de cartas
function Carta(id, ubi){
    this.id = id;
    this.src = ubi;
}

//Array de fichas, cada una con su id y ruta de imagen
let fichas = [];

fichas.push(new Carta("id1","imatges/S-WEB-Goal-01.png"));
fichas.push(new Carta("id2","imatges/S-WEB-Goal-02.png"));
fichas.push(new Carta("id3","imatges/S-WEB-Goal-03.png"));
fichas.push(new Carta("id4","imatges/S-WEB-Goal-04.png"));
fichas.push(new Carta("id5","imatges/S-WEB-Goal-05.png"));
fichas.push(new Carta("id6","imatges/S-WEB-Goal-06.png"));
fichas.push(new Carta("id7","imatges/S-WEB-Goal-07.png"));
fichas.push(new Carta("id8","imatges/S-WEB-Goal-08.png"));
fichas.push(new Carta("id9","imatges/S-WEB-Goal-09.png"));
fichas.push(new Carta("id10","imatges/S-WEB-Goal-10.png"));
fichas.push(new Carta("id11","imatges/S-WEB-Goal-11.png"));
fichas.push(new Carta("id12","imatges/S-WEB-Goal-12.png"));
fichas.push(new Carta("id13","imatges/S-WEB-Goal-13.png"));
fichas.push(new Carta("id14","imatges/S-WEB-Goal-14.png"));
fichas.push(new Carta("id15","imatges/S-WEB-Goal-15.png"));
fichas.push(new Carta("id16","imatges/S-WEB-Goal-16.png"));
fichas.push(new Carta("id17","imatges/S-WEB-Goal-17.png"));

//Variables globales para controlar el tiempo
let timerInterval = null;
let timeElapsed = 0;

//Funcion principal que inicia/reinicia el juego
function juego(){
    let finishMsg = document.getElementById("finishMsg");
    if(finishMsg) {
        finishMsg.parentNode.removeChild(finishMsg);
    }
    let recordsDiv = document.getElementById("records");
    if (recordsDiv) {
        recordsDiv.parentNode.removeChild(recordsDiv);
    }
    let dificultad = document.getElementById("dificultad").value;
    let cartasEnJuego = iniciarJuego(dificultad);
    shuffle(cartasEnJuego);
    agregarElementos(cartasEnJuego);
    timeElapsed = 0;
    if (timerInterval){
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(function(){
        timeElapsed++;
        document.getElementById("timer").innerText = "Tiempo: " + timeElapsed + " s";
    }, 1000);
}

//Funcion de genera el array de cartas a jugar segun la dificultad
function iniciarJuego(dificultad){
    let disponible = fichas.slice();
    let cartasJuego = [];

    for(let i = 0; i < dificultad; i++){
        let randomIndex = Math.floor(Math.random() * disponible.length);
        let cartaSeleccionada = disponible[randomIndex];

        cartasJuego.push(cartaSeleccionada);
        cartasJuego.push(cartaSeleccionada);

        disponible.splice(randomIndex, 1);
    }
    return cartasJuego;
}

//Funcion que mezcla el array de cartas usando el algoritmo de Fisher-Yates
function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//Funcion que crea y añade los elementos div de las cartas en el contenedor "RowCartas"
function agregarElementos(cartas) {
    let rowCartas = document.getElementById("rowCartas");
    rowCartas.innerHTML = "";

    for (let i = 0; i < cartas.length; i++) {
        // Creo columna
        let colDiv = document.createElement("div");
        colDiv.className = "col";

        // Creo la carta
        let cartaDiv = document.createElement("div");
        cartaDiv.className = "card"; // Mantienes tus estilos
        cartaDiv.setAttribute("data-id", cartas[i].id);
        cartaDiv.setAttribute("data-src", cartas[i].src);
        cartaDiv.setAttribute("data-flipped", "false");
        cartaDiv.setAttribute("onclick", "girarCarta(this)");

        // Inserto la carta en la columna, y la columna en la fila
        colDiv.appendChild(cartaDiv);
        rowCartas.appendChild(colDiv);
    }
}

//Funcion que gira una carta al hacer click y hace comprovaciones para mostrarla o no
function girarCarta(cardElement) {
    if (cardElement.getAttribute("data-flipped") === "true") {
        return;
    }
    if (document.querySelectorAll(".card.selected").length >= 2) {
        return;
    }
    // Muestro la imagen de la carta
    cardElement.style.backgroundImage = "url(" + cardElement.getAttribute("data-src") + ")";
    cardElement.style.backgroundSize = "cover";
    cardElement.setAttribute("data-flipped", "true");
    cardElement.classList.add("selected");

    // Si hay 2 cartas seleccionadas, esperar 2 segundos y comprobar
    if (document.querySelectorAll(".card.selected").length === 2) {
        setTimeout(checkMatch, 2000);
    }
}

//Funcion que comprueba si las 2 cartas seleccionadas coinciden
function checkMatch() {
    let selectedCards = document.querySelectorAll(".card.selected");
    if (selectedCards.length < 2) {
        return;
    }

    if (selectedCards[0].getAttribute("data-id") === selectedCards[1].getAttribute("data-id")) {
        selectedCards[0].classList.add("matched");
        selectedCards[1].classList.add("matched");
        selectedCards[0].classList.remove("selected");
        selectedCards[1].classList.remove("selected");
        checkGameFinished();
    } else {
        for (let i = 0; i < selectedCards.length; i++) {
            selectedCards[i].style.backgroundImage = "";
            selectedCards[i].setAttribute("data-flipped", "false");
            selectedCards[i].classList.remove("selected");
        }
    }
}

//Función que comprueba si todas las cartas estan giradas, si es así, para el tiempo, muestra mensaje de completado y actualiza los records
function checkGameFinished(){
    let container = document.getElementById("rowCartas");
    let cards = container.getElementsByClassName("card");
    let finished = true;
    for(let i =0; i < cards.length; i++){
        if(cards[i].getAttribute("data-flipped") !== "true"){
            finished = false;
            break;
        }
    }
    if(finished){
        clearInterval(timerInterval);
        let finishMsg = document.createElement("div");
        finishMsg.id = "finishMsg";
        finishMsg.innerText = "Felicidades! Has completado el memory del ODS en " + timeElapsed + "segundos";
        finishMsg.style.fontSize = "24px";
        finishMsg.style.color = "white";
        document.getElementById("footer").appendChild(finishMsg);
        updateRecords(document.getElementById("dificultad").value, timeElapsed);
    }
}

//Función que actualiza y muestra records de los 3 niveles
function updateRecords(dificultad, time) {
    let levelName;
    if (dificultad === "5") {
        levelName = "Facil";
    } else if (dificultad === "10") {
        levelName = "Media";
    } else if (dificultad === "15") {
        levelName = "Dificil";
    } else {
        levelName = "Desconocido";
    }

    let key = "record_" + levelName;
    let recordAlmacenado = localStorage.getItem(key);

    // Si no existe un record o el nuevo tiempo es menor, se actualiza
    if (!recordAlmacenado || time < parseInt(recordAlmacenado)) {
        localStorage.setItem(key, time.toString());
    }

    // Muestro los records de todos los niveles
    let levels = ["Facil", "Media", "Dificil"];
    let recordsDiv = document.getElementById("records");
    if (!recordsDiv) {
        recordsDiv = document.createElement("div");
        recordsDiv.id = "records";
        recordsDiv.style.position = "absolute";
        recordsDiv.style.right = "10px";
        recordsDiv.style.top = "10px";
        recordsDiv.style.width = "300px";
        document.body.appendChild(recordsDiv);
    }

    let htmlContent = "<div class='card-body'><h3 class='card-title'>Ranking</h3>";
    for (let i = 0; i < levels.length; i++) {
        let lvl = levels[i];
        let storedRec = localStorage.getItem("record_" + lvl);
        htmlContent += "<h4>" + lvl + "</h4>";
        if (storedRec) {
            htmlContent += "<p>" + storedRec + " segundos</p>";
        } else {
            htmlContent += "<p>No hay record</p>";
        }
    }
    htmlContent += "</div>";
    recordsDiv.innerHTML = htmlContent;

    // Si el tiempo actual es el mejor para el nivel actual, su muestra mensaje de nuevo record
    let nuevoRecord = localStorage.getItem(key);
    if (nuevoRecord && parseInt(nuevoRecord) === time) {
        recordsDiv.innerHTML += `<p class='text-success'>¡Nuevo record en nivel ${levelName}!</p>`;
    }
}