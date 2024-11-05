// main.js

async function searchActor() {
    const query = document.getElementById('search').value;
    const url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Clear previous results
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        // Check if there are results
        if (data.results && data.results.length > 0) {
            data.results.forEach(actor => {
                const actorCard = document.createElement('div');
                actorCard.classList.add('col-md-4');

                actorCard.innerHTML = `
                    <div class="card">
                        <img src="${actor.profile_path ? 'https://image.tmdb.org/t/p/w300' + actor.profile_path : 'https://via.placeholder.com/300'}" class="card-img-top" alt="${actor.name}">
                        <div class="card-body">
                            <h5 class="card-title">${actor.name}</h5>
                            <button onclick="fetchActorDetails(${actor.id})" class="btn btn-primary">Voir détails</button>
                        </div>
                    </div>
                `;

                resultsContainer.appendChild(actorCard);
            });
        } else {
            resultsContainer.innerHTML = `<div class="col-12"><p class="text-center text-muted">Aucun acteur trouvé pour la recherche "${query}".</p></div>`;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

async function fetchActorDetails(actorId) {
    const url = `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}&append_to_response=movie_credits`;

    try {
        const response = await fetch(url);
        const actor = await response.json();

        const actorDetails = `
            <div class="col-12">
                <h2>${actor.name}</h2>
                <p><strong>Biographie :</strong> ${actor.biography || 'Non disponible.'}</p>
                <h4>Filmographie :</h4>
                <ul>
                    ${actor.movie_credits.cast.map(movie => `<li>${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'})</li>`).join('')}
                </ul>
            </div>
        `;

        // Afficher les détails au-dessus des résultats
        document.getElementById('results').innerHTML = actorDetails;

    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'acteur:', error);
    }
}
