import React from 'react'
import { View, Text } from 'react-native'

export default function CircularOverview({ stat, title, size }) {
    return (
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: size, height: size, backgroundColor: '#F3F6F9', borderRadius: Math.floor(size / 2), borderWidth: 2, borderColor: '#3E73FB' }}>
                <Text numberOfLines={2} style={{ fontWeight: '400', fontSize: 16 }}>{stat}</Text>
            </View>
            <Text style={{ color: 'gray', paddingTop: 4 }}>{title}</Text>
        </View>
    )
}
