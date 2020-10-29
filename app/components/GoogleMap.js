import React from "react";
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { SearchBar } from 'react-native-elements';

export default class Map extends React.Component {
  state = {
    firstQuery: '',
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
  };

  componentDidMount() {
    this.getLocationAsync();
  }


  async getLocationAsync () {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status, permissions } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    if (status === 'granted') {
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
      alert('Location permission not granted');
    }
  };

  render() {
    const { firstQuery } = this.state;
    return (
      <View style={styles.mapStyle}>
        <SearchBar
          placeholder="Find Me"
          onChangeText={query => { this.setState({ firstQuery: query }); }}
          value={firstQuery}
          showsCancelButtonWhileEditing={true}
        />
        <MapView
          style={styles.mapStyle}
          region={this.state.mapRegion}
          showsUserLocation={true}
        />
      </View>
        
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    height: 300,
  }
});

