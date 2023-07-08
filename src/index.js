/* eslint-disable quotes */
import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import MovieService from './services/moviedb'
import MoviesLayout from './components/movies-layout'
import Error from './components/error'
import Spinner from './components/spinner'
import checkConnected from './functions/check-connected'

checkConnected
class App extends React.Component {
  movieResource = new MovieService()

  state = {
    error: null,
    isLoaded: false,
    movies: [],
    page: 5,
    internetConnection: true,
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      movies,
      isLoaded: true,
    })
  }

  onChangeConnectionStatus = () => {
    this.setState(({ internetConnection }) => ({
      internetConnection: !internetConnection,
    }))
  }

  componentDidMount() {
    const { page } = this.state
    this.movieResource.getTopMovies(page).then(this.onMoviesLoaded, (error) => {
      this.setState({
        isLoaded: true,
        error,
      })
    })
  }

  render() {
    const { error, isLoaded, movies, internetConnection } = this.state
    console.log(this.state)

    checkConnected(this.onChangeConnectionStatus, internetConnection)

    if (!internetConnection) {
      return <Error message="You're offline right now. Check your connection." />
    }

    const errorHere = error ? <Error message={error.message} type="warning" /> : null
    const spinner = !isLoaded ? <Spinner /> : null
    const content = isLoaded && !error ? <MoviesLayout movies={movies} /> : null

    return (
      <>
        {errorHere}
        {spinner}
        {content}
      </>
    )
  }
}

const elem = <App />

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(elem)

// const CheckConnected = ({ onChangeConnectionStatus }) => {
// window.ononline = () => {
//   onChangeConnectionStatus()
// }

// window.onoffline = () => {
//   onChangeConnectionStatus()
// }
// }
