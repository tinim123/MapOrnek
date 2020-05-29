import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';

export default class Region extends React.Component {
  state={
    region:{
      latitude: 36.726215,
      longitude: 27.685844,
      latitudeDelta: 0.0090,
       longitudeDelta: 0.0095,
      }
  };

/*componentDidMount(){
  setTimeout(()=>{
    this.setState({
      region:{
        ...this.state.region,
        latitude:38
      },
    });
  }, 5000)
}*/

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inside}>
        <MapView style={styles.inside}
              region={this.state.region}
                        />
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
},

});
