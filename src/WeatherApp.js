import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "emotion-theming";
import WeatherCard from "./weatherCard";
import useWeatherApi from "./useWeatherApi";
import useSunsetApi from "./useSunsetApi";
import WeatherSetting from "./WeatherSetting";
import { findLocation } from "./utils";
import Moment from "moment";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999",
    titleColor: "#212121",
    temperaturColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1f2022",
    foregroundColor: "#121416",
    boxShadow: "0 1px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatrureColor: "#ddd",
    textColor: "#ccc"
  }
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getMoment =(locationName,sunset) =>{
  if(!sunset)return null;

  const now = new Date();
  
  const sunriseTimestamp = new Date(
     `${Moment().format('YYYY-MM-DD')} ${sunset.rising}`
  ).getTime();
  const sunsetTimestamp = new Date(
       `${Moment().format('YYYY-MM-DD')} ${sunset.falling}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? "day"
    : "night";
};

const WeatherApp = () => {
  const storageCity = localStorage.getItem("cityName");
  const [currentCity, setCurrentCity] = useState(storageCity || "臺北市");
  const currentLocation = findLocation(currentCity) || {};
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentPage, setCurrentPage] = useState("WeatherCard");

  const sunset = useSunsetApi(currentLocation)
    const moment = useMemo(() => getMoment(currentLocation.sunriseCityName,sunset), [
    currentLocation.sunriseCityName
  ]);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  useEffect(() => {
    localStorage.setItem("cityName", currentCity);
  }, [currentCity]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            cityName={currentLocation.cityName}
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
