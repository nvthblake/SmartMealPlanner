import React, { Component } from 'react'
import { Text, View, Animated, Image } from 'react-native'

export default class LoadingAnimation extends Component {
    constructor(props) {
        super(props);

        this.loadingSpin = new Animated.Value(0);
        this.loadingFade = new Animated.Value(0);
    }

    spinAnimation() {
        this.loadingSpin.setValue(0);
        this.loadingFade.setValue(0);

        Animated.sequence([
            Animated.timing(
                this.loadingSpin,
                {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }
            )
        ]).start(() => this.spinAnimation());
    }

    fadeAnimation() {
        Animated.sequence([
            Animated.timing(
                this.loadingFade,
                {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                this.loadingFade,
                {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true
                }
            )
        ]).start(() => this.fadeAnimation());
    }

    componentDidMount() {
        this.spinAnimation();
        this.fadeAnimation();
    }

    render() {
        const spin = this.loadingSpin.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {
                    this.props.show &&
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Animated.Image style={{ height: 100, width: 100, transform: [{ rotate: spin }], resizeMode: 'contain' }} source={require('../assets/appIcon/fidget_spinner.png')} />
                        <Animated.Text style={{ opacity: this.loadingFade, color: 'black', fontSize: 16, marginTop: 24 }}>{this.props.label}</Animated.Text>
                    </View>
                }
            </View>
        )
    }
}
