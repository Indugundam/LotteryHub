document.addEventListener("DOMContentLoaded", () => {
    // Retrieve user details from sessionStorage
    const username = sessionStorage.getItem('username');
    const email = sessionStorage.getItem('email');
    const bio = sessionStorage.getItem('bio');

    // Update welcome message
    const homeSection = document.querySelector("#home h2");
    if (username && homeSection) {
        homeSection.textContent = `Welcome, ${username}!`;
    }

    // Update profile details
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profileBio = document.getElementById("profileBio");

    if (username && profileName && profileEmail && profileBio) {
        profileName.textContent = username;
        profileEmail.textContent = email ? email : "Not Available";
        profileBio.textContent = bio ? bio : "This is a dynamically generated profile.";
    }

    // Results Section - Simulated Loading
    const resultsContainer = document.getElementById('results-container');
    setTimeout(() => {
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                        Gold Jackpot: Ticket #12345<br>
                        Silver Spin: Ticket #67890<br>
                        Bronze Blast: Ticket #11223
                    `;
        }
    }, 2000);

    // Toggle profile details on profile icon click
    const profileIcon = document.getElementById('profileIcon');
    if (profileIcon) {
        profileIcon.addEventListener('click', () => {
            const profileDetails = document.getElementById('profileDetails');
            if (profileDetails.style.display === 'block') {
                profileDetails.style.display = 'none';
            } else {
                profileDetails.style.display = 'block';
            }
        });
    }

    // Function to generate a random ticket code (10 characters: letters and digits)
    function generateTicketCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let ticketCode = '';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            ticketCode += characters[randomIndex];
        }
        return ticketCode;
    }

    // Function to generate a random lottery
    function generateRandomLottery() {
        const lotteryNames = [
            "Gold Jackpot",
            "Silver Spin",
            "Bronze Blast",
            "Diamond Dream",
            "Platinum Prize",
            "Ruby Rush",
            "Emerald Edge",
            "Sapphire Surge"
        ];
        const prizes = [
            "$1,000,000",
            "$500,000",
            "$250,000",
            "$100,000",
            "$50,000",
            "$25,000",
            "$10,000",
            "$5,000"
        ];

        const randomName = lotteryNames[Math.floor(Math.random() * lotteryNames.length)];
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];

        return {
            name: randomName,
            prize: randomPrize
        };
    }

    // Function to add a new lottery card to the DOM
    function addLotteryCard(lottery) {
        const lotteryList = document.querySelector('.lottery-list');
        if (lotteryList) {
            const lotteryCard = document.createElement('div');
            lotteryCard.classList.add('lottery-card');
            lotteryCard.innerHTML = `
                <h3>${lottery.name}</h3>
                <p>Prize: ${lottery.prize}</p>
                <button class="join-btn">Join Now</button>
            `;
            lotteryList.appendChild(lotteryCard);

            // Add event listener to the new "Join Now" button
            const joinButton = lotteryCard.querySelector('.join-btn');
            joinButton.addEventListener('click', (event) => {
                const lotteryCard = event.target.closest('.lottery-card');
                const lotteryName = lotteryCard.querySelector('h3').textContent;
                const lotteryPrize = lotteryCard.querySelector('p').textContent;

                // Generate a random ticket code
                const ticketCode = generateTicketCode();

                // Store lottery details in sessionStorage
                sessionStorage.setItem('lotteryName', lotteryName);
                sessionStorage.setItem('ticketCode', ticketCode);
                sessionStorage.setItem('lotteryPrize', lotteryPrize);
                sessionStorage.setItem('drawDate', '2024-12-25'); // Example draw date

                // Redirect to lottery-details.html
                window.location.href = 'lottery-details.html';
            });
        }
    }

    // Function to generate a random delay (in milliseconds)
    function getRandomDelay() {
        const minDays = 1; // Minimum delay: 1 day
        const maxDays = 30; // Maximum delay: 30 days
        const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
        return randomDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    }

    // Function to load existing lotteries from localStorage
    function loadExistingLotteries() {
        const lotteries = JSON.parse(localStorage.getItem('lotteries')) || [];
        lotteries.forEach(lottery => {
            addLotteryCard(lottery);
        });
    }

    // Function to schedule the next lottery addition
    function scheduleNextLottery() {
        const nextLotteryTime = localStorage.getItem('nextLotteryTime');
        const currentTime = new Date().getTime();

        if (nextLotteryTime && currentTime < nextLotteryTime) {
            // If a scheduled time exists and it's in the future, wait until then
            const delay = nextLotteryTime - currentTime;
            setTimeout(() => {
                const newLottery = generateRandomLottery();
                addLotteryCard(newLottery);

                // Save the new lottery to localStorage
                const lotteries = JSON.parse(localStorage.getItem('lotteries')) || [];
                lotteries.push(newLottery);
                localStorage.setItem('lotteries', JSON.stringify(lotteries));

                // Schedule the next lottery
                scheduleNextLottery();
            }, delay);
        } else {
            // If no scheduled time exists or it's in the past, add a lottery immediately
            const newLottery = generateRandomLottery();
            addLotteryCard(newLottery);

            // Save the new lottery to localStorage
            const lotteries = JSON.parse(localStorage.getItem('lotteries')) || [];
            lotteries.push(newLottery);
            localStorage.setItem('lotteries', JSON.stringify(lotteries));

            // Schedule the next lottery
            const delay = getRandomDelay();
            const newNextLotteryTime = currentTime + delay;
            localStorage.setItem('nextLotteryTime', newNextLotteryTime);

            setTimeout(() => {
                scheduleNextLottery();
            }, delay);
        }
    }

    // Load existing lotteries when the page loads
    loadExistingLotteries();

    // Start scheduling lotteries
    scheduleNextLottery();
});