import React, {Component} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';


export default class AnimatedMarker extends Component{
  state={
    animation:new Animated.Value(1)
  };

componentDidMount(){
  this.startAnimation();
}

  startAnimation=()=>{
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.animation, {
          toValue:0.1,
          duration:1000,
          useNativeDriver:false
        }),
        Animated.timing(this.state.animation, {
          toValue:1,
          duration:1000,
          useNativeDriver:false
        })
      ])
    ).start();
  }
  render(){
    const animatedStyles={
      opacity:this.state.animation,
      transform:[{
        scale:this.state.animation
      }]
    }
    return(
      <Animated.View style={[styles.deneme, animatedStyles]}/>
    );

  }
}

const styles=StyleSheet.create({
  deneme:{
    width: 20,
   height: 20,
   backgroundColor:'red',
   borderRadius:10
  }
})
