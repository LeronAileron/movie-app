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

  async getTopMovies(page = 1) {
    let topMovies = await this.getResource(`/movie/top_rated?language=en-US&page=${page}`, this.options)
    // topMovies = topMovies.results
    // console.log(topMovies)
    return topMovies.results.map(this._transformMovie)
  }

  async getPopularMovies(page = 1) {
    const popularMovies = await this.getResource(`/movie/popular?language=en-US&page=${page}`, this.options)
    // const popularMovies = res.results
    console.log(popularMovies)
    return popularMovies
  }
}
