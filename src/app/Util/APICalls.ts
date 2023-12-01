export function fetchWeatherSelectedLocation (coords: string) {
  return fetch(`https://api.weather.gov/points/${coords}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error()
    }
  })
}

export function fetchForecast (url: string) {
  return fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error()
    }
  })
}