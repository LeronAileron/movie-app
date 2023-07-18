import React from 'react'
import { Rate, ConfigProvider } from 'antd'

import { MovieServiceConsumer } from '../../context/service-context'
import { GuestSessionIdConsumer } from '../../context/guest-session-context'

export default class RateMovie extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.myRating !== this.props.myRating) {
      this.props.loadMovies()
    }
  }

  onRate = () => {
    this.setState({ pupupu: 'tututu' })
  }

  render() {
    const { movieId, onRateMovie } = this.props
    const myRating = localStorage.getItem(movieId)

    return (
      <MovieServiceConsumer>
        {(movieResource) => (
          <GuestSessionIdConsumer>
            {(guestSessionId) => (
              <ConfigProvider
                theme={{
                  token: {
                    controlHeightLG: 35,
                    marginXS: 5,
                  },
                }}
              >
                <Rate
                  className="description__toRate"
                  value={myRating}
                  count={10}
                  onChange={(rating) => {
                    movieResource.rateMovie(rating, movieId, guestSessionId)
                    onRateMovie(rating)
                    this.onRate()
                  }}
                />
              </ConfigProvider>
            )}
          </GuestSessionIdConsumer>
        )}
      </MovieServiceConsumer>
    )
  }
}

// export default RateMovie
