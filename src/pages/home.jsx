import React, { useState, useEffect } from "react";
import { Search, Plus, X, Check, Loader2 } from "lucide-react";

// Komponen utama aplikasi
export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk form tambah film
  const [newMovie, setNewMovie] = useState({
    title: "",
    overview: "",
    releaseDate: "",
    posterUrl: "",
  });

  // State untuk validasi form
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // API key - dalam implementasi nyata, ini harus disimpan di environment variables
  const API_KEY = "a1c3a038d24ecf01eb3353d720d24de9";

  // Fungsi untuk mendapatkan daftar film populer
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=id-ID&page=1`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data film");
        }

        const data = await response.json();
        setMovies(data.results);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fungsi pencarian film
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=id-ID&query=${searchQuery}&page=1`
      );

      if (!response.ok) {
        throw new Error("Gagal mencari film");
      }

      const data = await response.json();
      setMovies(data.results);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle perubahan input pencarian
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle tekan Enter pada input pencarian
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle perubahan pada form tambah film
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({
      ...newMovie,
      [name]: value,
    });

    // Reset pesan error untuk field ini
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validasi form tambah film
  const validateForm = () => {
    const errors = {};

    if (!newMovie.title.trim()) {
      errors.title = "Judul film tidak boleh kosong";
    }

    if (!newMovie.overview.trim()) {
      errors.overview = "Deskripsi film tidak boleh kosong";
    }

    if (!newMovie.releaseDate) {
      errors.releaseDate = "Tanggal rilis tidak boleh kosong";
    }

    return errors;
  };

  // Handle submit form tambah film
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validasi form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    // Simulasi pengiriman data ke API
    // Dalam implementasi nyata, ini akan mengirim data ke API
    try {
      // Simulasi delay API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Tambahkan film baru ke daftar (simulasi)
      const newMovieWithId = {
        ...newMovie,
        id: Date.now(), // generate ID sementara
        poster_path: newMovie.posterUrl || null,
      };

      setMovies((prevMovies) => [newMovieWithId, ...prevMovies]);

      // Reset form dan tampilkan pesan sukses
      setNewMovie({
        title: "",
        overview: "",
        releaseDate: "",
        posterUrl: "",
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowAddForm(false);
      }, 2000);
    } catch (err) {
      setError("Gagal menambahkan film");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Database Film</h1>

      {/* Header dengan pencarian dan tombol tambah */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Cari film..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchKeyPress}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={20}
            onClick={handleSearch}
          />
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? "Batal" : "Tambah Film"}
        </button>
      </div>

      {/* Form tambah film */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Tambah Film Baru</h2>

          {submitSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
              <Check size={20} className="mr-2" />
              Film berhasil ditambahkan!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Film
              </label>
              <input
                type="text"
                name="title"
                value={newMovie.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.title ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Rilis
              </label>
              <input
                type="date"
                name="releaseDate"
                value={newMovie.releaseDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.releaseDate ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {formErrors.releaseDate && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.releaseDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Poster (opsional)
              </label>
              <input
                type="url"
                name="posterUrl"
                value={newMovie.posterUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="overview"
                value={newMovie.overview}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.overview ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {formErrors.overview && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.overview}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Film"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Pesan error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={48} className="text-blue-500 animate-spin" />
        </div>
      )}

      {/* Daftar film */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition"
            >
              {/* Poster film */}
              <div className="h-64 bg-gray-200 relative">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Detail film */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("id-ID")
                    : "Tidak ada tanggal"}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {movie.overview || "Tidak ada deskripsi"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pesan tidak ada film */}
      {!loading && movies.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Tidak ada film yang ditemukan</p>
        </div>
      )}
    </div>
  );
}
