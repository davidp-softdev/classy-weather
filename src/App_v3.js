import React from "react";
import { convertToFlag } from "./functions";
import Weather from "./components/Weather";

class App extends React.Component {
  state = { location: "Brisbane", isLoading: false, displayLocation: "", weather: {} };

  // constructor(props) {
  //   super(props);
  //   this.fetchWeather = this.fetchWeather.bind(this);
  // }

  // async fetchWeather() {
  // Using an arrow func instead of a method so we can get rid of the constructor and
  // event handlers are automatically bound to this
  fetchWeather = async () => {
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
  };

  setLocation = (e) => this.setState({ location: e.target.value });

  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>
        <InputField location={this.state.location} onChangeLocation={this.setLocation} />

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

class InputField extends React.Component {
  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Search for location..."
          value={this.props.location}
          onChange={this.props.onChangeLocation}
        ></input>
      </div>
    );
  }
}
