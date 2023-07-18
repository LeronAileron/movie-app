import React from 'react'

import MovieCard from '../movie-card'

const MoviesLayout = ({ movies, onRateMovie, loadMovies }) => {
  const movieCards = movies.map((movie) => {
    const { id, title, posterPath, date, overview, currentRating, genreIds, myRating } = movie

    return (
      <MovieCard
        key={id}
        id={id}
        title={title}
        posterPath={posterPath}
        date={date}
        description={overview}
        rating={currentRating}
        genreIds={genreIds}
        onRateMovie={(rating) => {
          onRateMovie(rating, id)
        }}
        loadMovies={loadMovies}
        myRating={myRating}
      />
    )
  })
  return <main className="main">{movieCards}</main>
}

export default MoviesLayout
