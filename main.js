// main.js

async function rechercherActeur() {
    const query = document.getElementById('search').value;
    const url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Effacer les résultats précédents
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        // Vérifier s'il y a des résultats
        if (data.results && data.results.length > 0) {
            data.results.forEach(actor => {
                const actorCard = document.createElement('div');
                actorCard.classList.add('col-md-4');

                actorCard.innerHTML = `
                    <div class="card">
                        <img src="${actor.profile_path ? 'https://image.tmdb.org/t/p/w300' + actor.profile_path : 'https://via.placeholder.com/300'}" class="card-img-top" alt="${actor.name}">
                        <div class="card-body">
                            <h5 class="card-title">${actor.name}</h5>
                        </div>
                    </div>
                `;

                resultsContainer.appendChild(actorCard);

                // Ajouter un événement de clic pour afficher les détails de l'acteur et sa filmographie
                actorCard.addEventListener('click', function() {
                    afficherDetailsActeur(actor.id);
                });
            });
        } else {
            resultsContainer.innerHTML = `<div class="col-12"><p class="text-center text-muted">Aucun acteur trouvé pour la recherche "${query}".</p></div>`;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

async function afficherDetailsActeur(actorId) {
    const actorUrl = `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}`;
    const filmographyUrl = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}`;

    try {
        // Récupérer les détails de l'acteur
        const actorResponse = await fetch(actorUrl);
        const actorData = await actorResponse.json();

        // Récupérer la filmographie de l'acteur
        const filmographyResponse = await fetch(filmographyUrl);
        const filmographyData = await filmographyResponse.json();

        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Effacer les résultats précédents

        // Afficher les détails de l'acteur
        const actorInfo = document.createElement('div');
        actorInfo.classList.add('col-12');
        actorInfo.innerHTML = `
            <h2>${actorData.name}</h2>
            <p><strong>Date de naissance:</strong> ${actorData.birthday}</p>
            <p><strong>Biographie:</strong> ${actorData.biography || 'Aucune biographie disponible.'}</p>
            <img src="${actorData.profile_path ? 'https://image.tmdb.org/t/p/w300' + actorData.profile_path : 'https://via.placeholder.com/300'}" alt="${actorData.name}" class="img-fluid">
        `;
        resultsContainer.appendChild(actorInfo);

        // Afficher la filmographie
        const filmographyTitle = document.createElement('h3');
        filmographyTitle.textContent = 'Filmographie de l\'acteur';
        resultsContainer.appendChild(filmographyTitle);

        filmographyData.cast.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('col-md-4');

            movieCard.innerHTML = `
                <div class="card">
                    <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : 'https://via.placeholder.com/300'}" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">${movie.release_date}</p>
                    </div>
                </div>
            `;

            resultsContainer.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'acteur ou de la filmographie:', error);
    }
}

// Ajouter un écouteur d'événement pour le bouton de recherche
document.getElementById('button-search').addEventListener('click', rechercherActeur);
