import React from 'react'
import { Image } from 'antd'
import { format, parseISO } from 'date-fns'

import './movie-card.css'

const MovieCard = ({ id, title, date, description, poster_path }) => {
  const imgSrc = `https://image.tmdb.org/t/p/original${poster_path}`
  const alt = `Постер к фильму "${title}" `
  const releaseDate = parseISO(date)
  const release = format(releaseDate, 'MMMM d, yyyy')

  let shortDescription

  if (title.length > 21) {
    shortDescription = cutDescription(144)
  } else {
    shortDescription = cutDescription(185)
  }

  function cutDescription(stop) {
    for (stop; stop < stop + 50; stop++) {
      if (description.length < stop) break
      if (description.at(stop) === ' ') {
        description = description.slice(0, stop).concat('...')
        break
      }
    }
    return description
  }

  return (
    <article id={id} className="movie">
      <Image className="movie__img" src={imgSrc} alt={alt} width={183} height={279} />
      <section className="movie__description description">
        <h5 className="description__title">{title}</h5>
        <div className="description__date">{release}</div>
        <div className="description__genres">
          <div className="genre">Genre</div>
          <div className="genre">Comedy</div>
          <div className="genre">Historical</div>
        </div>
        <p className="description__description">{shortDescription}</p>
      </section>
    </article>
  )
}

export default MovieCard
