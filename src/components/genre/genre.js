import React from 'react'

import { GenresConsumer } from '../../context/genre-context'

const Genre = ({ genreIds = [] }) => {
  return (
    <GenresConsumer>
      {(genresdb) => {
        let genres

        if (genresdb === null) return
        genres = genreIds.map((id) => {
          const theGenreEl = genresdb.find((genre) => genre.id === id)
          const genre = theGenreEl.name ? theGenreEl.name : 'genre'

          return (
            <div className="genre" key={id}>
              {genre}
            </div>
          )
        })

        return <div className="description__genres">{genres}</div>
      }}
    </GenresConsumer>
  )
}

export default Genre
