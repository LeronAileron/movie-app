/* eslint-disable quotes */
import React from 'react'
import { createRoot } from 'react-dom/client'

import MovieService from './services/moviedb'
import './index.css'
import MovieCard from './components/movie-card'

class App extends React.Component {
  movieResource = new MovieService()

  state = {
    error: null,
    isLoaded: false,
    movies: [],
    page: null,
  }

  componentDidMount() {
    this.movieResource.getTopMovies().then(
      (movies) => {
        this.setState({
          isLoaded: true,
          movies: movies.results,
          page: movies.page,
        })
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        })
      }
    )
  }

  render() {
    // const { error, isLoaded, movies, page } = this.state
    const { error, isLoaded, movies } = this.state
    console.log(this.state)
    if (error) {
      return <div className=" main main--error">Ошибка: {error.message}</div>
    } else if (!isLoaded) {
      return <div className="main main--loading">Загрузка...</div>
    } else {
      const movieCards = movies.map((movie) => {
        const { id, title, poster_path, release_date, overview } = movie

        return (
          <MovieCard
            key={id}
            id={id}
            title={title}
            poster_path={poster_path}
            date={release_date}
            description={overview}
          />
        )
      })
      return <main className="main">{movieCards}</main>
    }
  }
}

const elem = <App />

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(elem)
