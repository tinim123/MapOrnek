import React, { Component } from 'react';
import { StyleSheet, View, Text, PermissionsAndroid, Alert,
 Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import axios from 'axios';
//import Geolocation from '@react-native-community/geolocation';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import{API_ENDPOINT, API_KEY} from '../constants';

request(
  Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  }),
);

export default class CurrentPosition extends Component {
	state = {
			region: {
			latitude: 7.726215,
			longitude: 8.685844,
			latitudeDelta: 0.0090,
			longitudeDelta: 0.0095,
	},
  places:[],
};





	 async componentDidMount() {
    try {

      const { coords: { latitude, longitude } } = await this.getCurrentPosition();
      this.setState({
        region: {
          ...this.state.region,
          latitude,
          longitude
        },
      });
      const { data: { results } } = await axios.get(`${API_ENDPOINT}/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${API_KEY}`)
			this.setState({
				places: results,

			});
         }catch (e) {
      alert("Konum Bilginiz Alınamadı, Lütfen İzinlerinizi Kontrol Edin ve Uygulamayı Yeniden başlatın");
      }
		}


        getCurrentPosition(){
        		return new Promise((resolve, reject) => {
        		Geolocation.getCurrentPosition(
        				position => resolve(position), // success
        				() => reject(), // fail
        				{
        					timeout: 5000,
        					maximumAge: 1000,
        					enableHighAccuracy: false
        				}
        			)
        		})
        	}


	render() {
		return (
			<View style={styles.container}>
				<MapView
				provider={PROVIDER_GOOGLE}
					loadingEnabled={true}
					showsUserLocation={true}
					style={styles.map}
					region={this.state.region}
				>
				</MapView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	map: {
		flex: 1
	},
});
