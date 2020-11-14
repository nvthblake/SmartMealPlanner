import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Linking } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import openMap from 'react-native-open-maps';


export default class Map extends React.Component {
  state = {
    firstQuery: "",
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
  };
  goToMap(openURL) {
    const company = Platform.OS === "ios" ? "apple" : "google";
    Linking.openURL(openURL);
  }

  componentDidMount() {
    this.getLocationAsync();
  }
  
  async getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status, permissions } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    if (status === "granted") {
      this.setState({ hasLocationPermissions: true });
      //  let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ locationResult: JSON.stringify(location) });
      // Center the map on the location we just fetched.
      this.setState({
        mapRegion: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        },
      });
    } else {
      alert("Location permission not granted");
    }
  }

  render() {
    const { firstQuery } = this.state;
    return (
      <View style={styles.viewStyle}>
        <MapView
          style={styles.mapStyle}
          region={this.state.mapRegion}
          showsUserLocation={true}
        />
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={
            // this.goToMap
            (data, details = null) => {
              // 'details' is provided when fetchDetails = true
              this.goToMap(details.url);
          }}
          style={styles.searchStyle}
          query={{
            key: "AIzaSyAb9ljLkCtNvARiNTTDppYs4hcvNUZ2NFI",
            language: "en",
          }}
          minLength={2}
          fetchDetails={true}
          returnKeyType={"default"}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    height: 320,
  },
  mapStyle: {
    position: "absolute",
    left: 0,
    top: 30,
    width: "100%",
    height: "100%",
  },
  searchStyle: {
    position: "absolute",
    left: 0,
    top: 30,
    height: 300,
  },
});
