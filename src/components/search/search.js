import React from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'

import './search.css'
import MovieService from '../../services/moviedb'

class Search extends React.Component {
  movieResource = new MovieService()

  state = {
    searchingFor: '',
    paging: false,
  }

  static defaultProps = {
    debounceAwait: 600,
  }

  componentDidUpdate(prevProps) {
    const { page, isSearching } = this.props
    const { searchingFor } = this.state
    if (isSearching) {
      if (page !== prevProps.page) {
        this.handleSearchInput(searchingFor)
      }
    }
  }

  handleSearchInput = (query) => {
    const {
      page,
      onMoviesLoaded,
      onErrorWhenLoaded,
      noResultsError,
      loadMovies,
      showNotSpinner,
      isSearching,
      onToggleSearching,
      setFirstPage,
    } = this.props

    this.setState({
      searchingFor: query,
    })

    showNotSpinner()

    if (!query.trim()) {
      this.resetPaging()

      if (isSearching) onToggleSearching()
      setFirstPage()
      loadMovies()
      return
    }

    if (!isSearching) onToggleSearching()

    if (!this.state.paging) {
      this.setState({ paging: true })
      setFirstPage()
    }

    this.debounceSearch(query, page, onMoviesLoaded, onErrorWhenLoaded, noResultsError, showNotSpinner)
  }

  debounceSearch = debounce((query, page, onMoviesLoaded, onErrorWhenLoaded, noResultsError) => {
    this.movieResource.searchMovies(query, page).then((movies) => {
      if (movies.theMovies.length > 0) {
        onMoviesLoaded(movies)
      } else {
        this.resetPaging()
        noResultsError()
      }
    }, onErrorWhenLoaded)
  }, this.props.debounceAwait)

  resetPaging = () => {
    this.setState({
      paging: null,
    })
  }

  render() {
    return (
      <Input
        className="search-input"
        value={this.state.searchingFor}
        onChange={(e) => this.handleSearchInput(e.target.value)}
        placeholder="Type to search..."
        autoFocus
      />
    )
  }
}

export default Search
