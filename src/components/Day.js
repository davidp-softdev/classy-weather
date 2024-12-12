import React from "react";
import { getWeatherIcon, formatDay } from "../functions";

class Day extends React.Component {
  render() {
    const { date, max, min, code, isToday } = this.props;

    return (
      <li className="day">
        <span>{getWeatherIcon(code)}</span>
        <p>{isToday ? "Today" : formatDay(date)}</p>
        <p>
          <strong className="maxTemp">{Math.ceil(max)}&deg;</strong> &mdash;
          <strong className="minTemp">{Math.floor(min)}&deg;</strong>
        </p>
      </li>
    );
  }
}

export default Day;
