import { useState } from "react"
import WeatherCard from "./components/WeatherCard"
import './styles/app.css'
import { BallTriangle } from "react-loader-spinner"


function App() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const handleSearch = async () => {

    setWeatherData(null)
    if (city.trim() == 0) {

      setError("Please Enter a City name..")
      return
    }

    setLoading(true)
    setError('')

    try {
      const WeatherResult = await fetch(`http://localhost:8000/api/weather/?city=${encodeURIComponent(city)}`)

      if (!WeatherResult.ok) {
        const ErrorJson = await WeatherResult.json()

        throw new Error(ErrorJson.error || "Failed to fetch City Data")

      }
      const WeatherDetails = await WeatherResult.json()




      setWeatherData({
        cityName: WeatherDetails.city,
        latitude: WeatherDetails.latitude,
        longitude: WeatherDetails.longitude,
        temprature: WeatherDetails.temprature,
        windSpeed: WeatherDetails.windspeed,
      })

    } catch (err) {
      setError(err.message || "Something went wrong")
    }
    finally {
      setLoading(false)

    }

  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <>
      
      <div className="root">
        

        <div className="glass-container">
          <h1 className="app-title">Weather Info</h1>

          <div className="search-row">
            <input
              type="text"
              placeholder="Enter city name (e.g., Dubai)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              className="city-input"
            />
            <button onClick={handleSearch} className="search-button" disabled={!city || loading} >
              Get Weather
            </button>
          </div>


          {loading && (<><div className="loader">
            <BallTriangle
              height={50}
              width={50}
              radius={5}
              color="#e8e8efff"
              ariaLabel="ball-triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            /></div><div className="text-marquee">Fetching Weather info</div></>
          )}
          {error && <p className="error-text">{error}</p>}
          <div>
            <WeatherCard data={weatherData} loading={loading} />
          </div>
        </div></div>

    </>
  )
}

export default App
