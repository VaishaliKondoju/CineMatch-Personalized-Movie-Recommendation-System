// Load movies on select.html
if (window.location.pathname.includes('select.html')) {
  fetch('/api/movies')
    .then(response => response.json())
    .then(movies => {
      const grid = document.getElementById('movie-grid');
      movies.forEach(movie => {
        const card = `
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${movie.Movie_Title}</h5>
                <p class="card-text">${movie.Director} (${movie.Year}) - ${movie.Genre}</p>
                <input type="checkbox" class="movie-checkbox" value="${movie.movieID}">
              </div>
            </div>
          </div>
        `;
        grid.innerHTML += card;
      });

      // Search functionality
      document.getElementById('search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
          const title = card.querySelector('.card-title').textContent.toLowerCase();
          const director = card.querySelector('.card-text').textContent.toLowerCase();
          card.parentElement.style.display = (title.includes(query) || director.includes(query)) ? '' : 'none';
        });
      });

      // Submit button
      document.getElementById('submit-btn').addEventListener('click', () => {
        const selectedIds = Array.from(document.querySelectorAll('.movie-checkbox:checked'))
          .map(cb => parseInt(cb.value));
        if (selectedIds.length === 0) {
          alert('Please select at least one movie!');
          return;
        }
        fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movie_ids: selectedIds })
        })
          .then(response => response.json())
          .then(recommendations => {
            localStorage.setItem('recommendations', JSON.stringify(recommendations));
            window.location.href = '/static/recommendations.html';
          });
      });
    });
}

// Load recommendations on recommendations.html
if (window.location.pathname.includes('recommendations.html')) {
  const recommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
  const grid = document.getElementById('recommendation-grid');
  if (recommendations.length === 0) {
    grid.innerHTML = '<p class="text-light">No recommendations available. Please select movies first.</p>';
  } else {
    recommendations.forEach(movie => {
      const card = `
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${movie.Movie_Title}</h5>
              <p class="card-text">${movie.Director} (${movie.Year}) - ${movie.Genre}</p>
            </div>
          </div>
        </div>
      `;
      grid.innerHTML += card;
    });
  }
}