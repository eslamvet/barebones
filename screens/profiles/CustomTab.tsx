import React, { memo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('screen');
const TAB_GAP = 5;
const SCREEN_PADDING = 32
const CustomTab = ({ tabs, onTabPress }: { tabs: string[], onTabPress: (index: number) => void }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;

    const handlePress = (index: number) => {
        setActiveIndex(index);
        Animated.timing(translateX, {
            toValue: index * ((width - SCREEN_PADDING + TAB_GAP) / tabs.length),
            duration: 300,
            useNativeDriver: true,
        }).start();
        onTabPress(index);
    };

    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab, index) => (
                <TouchableOpacity key={index} style={styles.tab} onPress={() => handlePress(index)}>
                    <Text style={StyleSheet.compose(styles.tabText, activeIndex === index && styles.activeText)}>{tab}</Text>
                </TouchableOpacity>
            ))}
            <Animated.View style={StyleSheet.compose(styles.indicator, { width: (width - SCREEN_PADDING - ((tabs.length - 1) * TAB_GAP)) / tabs.length, transform: [{ translateX }] })} />
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        overflow: 'hidden',
        gap: TAB_GAP
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        zIndex: 1,
    },
    tabText: {
        textAlign: 'center',
        color: '#555',
    },
    activeText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    indicator: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        zIndex: 0,
    },
});

export default memo(CustomTab);