//väljer ut elementet med klassen cards
const cardsContainer = document.querySelector(".cards");
//skapar en array med bilder som ska användas
const picturesURL = ["img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/5.png", "img/6.png",
	"img/7.png", "img/8.png", "img/9.png", "img/10.png", "img/11.png", "img/12.png",
	"img/13.png", "img/14.png", "img/15.png", "img/16.png", "img/17.png"];
//skapar en array med dubletter av bilderna
const deck = [...picturesURL, ...picturesURL];
const cardCount = deck.length;
const coinSound = new Audio("sound/coin.wav");

// startvärden för spelet
let revealedCount = 0;
let activeCard = null;
let awaitingEndOfMove = false;

//funktion som skapar korten
function buildCard(picturesURL) {
	const element = document.createElement("div");

	//ger korten klassen "card" och sätter attribut för bild och om kortet är uppvänt eller inte
	element.classList.add("card");
	element.setAttribute("data-img", picturesURL);
	element.setAttribute("data-revealed", "false");

	element.addEventListener("click", () => {
		const revealed = element.getAttribute("data-revealed");

		//Inget ska hända om kortet är vänt eller om det är samma som första klicket.
		if (awaitingEndOfMove || revealed === "true" || element == activeCard) {
			return;
		}

		//vänder kortet på kortet
		element.style.backgroundImage = `url(${picturesURL})`;

		//Om null så blir det första första kortet activeCard
		if (!activeCard) {
			activeCard = element;

			return;
		}

		const pictureToMatch = activeCard.getAttribute("data-img");

		//Om korten matchar så blir de kvar annars vänds de tillbaka
		if (pictureToMatch === picturesURL) {
			element.setAttribute("data-revealed", "true");
			activeCard.setAttribute("data-revealed", "true");

			//nollställer activeCard och awaitingEndOfMove
			activeCard = null;
			awaitingEndOfMove = false;
			revealedCount += 2;
			if (revealedCount < 10) {
				//Lägger till en ledande nolla om score < 10
				// för att stämma överens med uppgiften
				score.innerHTML = "0" + revealedCount;
				coinSound.play();
			}
			else {
				score.innerHTML = revealedCount;
				coinSound.play();
			}

			//check för att se om spelet är över
			if (revealedCount === cardCount) {
				clearInterval(timerInterval);
				const finalTime = timer.innerHTML.slice(2);
				alert(`You win! Your time was ${finalTime}. Refresh to start again.`);
			}

			return;
		}

		awaitingEndOfMove = true;

		//Om korten inte matchar så vänds de tillbaka efter 1 sekund
		setTimeout(() => {
			activeCard.style.backgroundImage = null;
			element.style.backgroundImage = null;

			awaitingEndOfMove = false;
			activeCard = null;
		}, 1000);
	});
	return element;
}

const startButton = document.getElementById("memoryBtn");
let gameStarted = false;
let timerInterval;

startButton.addEventListener("click", () => {
	//check så man bara kan starta spelet en gång
	if (gameStarted) {
		return;
	}
	else {
		const score = document.createElement("div");
		score.classList.add("card");
		score.setAttribute("id", "score");
		score.innerHTML = "0" + revealedCount;
		cardsContainer.appendChild(score);

		gameStarted = true;

		//skapar korten och lägger till dem i cardsContainer
		for (let i = 0; i < cardCount; i++) {
			const randomIndex = Math.floor(Math.random() * deck.length);
			const picture = deck[randomIndex];
			const card = buildCard(picture);

			//tar bort kortet från arrayen så att det inte kan användas igen
			deck.splice(randomIndex, 1);
			cardsContainer.appendChild(card);
		}

		//timer ("&#128341;" = klocksymbol)
		let seconds = 0;
		let minutes = 0;
		let timer = document.createElement("div");
		timer.setAttribute("id", "timer");
		timer.innerHTML = "&#128341;00:00";
		document.body.appendChild(timer);

		//funktion som lägger till ledande nolla till minuter och sekunder
		function presentTime(minutes, seconds) {
			if (seconds < 10) {
				seconds = "0" + seconds;
			}
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			return minutes + ":" + seconds;
		}

		timerInterval = setInterval(function () {
			seconds++;
			if (seconds === 60) {
				minutes++;
				seconds = 0;
			}
			timer.innerHTML = "&#128341;" + presentTime(minutes, seconds);
		}
			, 1000);
	}
});