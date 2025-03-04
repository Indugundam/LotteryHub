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

    // Function to periodically add new lotteries
    function addLotteriesPeriodically() {
        setInterval(() => {
            const newLottery = generateRandomLottery();
            addLotteryCard(newLottery);
        }, 10000); // Add a new lottery every 10 seconds
    }

    // Start adding lotteries periodically
    addLotteriesPeriodically();
});
window.onload = function () {
    let token = localStorage.getItem("authToken");
    if (!token) {
        alert("Access denied! Please login first.");
        window.location.href = "login.html"; // Redirect to login page
    }
};

function logout() {
    localStorage.removeItem("authToken"); // Remove token
    window.location.href = "login.html"; // Redirect to login page
}