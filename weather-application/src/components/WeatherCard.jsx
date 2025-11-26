import React from 'react'
import '../styles/weathercard.css'

function WeatherCard({data,loading}) {
    if (loading) {
        return
    }

    if (!data){
        return(
            <div className='weather-card empty-card'>
                <p>Search a city to see its weather..</p>
            </div>
        )
    }

    const {cityName,latitude,longitude,temprature,windSpeed,time} = data
  return (
    <div className="weather-card">
      <h2 className="city-name">{cityName}</h2>
      <p className="coords">
        Latitude: <span>{latitude}</span> | Longitude:{" "}
        <span>{longitude}</span>
      </p>
      <div className="weather-values">
        <div className="weather-item">
          <span className="label">Temperature</span>
          <span className="value">
            {temprature !== undefined ? `${temprature} °C` : "N/A"}
          </span>
        </div>
        <div className="weather-item">
          <span className="label">Wind Speed</span>
          <span className="value">
            {windSpeed !== undefined ? `${windSpeed} m/s` : "N/A"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard