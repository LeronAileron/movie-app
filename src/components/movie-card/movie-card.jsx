import React from 'react'
import { Image } from 'antd'
import { format, parseISO } from 'date-fns'
import classNames from 'classnames'

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
    if (document.documentElement.clientWidth < 970) {
      return cutDescription(240)
    }

    return cutIfLength(title, description)
  }

  let fontClass
  if (title.length > 22) {
    fontClass = 'description__title--smaller'
  }

  const ratingClasses = classNames('description__rating', {
    'description__rating--worst': rating < 3,
    'description__rating--bad': rating >= 3 && rating < 5,
    'description__rating--good': rating >= 5 && rating < 7,
    'description__rating--excellent': rating >= 7,
  })

  return (
    <article id={id} className="movie">
      <div className="movie__poster-wrapper">
        <Image className="movie__img" src={imgSrc} alt={alt} />
      </div>
      <section className="movie__description description">
        <div className="movie-info-sm">
          <h5 className={`description__title ${fontClass}`}>{title}</h5>
          <div className="description__date">{releaseDate}</div>
          <Genre genreIds={genreIds} />
        </div>
        <p className="description__description">{shortDescription}</p>
        <RateMovie movieId={id} onRateMovie={onRateMovie} loadMovies={loadMovies} myRating={myRating} />
        <div className={ratingClasses}>{Math.round(rating * 10) / 10}</div>
      </section>
    </article>
  )
}

export default MovieCard

function cutIfLength(title, description) {
  let stop
  if (title.length > 40) {
    stop = 116
  } else if (title.length > 21) {
    stop = 144
  } else {
    stop = 185
  }
  return cutDescription(stop, description)
}

function cutDescription(stop, description) {
  for (stop; stop < stop + 50; stop++) {
    if (description.length < stop) break
    if (description.at(stop) === ' ') {
      description = description.slice(0, stop).concat('...')
      break
    }
  }
  return description
}
