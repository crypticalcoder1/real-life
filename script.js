const filmsList = document.getElementById('films');
const movieTitle = document.getElementById('movie-title');
const moviePoster = document.getElementById('movie-poster');
const movieRuntime = document.getElementById('movie-runtime');
const movieShowtime = document.getElementById('movie-showtime');
const movieDescription = document.getElementById('movie-description');
const availableTickets = document.getElementById('available-tickets');
const buyTicketBtn = document.getElementById('buy-ticket-btn');

const API_URL = 'http://localhost:3000/films';

function fetchFilms() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            data.forEach(film => {
                const li = document.createElement('li');
                li.className = 'film item';
                li.textContent = film.title;
                li.dataset.id = film.id;
                li.dataset.ticketsSold = film.tickets_sold; 
                li.dataset.capacity = film.capacity; 
                li.addEventListener('click', () => displayFilmDetails(film));
                filmsList.appendChild(li);
            });
        });
}

function displayFilmDetails(film) {
    movieTitle.textContent = film.title;
    moviePoster.src = film.poster;
    movieRuntime.textContent = `Runtime: ${film.runtime} minutes`;
    movieShowtime.textContent = `Showtime: ${film.showtime}`;
    movieDescription.textContent = film.description;

    const ticketsAvailable = film.capacity - film.tickets_sold;
    availableTickets.textContent = `Available Tickets: ${ticketsAvailable}`;
    
    buyTicketBtn.textContent = ticketsAvailable > 0 ? 'Buy Ticket' : 'Sold Out';
    buyTicketBtn.disabled = ticketsAvailable === 0;

    const currentFilmElement = filmsList.querySelector(`[data-id="${film.id}"]`);
    if (ticketsAvailable === 0) {
        currentFilmElement.classList.add('sold-out');
    } else {
        currentFilmElement.classList.remove('sold-out');
    }
}

buyTicketBtn.addEventListener('click', () => {
    const currentFilmId = filmsList.querySelector('.film.item.selected').dataset.id;
    const currentFilmElement = filmsList.querySelector(`[data-id="${currentFilmId}"]`);
    
    let ticketsSold = parseInt(currentFilmElement.dataset.ticketsSold) + 1;

    if (ticketsSold <= currentFilmElement.dataset.capacity) {
        availableTickets.textContent = `Available Tickets: ${currentFilmElement.dataset.capacity - ticketsSold}`;
        currentFilmElement.dataset.ticketsSold = ticketsSold;

        if (ticketsSold === currentFilmElement.dataset.capacity) {
            buyTicketBtn.textContent = 'Sold Out';
            buyTicketBtn.disabled = true;
            currentFilmElement.classList.add('sold-out');
        }

        // Update the backend
        fetch(`${API_URL}/${currentFilmId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickets_sold: ticketsSold })
        });
    }
});

// Initial fetch for films
fetchFilms();

// Add selected class for the current film
function selectFilm(film) {
    filmsList.querySelectorAll('.film.item').forEach(li => li.classList.remove('selected'));
    const currentFilmElement = filmsList.querySelector(`[data-id="${film.id}"]`);
    currentFilmElement.classList.add('selected');
}
