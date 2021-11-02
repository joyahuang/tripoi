import React, { useState, useEffect, Component } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import Header from "./components/Header/Header.js";
import List from "./components/List/List.js";
import Map from "./components/Map/Map.js";
import { getPlacesData, getWeatherData } from "./api";
const App = () => {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [coord, setCoord] = useState({});
  const [bound, setBound] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoord({ lat: latitude, lng: longitude });
      }
    );
  }, []);
  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);
    setFilteredPlaces(filteredPlaces);
  }, [rating]);
  useEffect(() => {
    setIsLoading(true);
    if (bound && bound.sw) {
      if (bound.ne.lng > 180) bound.ne.lng = bound.ne.lng - 180;
      if (bound.sw.lng > 180) bound.sw.lng = bound.sw.lng - 180;
      getWeatherData(coord.lat, coord.lng).then((data) => setWeatherData(data));
      getPlacesData(type, bound.sw, bound.ne).then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setIsLoading(false);
      });
    }
  }, [type, bound]);
  return (
    <>
      <CssBaseline>
        <Header setCoord={setCoord}></Header>
        <Grid container spacing={3} style={{ width: "100%" }}>
          <Grid item xs={12} md={4}>
            <List
              places={filteredPlaces.length > 0 ? filteredPlaces : places}
              childClicked={childClicked}
              isLoading={isLoading}
              type={type}
              setType={setType}
              rating={rating}
              setRating={setRating}
            ></List>
          </Grid>
          <Grid item xs={12} md={8}>
            <Map
              setCoord={setCoord}
              setBound={setBound}
              coord={coord}
              places={filteredPlaces.length > 0 ? filteredPlaces : places}
              setChildClicked={setChildClicked}
              weatherData={weatherData}
            ></Map>
          </Grid>
        </Grid>
      </CssBaseline>
    </>
  );
};
export default App;
