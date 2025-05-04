import React, { useState, useEffect } from "react";

export default function MovieApiExplorer() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMovie, setActiveMovie] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState("popular");
  const [language, setLanguage] = useState("id-ID");
  const [page, setPage] = useState(1);

  // API key
  const API_KEY = "a1c3a038d24ecf01eb3353d720d24de9";

  // Available endpoints
  const endpoints = [
    { id: "popular", name: "Popular" },
    { id: "top_rated", name: "Top Rated" },
    { id: "now_playing", name: "In Theaters" },
    { id: "upcoming", name: "Coming Soon" },
  ];

  // Available languages
  const languages = [
    { id: "id-ID", name: "Indonesia" },
    { id: "en-US", name: "English (US)" },
    { id: "ja-JP", name: "Japanese" },
    { id: "ko-KR", name: "Korean" },
  ];

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${apiEndpoint}?api_key=${API_KEY}&language=${language}&page=${page}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch movies: ${response.status}`);
        }

        const data = await response.json();
        setMovies(data.results || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [apiEndpoint, language, page]);

  // Function to get full movie details
  const fetchMovieDetails = async (movieId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${language}&append_to_response=credits,videos,images,recommendations,similar,reviews,keywords`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch movie details: ${response.status}`);
      }

      const data = await response.json();
      setActiveMovie(data);
      setLoading(false);

      // Scroll to top when viewing movie details
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Reset active movie
  const closeMovieDetails = () => {
    setActiveMovie(null);
  };

  // Handle refresh button
  const handleRefresh = () => {
    setLoading(true);
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${apiEndpoint}?api_key=${API_KEY}&language=${language}&page=${page}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch movies: ${response.status}`);
        }

        const data = await response.json();
        setMovies(data.results || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  };

  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-4">
        {/* Mobile endpoints navigation */}
        <div className="d-md-none mb-4">
          <div className="nav nav-pills flex-nowrap overflow-auto pb-2">
            {endpoints.map((endpoint) => (
              <button
                key={endpoint.id}
                onClick={() => {
                  setApiEndpoint(endpoint.id);
                  setActiveMovie(null);
                }}
                className={`nav-link flex-shrink-0 ${
                  apiEndpoint === endpoint.id
                    ? "active bg-primary"
                    : "text-dark"
                }`}
              >
                {endpoint.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Card */}
        <div className="card shadow-sm border-0 rounded-3 mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="d-flex align-items-center">
                  <label className="me-2 text-secondary fw-medium">Page:</label>
                  <div className="input-group">
                    <button
                      className="page-link"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={page}
                      onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                      className="form-control text-center"
                    />
                    <button
                      className="page-link page-item"
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 d-md-none mb-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="form-select"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3 mb-md-0 d-flex justify-content-md-center">
                <button onClick={handleRefresh} className="btn btn-primary">
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </button>
              </div>
              <div className="col-md-4 d-flex justify-content-md-end">
                {movies?.length > 0 && (
                  <small className="text-muted">
                    Showing {movies.length}{" "}
                    {movies.length === 1 ? "result" : "results"}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Active Movie Details */}

        {!loading && activeMovie && (
          <div className="card border-0 shadow rounded-3 overflow-hidden mb-5">
            <button
              onClick={closeMovieDetails}
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              aria-label="Close details"
            ></button>

            <div className="card-body pt-md-5 pb-4">
              <div className="row">
                <div className="col-12 d-md-none mb-4">
                  <div className="text-center">
                    <div className="border border-2 shadow-sm rounded d-inline-block">
                      {activeMovie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w342${activeMovie.poster_path}`}
                          alt={activeMovie.title}
                          className="rounded img-fluid"
                          style={{ maxHeight: "300px" }}
                        />
                      ) : (
                        <div
                          className="bg-light d-flex align-items-center justify-content-center text-secondary"
                          style={{ width: "200px", height: "300px" }}
                        >
                          No Poster
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-9 offset-md-3">
                  {/* Synopsis */}
                  <div className="mb-5">
                    <h3 className="fw-bold text-primary mb-3">Synopsis</h3>
                    <p className="lead">
                      {activeMovie.overview || "No synopsis available."}
                    </p>
                  </div>

                  {/* Showtimes */}
                  <div className="mb-5">
                    <h3 className="fw-bold text-primary mb-3">Showtimes</h3>
                    <div className="d-flex flex-wrap">
                      {[...Array(8)].map((_, i) => (
                        <button
                          key={i}
                          className="btn btn-outline-dark me-2 mb-2"
                        >
                          {String(10 + i * 2).padStart(2, "0")}:
                          {String(Math.floor(Math.random() * 60)).padStart(
                            2,
                            "0"
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="details-tab">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-primary fw-bold">API Data</h4>
                        <span className="badge bg-secondary">
                          {Object.keys(activeMovie).length} variables
                        </span>
                      </div>
                      {/* JSON Data */}
                      <div className="card bg-light">
                        <div className="card-body">
                          <pre
                            className="mb-0 text-secondary small"
                            style={{ maxHeight: "300px", overflow: "auto" }}
                          >
                            {JSON.stringify(activeMovie, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movie Grid */}
        <div className="row row-cols-3 g-3">
          {movies.map((movie) => (
            <div key={movie.id} className="col">
              <div
                className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden transition-transform hover-lift cursor-pointer"
                onClick={() => fetchMovieDetails(movie.id)}
              >
                <div className="position-relative">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="card-img-top object-fit-cover"
                      style={{ height: "300px" }}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-light text-secondary"
                      style={{ height: "300px" }}
                    >
                      <i
                        className="bi bi-film"
                        style={{ fontSize: "2rem" }}
                      ></i>
                    </div>
                  )}

                  {/* Rating badge */}
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-warning text-dark d-flex align-items-center shadow-sm">
                      <i className="bi bi-star-fill me-1"></i>
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>

                  {/* Now showing ribbon */}
                  {movie.release_date &&
                    new Date(movie.release_date) <= new Date() && (
                      <div className="position-absolute bottom-0 start-0 end-0 py-1 bg-dark bg-opacity-75 text-center">
                        <small className="text-white text-uppercase fw-bold">
                          Now Showing
                        </small>
                      </div>
                    )}
                </div>

                <div className="card-body">
                  <h5 className="card-title fw-bold text-truncate mb-1">
                    {movie.title}
                  </h5>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "Coming Soon"}
                    </small>
                  </div>
                  <p
                    className="card-text small text-secondary mb-3 line-clamp-3"
                    style={{ minHeight: "4.5rem" }}
                  >
                    {movie.overview || "No description available"}
                  </p>
                  <button
                    className="btn btn-sm btn-primary w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchMovieDetails(movie.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-5 mt-auto">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <h4 className="fw-bold mb-3">TMDb API Explorer</h4>
              <p className="mb-0 text-secondary">
                A modern interface to explore The Movie Database API.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-1">
                Data provided by{" "}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-decoration-none"
                >
                  The Movie Database (TMDb)
                </a>
              </p>
              <p className="text-secondary mb-0">
                © {new Date().getFullYear()} TMDb API Explorer
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
