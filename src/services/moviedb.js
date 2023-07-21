export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3'

  getOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzM0YWZiYTA1ODgwMTlhNDZiMjA3MGRhOTRlN2EyZSIsInN1YiI6IjY0YTI2OGMzZDQwMGYzMDEyZDQzOTA2MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NElFJCVmcFSs5ZLxn4mVYyJSjYWdp7mnYrb_mL23s64',
    },
  }

  apiKey = '1c34afba0588019a46b2070da94e7a2e'

  _transformMovie(movie) {
    return {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      date: movie.release_date,
      overview: movie.overview,
      currentRating: movie.vote_average,
      genreIds: movie.genre_ids,
    }
  }

  async getResource(url, options) {
    const res = await fetch(`${this._apiBase}${url}`, options || this.getOptions)

    if (!res.ok) {
      throw new Error(`Данные не загружены. Код ошибки ${res.status}`)
    }
    return await res.json()
  }

  async getMovies(query = 'popular', page = 1) {
    if (query === 'top') query = 'top_rated'
    let movies = await this.getResource(`/movie/${query}?language=en-US&page=${page}`)
    return this.getMoviesAndPages(movies)
  }

  async searchMovies(searchQuery, page = 1) {
    let movies = await this.getResource(`/search/movie?query=${searchQuery}&language=en-US&page=${page}`)
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

  async createGuestSession() {
    const url = `${this._apiBase}/authentication/guest_session/new`
    const res = await fetch(url, this.getOptions)

    if (!res.ok) {
      console.log('не получилось создать гостевую сессию')
    }
    return await res.json()
  }

  async getRatedMovies(guestSessionId) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
    const ratedMovies = await this.getResource(
      `/guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}`,
      options
    )

    return this.getMoviesAndPages(ratedMovies)
  }

  async rateMovie(rating, movieId, guestSessionId) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rating }),
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`,
      options
    )
    if (!res.ok) {
      console.log(`Не удается поставить оценку. Код ошибки ${res.status}`)
    }
    const result = await res.json()
    return result
  }

  async getGenres() {
    const genresToFormat = await this.getResource('/genre/movie/list')
    const genres = genresToFormat.genres
    return genres
  }
}
