const cardsContainer = document.querySelector(".cards");
const picturesURL = ["img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/5.png", "img/6.png",
	"img/7.png", "img/8.png", "img/9.png", "img/10.png", "img/11.png", "img/12.png",
	"img/13.png", "img/14.png", "img/15.png", "img/16.png", "img/17.png"];
const deck = [...picturesURL, ...picturesURL];
const cardCount = deck.length;

// Game state
let revealedCount = 0;
let activeCard = null;
let awaitingEndOfMove = false;
let coinSound = new Audio("sound/coin.wav");
//test

function buildCard(picturesURL) {
	const element = document.createElement("div");

	element.classList.add("card");
	element.setAttribute("data-img", picturesURL);
	element.setAttribute("data-revealed", "false");

	element.addEventListener("click", () => {
		const revealed = element.getAttribute("data-revealed");

		if (
			awaitingEndOfMove
			|| revealed === "true"
			|| element == activeCard
		) {
			return;
		}

		element.style.backgroundImage = `url(${picturesURL})`;

		if (!activeCard) {
			activeCard = element;

			return;
		}

		const pictureToMatch = activeCard.getAttribute("data-img");

		if (pictureToMatch === picturesURL) {
			element.setAttribute("data-revealed", "true");
			activeCard.setAttribute("data-revealed", "true");

			activeCard = null;
			awaitingEndOfMove = false;
			revealedCount += 2;
			if (revealedCount < 10) {
				score.innerHTML = "0" + revealedCount;
				coinSound.play();
			}
			else {
				score.innerHTML = revealedCount;
				coinSound.play();
			}


			if (revealedCount === cardCount) {
				clearInterval(timerInterval);
				const finalTime = timer.innerHTML.slice(2);
				alert(`You win! Your time was ${finalTime}. Refresh to start again.`);
			}

			return;
		}

		awaitingEndOfMove = true;

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
		for (let i = 0; i < cardCount; i++) {
			const randomIndex = Math.floor(Math.random() * deck.length);
			const picture = deck[randomIndex];
			const card = buildCard(picture);

			deck.splice(randomIndex, 1);
			cardsContainer.appendChild(card);
		}

		//add timer that counts up in seconds and minutes
		let seconds = 0;
		let minutes = 0;
		let timer = document.createElement("div");
		timer.setAttribute("id", "timer");
		timer.innerHTML = "&#128341;00:00";
		document.body.appendChild(timer);

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