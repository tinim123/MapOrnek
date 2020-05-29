import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import AnimatedMarker from './AnimatedMarker';
import Permissions from 'react-native-permissions';

export default class Markers extends React.Component {

  state={
    region:{
      latitude: 36.726215,
      longitude: 27.685844,
      latitudeDelta: 0.0090,
      longitudeDelta: 0.0095,
    },
    markers:[
      {
        latlng:{
          latitude: 36.726215,
          longitude: 27.686844
        },
        title:'hasan',
        description:'hasan deneme',

      },

    ]
  };
  componentDidMount(){
    Permissions.request('location').then(response=>{
      
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inside}>
        <MapView style={styles.inside}
        showsUserLocation={true}
        loadingEnable={true}
              region={this.state.region}  >
              {
                this.state.markers.map((marker,key)=>(
                  <Marker
                  key={key}
                  coordinate={marker.latlng}
                  title={marker.title}
                  description={marker.description}
                  >
                  <AnimatedMarker  />
                  </Marker>
                ))
              }
          </MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

container: {
flex: 1,
},

inside: {
flex: 1,
}

});
