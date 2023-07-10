export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3'

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzM0YWZiYTA1ODgwMTlhNDZiMjA3MGRhOTRlN2EyZSIsInN1YiI6IjY0YTI2OGMzZDQwMGYzMDEyZDQzOTA2MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NElFJCVmcFSs5ZLxn4mVYyJSjYWdp7mnYrb_mL23s64',
    },
  }

  _transformMovie(movie) {
    return {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      date: movie.release_date,
      overview: movie.overview,
    }
  }

  async getResource(url, options) {
    const res = await fetch(`${this._apiBase}${url}`, options)

    if (!res.ok) {
      console.log(res.statusText)
      throw new Error(`Данные не загружены. Код ошибки ${res.status}`)
    }
    return await res.json()
  }

  async getMovies(query, page = 1) {
    if (query === 'top') query = 'top_rated'
    let movies = await this.getResource(`/movie/${query}?language=en-US&page=${page}`, this.options)
    return this.getMoviesAndPages(movies)
  }

  async searchMovies(searchQuery, page = 1) {
    let movies = await this.getResource(`/search/movie?query=${searchQuery}&language=en-US&page=${page}`, this.options)
    return this.getMoviesAndPages(movies)
  }

  getMoviesAndPages = (movies) => {
    const theMovies = movies.results.map(this._transformMovie)
    const totalPages = movies['total_pages']
    movies = {
      theMovies,
      totalPages,
    }
    return movies
  }
}
