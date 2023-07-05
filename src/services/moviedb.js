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

  async getResource(url, options) {
    const res = await fetch(`${this._apiBase}${url}`, options)

    if (!res.ok) {
      throw new Error(`could not fetch ${url}, received status ${res.status}`)
    }
    return await res.json()
  }

  async getTopMovies(page = 1) {
    const topMovies = await this.getResource(`/movie/top_rated?language=en-US&page=${page}`, this.options)
    // const topMovies = res.results
    // console.log(topMovies)
    return topMovies
  }

  async getPopularMovies(page = 1) {
    const res = await this.getResource(`/movie/popular?language=en-US&page=${page}`, this.options)
    const popularMovies = res.results
    return popularMovies
  }
}

// const resource = new MovieService()
// resource.getTopMovies().then((movies) => {
//   movies.forEach((movie) => {
// const movieRequired = {

// }
// console.log(movie)
//   })
// })
