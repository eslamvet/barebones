import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback } from 'react'
import { VetVisitLog } from '@/types'

const VetVisits = ({
    vetVisitLogs
}: {
    vetVisitLogs: VetVisitLog[],
}) => {
    const keyExtractor = useCallback((item: VetVisitLog) => item.id, [])
    const renderItem = useCallback<ListRenderItem<VetVisitLog>>(({ item:log, index }) => (
        <View style={styles.tableRow}>
            <Text style={styles.note}>Visit notes: {log.notes}</Text>
            <Text>Date: {new Date(log.date).toLocaleDateString()}</Text>
        </View>
    ), [])
    const ItemSeparatorComponent = useCallback(()=><View style={styles.itemSeparator} />,[])

    return <FlatList data={vetVisitLogs} renderItem={renderItem} keyExtractor={keyExtractor} ItemSeparatorComponent={ItemSeparatorComponent} ListFooterComponent={<TouchableOpacity style={styles.addNoteBtn} activeOpacity={.2}><Text style={styles.addNoteBtnText}>Add Note</Text></TouchableOpacity>} ListFooterComponentStyle={styles.ListFooterComponentStyle} />
}

export default memo(VetVisits)

const styles = StyleSheet.create({
    tableRow: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
    },
    note:{
        flex: 1
    },
    itemSeparator:{
        height:1,
        backgroundColor: '#eee',
        marginVertical:7
    },
    addNoteBtn:{
        backgroundColor:'#4CAF50',
        paddingVertical: 8,
        borderRadius: 6
    },
    addNoteBtnText:{
        fontWeight:'500',
        textAlign: 'center',
        color: 'white'
    },
    ListFooterComponentStyle:{
        marginTop: 15
    }
})