import React from "react";
import GoogleMapReact from "google-map-react";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import LocationOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import Rating from "@material-ui/lab/Rating";
import useStyles from "./styles";
import mapStyles from "./mapStyles";
const Map = ({
  setCoord,
  setBound,
  coord,
  places,
  setChildClicked,
  weatherData,
}) => {
  console.info(weatherData);
  if (coord.lng > 180) coord.lng = coord.lng - 360;
  console.info("map run", coord);
  const classes = useStyles();
  // ismobile is false if media is larger than 600 px
  const isDesktop = useMediaQuery("(min-width:600px)");
  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDV3v3xd3-1M1dqdW7dwZbGM2C2rC1oe9Y" }}
        // defaultCenter={coord}
        center={coord}
        defaultZoom={12}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        onChange={(e) => {
          setBound({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
          setCoord({ lat: e.center.lat, lng: e.center.lng });
        }}
        onChildClick={(child) => {
          setChildClicked(child);
        }}
      >
        {places?.map((place, i) => (
          <div
            className={classes.markerContainer}
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
          >
            {!isDesktop ? (
              <LocationOutlinedIcon color="primary" fontSize="large" />
            ) : (
              <Paper elevation={3} className={classes.paper}>
                <Typography className={classes.Typography} variant="subtitle2">
                  {place.name}
                </Typography>
                <img
                  className={classes.pointer}
                  src={place.photo ? place.photo.images.large.url : ""}
                  alt={place.name}
                ></img>
                <Rating
                  size="small"
                  value={Number(place.rating)}
                  readOnly
                ></Rating>
              </Paper>
            )}
          </div>
        ))}
        {weatherData ? (
          <div lat={weatherData.coord.lat} lng={weatherData.coord.lon}>
            <img
              height={100}
              src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            ></img>
          </div>
        ) : (
          <div lat={coord.lat} lng={coord.lng}>
            Weather not loading
          </div>
        )}
      </GoogleMapReact>
    </div>
  );
};
export default Map;
