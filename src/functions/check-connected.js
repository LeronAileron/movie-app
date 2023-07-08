const checkConnected = (onChangeConnectionStatus, internetConnection) => {
  window.ononline = () => {
    console.log('internetConnection: ' + internetConnection)
    if (internetConnection) return
    return onChangeConnectionStatus()
  }

  window.onoffline = () => {
    if (!internetConnection) return
    return onChangeConnectionStatus()
  }
}

export default checkConnected
