/* eslint-disable quotes */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Offline, Online } from 'react-detect-offline'

import './index.css'
import MovieService from './services/moviedb'
import MoviesLayout from './components/movies-layout'
import Error from './components/error'
import Spinner from './components/spinner'
import Search from './components/search'
import Footer from './components/footer'

class App extends React.Component {
  movieResource = new MovieService()

  state = {
    error: null,
    searchError: false,
    isLoaded: false,
    movies: [],
    page: 1,
    totalPages: null,
    isSearching: false,
  }

  componentDidMount() {
    this.loadMovies()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.page !== prevState.page) {
      if (!this.state.isSearching) this.loadMovies()
    }
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      movies: movies.theMovies,
      totalPages: movies.totalPages,
      isLoaded: true,
      searchError: false,
    })
  }

  onErrorWhenLoaded = (error) => {
    this.setState({
      isLoaded: true,
      error,
    })
  }

  noResultsError = () => {
    this.setState({
      searchError: true,
    })
  }

  showNotSpinner = () => {
    this.setState(({ isLoaded }) => ({
      isLoaded: !isLoaded,
    }))
  }

  loadMovies = () => {
    this.showNotSpinner()
    const { page } = this.state
    this.movieResource.getMovies('popular', page).then(this.onMoviesLoaded, this.onErrorWhenLoaded)
  }

  onPaginationChange = (pagPage) => {
    this.setState({
      page: pagPage,
    })
  }

  setFirstPage = () => {
    this.setState({ page: 1 })
  }

  onToggleSearching = () => {
    this.setState(({ isSearching }) => ({ isSearching: !isSearching }))
  }

  render() {
    const { error, isLoaded, movies, page, searchError, totalPages, isSearching } = this.state
    const realTotalPages = totalPages > 500 ? 500 : totalPages
    // if (totalPages > 500)

    let noResults, errorHere, spinner, content, footer

    if (searchError) {
      const message = 'По вашему запросу ничего не найдено. Попробуйте еще 🙂'
      noResults = <Error message={message} type="info" />
    } else {
      errorHere = error ? <Error message={error.message} type="warning" /> : null
      spinner = !isLoaded ? <Spinner /> : null
      content = isLoaded && !error ? <MoviesLayout movies={movies} /> : null
    }

    if (isLoaded && !searchError) {
      footer = <Footer page={page} total={realTotalPages} onPaginationChange={this.onPaginationChange} />
    }

    return (
      <>
        <Online>
          <header>
            <Search
              id="search-input"
              page={page}
              onMoviesLoaded={this.onMoviesLoaded}
              onErrorWhenLoaded={this.onErrorWhenLoaded}
              noResultsError={this.noResultsError}
              loadMovies={this.loadMovies}
              showNotSpinner={this.showNotSpinner}
              isSearching={isSearching}
              onToggleSearching={this.onToggleSearching}
              setFirstPage={this.setFirstPage}
            />
          </header>
          {errorHere}
          {spinner}
          {content}
          {noResults}
          {footer}
        </Online>
        <Offline>
          <Error message="You're offline right now. Check your connection." />
        </Offline>
      </>
    )
  }
}

const elem = <App />

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(elem)
