import React from "react";
import { convertToFlag } from "./functions";
import Weather from "./components/Weather";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { location: "Brisbane", isLoading: false, displayLocation: "", weather: {} };
    this.fetchWeather = this.fetchWeather.bind(this);
  }

  async fetchWeather() {
    console.log("loading data");
    // console.log(this);

    try {
      this.setState({ isLoading: true });
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } = geoData.results.at(0);
      this.setState({ displayLocation: `${name} ${convertToFlag(country_code)}` });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.err(err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>
        <div>
          <input
            type="text"
            placeholder="Search for location..."
            value={this.state.location}
            onChange={(e) => this.setState({ location: e.target.value })}
          ></input>
        </div>

        <button onClick={this.fetchWeather}>Get weather</button>
        {this.state.isLoading && <p className="loader">Loading...</p>}

        {this.state.weather.weathercode && (
          <Weather weather={this.state.weather} location={this.state.displayLocation} />
        )}
      </div>
    );
  }
}

export default App;

// class Weather extends React.Component {
//   render() {
//     return (
//       <div>
//         <h2>Weather Component</h2>
//       </div>
//     );
//   }
// }