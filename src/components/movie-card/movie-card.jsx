import React from 'react'
import { Image } from 'antd'
import { format, parseISO } from 'date-fns'

import './movie-card.css'
import RateMovie from '../rate-movie'
import Genre from '../genre'

const MovieCard = ({
  id,
  title,
  date,
  description,
  posterPath,
  rating,
  genreIds,
  onRateMovie,
  loadMovies,
  myRating,
}) => {
  const imgSrc = `https://image.tmdb.org/t/p/original${posterPath}`
  const alt = `Постер к фильму "${title}" `

  let releaseDate = parseISO(date)
  try {
    releaseDate = format(releaseDate, 'MMMM d, yyyy')
  } catch {
    releaseDate = date
  }

  const shortDescription = getShortDescription()

  function getShortDescription() {
    if (title.length > 40) {
      return cutDescription(116)
    } else if (title.length > 21) {
      return cutDescription(144)
    } else {
      return cutDescription(185)
    }
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

  let color
  if (rating < 3) {
    color = '#E90000'
  } else if (rating < 5) {
    color = '#E97E00'
  } else if (rating < 7) {
    color = '#E9D100'
  } else {
    color = '#66E900'
  }

  return (
    <article id={id} className="movie">
      <Image className="movie__img" src={imgSrc} alt={alt} width={183} height={279} />
      <section className="movie__description description">
        <h5 className="description__title">{title}</h5>
        <div className="description__date">{releaseDate}</div>
        <Genre genreIds={genreIds} />
        <p className="description__description">{shortDescription}</p>
        <RateMovie movieId={id} onRateMovie={onRateMovie} loadMovies={loadMovies} myRating={myRating} />
        <div className="description__rating" style={{ borderColor: color }}>
          {Math.round(rating * 10) / 10}
        </div>
      </section>
    </article>
  )
}

export default MovieCard
