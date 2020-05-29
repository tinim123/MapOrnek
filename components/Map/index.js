import React, { Component } from 'react';
import { StyleSheet, View, Text, PermissionsAndroid, Alert,
 Platform, TouchableOpacity, Button,ActivityIndicator } from 'react-native';
import MapView,{Marker, Callout} from 'react-native-maps';
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import{API_ENDPOINT, API_KEY} from '../../constants';
import Places from '../Places';
import PlacesItem from '../Places/PlacesItem';
import mapStyle from './mapStyle';


request(
  Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  }),
);

export default class CurrentPosition extends Component {
	state = {
			region: {
			latitude: 36.726215,
			longitude: 27.685844,
			latitudeDelta: 0.0070,
			longitudeDelta: 0.0075,
	},
  places: [],
  fetching:false,
  pageToken:"",
  refreshing:false,
  destination: {
    latitude: 36.726215,
    longitude: 27.685844,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
    check:true
  }
};

async componentDidMount() {
		try{
			const { coords: { latitude, longitude } } = await this.getCurrentPosition();
			this.setState({
				region: {
					...this.state.region,
					latitude,
					longitude
				},
      fetching:true
			});
      await axios.get(`${API_ENDPOINT}/nearbysearch/json?location=${latitude},${longitude}&radius=1003&type=lodging&key=${API_KEY}`)
      .then(response=>this.setState({
        places: response.data.results,
        fetching:false,
        refreshing:false
      }))
      await axios.get(`${API_ENDPOINT}/nearbysearch/json?location=${this.state.region.latitude},${this.state.region.longitude}&radius=1002&type=lodging&key=${API_KEY}`)
      .then(response=>  this.setState({
        pageToken:response.data.next_page_token,

      }))
      console.log(this.state.pageToken);
		}catch (e) {
      this.setState({
        fetching:false,
        refreshing:false

      });
			alert('Konum alınamadı!')
		}
	}

  renderFooter = () => {
    if (this.state.pageToken === undefined) return null;
    return (
      <View
        style={{
          paddingVertical: 30,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="small" />

      </View>
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        pageToken: '',
        refreshing: true
      },
      () => {
         axios.get(`${API_ENDPOINT}/nearbysearch/json?location=${this.state.region.latitude},${this.state.region.longitude}&radius=1003&type=lodging&key=${API_KEY}`)
        .then(response=>this.setState({
          places: response.data.results,
          fetching:false,
        }))
      }
    );
  };

  handleLoadMore = () => {

    axios.get(`${API_ENDPOINT}/nearbysearch/json?location=${this.state.region.latitude},${this.state.region.longitude}&radius=1003&type=lodging&key=${API_KEY}&pagetoken=${this.state.pageToken}`)
   .then(response=>this.setState({
     places: response.data.results,
     fetching:false,
     refreshing:false
   }))};

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

    focus(){
      const focusMap = {
  			latitude: this.state.region.latitude,
  			longitude: this.state.region.longitude,
  			latitudeDelta: this.state.region.latitudeDelta/2,
  			longitudeDelta: this.state.region.longitudeDelta/2,
  		};
      setTimeout(() => {
          this.map && this.map.animateToRegion(focusMap, 2000);
           }, 15)
       }
          render() {

          const origin = {latitude:this.state.region.latitude, longitude:this.state.region.longitude};
          const GOOGLE_MAPS_APIKEY = 'AIzaSyBH4rdrHZVcKeuUWFHjm7_PpfH9J973EGQ';
          const destination={latitude:this.state.destination.latitude, longitude:this.state.destination.longitude}
          		return (
          			<View style={styles.container}>
          				<MapView
          					style={styles.map}
          					showsUserLocation={true}
          					region={this.state.region}
                    ref={ref => this.map = ref}
                    loadingEnabled={true}
                  //  showsTraffic={true}
                    //customMapStyle={mapStyle}
                    	>

              {
               this.state.destination.check? console.log("bilgi yok") :
                  <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={4.5}
                    strokeColor="red"
                    mode="WALKING"
                   timePrecision="now"
                    />
              }

          				{
                    this.state.places.map(place=>{
                      const { geometry: { location: { lat, lng }} } = place;
                      return(
								<Marker
									key={place.id}
                  pinColor="#9ae0f5"
									coordinate={{
										latitude: lat,
										longitude: lng
									}}
                  onPress={()=>{
                    this.setState({
                      destination:{
                     latitude:lat,
                     longitude:lng,
                     check:false
                   }})
                 this.focus()
               }}
								>
                <Callout  >
                        <View>
                            <Text>{place.name},</Text>
                            <Text>{place.vicinity}</Text>
                        </View>
                    </Callout>
                </Marker>


							)
                    })
                  }

          				</MapView>
                  <View style={styles.placesContainer}>
					{
						this.state.fetching ? <Text style={styles.loading}>Yekındaki Mekanlar Alınıyor...</Text> : <Places map={this.map} places={this.state.places} renderFooter={this.renderFooter}
            handleLoadMore={this.handleLoadMore} refreshing={this.state.refreshing} onRefresh={this.handleRefresh}/>

					}
				</View>
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
          	placesContainer: {
          		position: 'absolute',
          		left: 0,
          		bottom: 0,
          		width: '100%',
          		height: 140,
          		alignItems: 'center',
          		justifyContent: 'center'
          	},
          	loading: {
          		padding: 10,
          		backgroundColor: '#f1f1f1',
          		fontSize: 13,
          		color: '#333'
          	}
          });
