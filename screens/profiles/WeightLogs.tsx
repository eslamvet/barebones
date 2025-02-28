import { View, Text, StyleSheet, FlatList, ListRenderItem } from 'react-native'
import React, { memo, useCallback } from 'react'
import { WeightLog } from '@/types'

const WeightLogs = ({
    weightLogs
}: {
    weightLogs: WeightLog[],
}) => {

    const keyExtractor = useCallback((item: WeightLog) => item.id, [])
    const renderItem = useCallback<ListRenderItem<WeightLog>>(({ item:log, index }) => (
        <View style={styles.tableRow}>
            <Text>Weight: {log.weight}kg</Text>
            <Text>Date: {new Date(log.date).toLocaleDateString()}</Text>
        </View>
    ), [])
    const ItemSeparatorComponent = useCallback(()=><View style={styles.itemSeparator} />,[])
    const getItemLayout = useCallback((items:any,index:number) => ({ length: 110, offset: (17 + 15) * index, index }), [])    

    return <FlatList data={weightLogs} renderItem={renderItem} keyExtractor={keyExtractor} ItemSeparatorComponent={ItemSeparatorComponent} getItemLayout={getItemLayout} />
}

const styles = StyleSheet.create({
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemSeparator:{
        height:1,
        backgroundColor: '#eee',
        marginVertical:7
    },
})

export default memo(WeightLogs)