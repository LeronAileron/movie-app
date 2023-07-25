/* eslint-disable quotes */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Offline, Online } from 'react-detect-offline'
import { Tabs } from 'antd'

import './index.css'
import MovieService from './services/moviedb'
import MoviesLayout from './components/movies-layout'
import Error from './components/error'
import Spinner from './components/spinner'
import Search from './components/search'
import Footer from './components/footer'
import { MovieServiceProvider } from './context/service-context'
import { GuestSessionIdProvider } from './context/guest-session-context'
import { GenresProvider } from './context/genre-context'

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
    guestSessionId: null,
    activeTab: 1,
    genresdb: null,
  }

  componentDidMount() {
    this.loadMovies()

    this.movieResource
      .createGuestSession()
      .then((result) => {
        this.setState({
          guestSessionId: result.guest_session_id,
        })
        localStorage.clear()
      })
      .catch((err) => <Error message={`не получилось создать гостевую сессию, объект ошибки: ${err}`} />)

    this.movieResource
      .getGenres()
      .then((genresdb) => {
        this.setState({
          genresdb,
        })
      })
      .catch((err) => <Error message={`не смогли получить жанры, объект ошибки: ${err}`} />)
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, isSearching, activeTab, guestSessionId } = this.state
    if (page !== prevState.page || activeTab !== prevState.activeTab) {
      if (!isSearching || activeTab == 2) {
        this.loadMovies()
      }
    }

    if (activeTab !== prevState.activeTab) {
      this.setState({ isSearching: false })
    }

    if (guestSessionId !== prevState.guestSessionId) {
      localStorage.setItem('guestSessionId', this.state.guestSessionId)
    }
  }

  componentDidCatch(error, info) {
    console.log('error: ', error)
    console.log('info: ', info)
    this.setState({ error })
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
    const { page, activeTab, guestSessionId } = this.state

    if (activeTab == 1) {
      this.movieResource.getMovies('popular', page).then(this.onMoviesLoaded, this.onErrorWhenLoaded)
      // this.dummyResource.getMovies().then(this.onMoviesLoaded, this.onErrorWhenLoaded)
    }

    if (activeTab == 2) {
      this.movieResource.getRatedMovies(guestSessionId, page).then(this.onMoviesLoaded, this.onErrorWhenLoaded)
    }
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

  onTabChange = (activeKey) => {
    this.setState({
      activeTab: activeKey,
    })
  }

  onRateMovie = (rating, id) => {
    localStorage.setItem(id, rating)
  }

  render() {
    const { error, isLoaded, movies, page, searchError, totalPages, isSearching, activeTab, guestSessionId, genresdb } =
      this.state
    const realTotalPages = totalPages > 500 ? 500 : totalPages

    const tabs = [
      {
        key: '1',
        label: `Search`,
      },
      {
        key: '2',
        label: `Rated`,
      },
    ]

    let noResults, errorHere, spinner, content, footer, search

    if (searchError) {
      const message = 'По вашему запросу ничего не найдено. Попробуйте еще 🙂'
      noResults = <Error message={message} type="info" />
    } else {
      errorHere = error ? <Error message={error.message} type="warning" /> : null
      spinner = !isLoaded ? <Spinner /> : null
      content =
        isLoaded && !error ? (
          <MoviesLayout movies={movies} onRateMovie={this.onRateMovie} loadMovies={this.loadMovies} />
        ) : null
    }

    if (isLoaded && !searchError) {
      footer = <Footer page={page} total={realTotalPages} onPaginationChange={this.onPaginationChange} />
    }

    if (activeTab == 1) {
      search = (
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
      )
    } else if (movies.length == 0) {
      const message = 'Здесь появятся оцененные вами фильмы 🙂'
      noResults = <Error message={message} type="info" />
    }

    return (
      <>
        <Online>
          <Tabs className="tabs" defaultActiveKey="1" items={tabs} onChange={this.onTabChange} page={page} />
          <header>{search}</header>
          {errorHere}
          {spinner}
          <MovieServiceProvider value={this.movieResource}>
            <GuestSessionIdProvider value={guestSessionId}>
              <GenresProvider value={genresdb}>{content}</GenresProvider>
            </GuestSessionIdProvider>
          </MovieServiceProvider>
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
