import React from 'react'

import MovieCard from '../movie-card'

const MoviesLayout = ({ movies }) => {
  const movieCards = movies.map((movie) => {
    const { id, title, posterPath, date, overview } = movie

    return <MovieCard key={id} id={id} title={title} posterPath={posterPath} date={date} description={overview} />
  })
  return <main className="main">{movieCards}</main>
}

export default MoviesLayout
