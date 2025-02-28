import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback } from 'react'
import { BodyConditionLog } from '@/types'

const BodyCondition = ({
    bodyConditionLogs
}: {
    bodyConditionLogs: BodyConditionLog[],
}) => {
  const keyExtractor = useCallback((item: BodyConditionLog) => item.id, [])
  const renderItem = useCallback<ListRenderItem<BodyConditionLog>>(({ item:log, index }) => (
      <View style={styles.tableRow}>
          <Text>Body condition: {log.body_condition}</Text>
          <Text>Date: {new Date(log.date).toLocaleDateString()}</Text>
      </View>
  ), [])
  const ItemSeparatorComponent = useCallback(()=><View style={styles.itemSeparator} />,[])
  const getItemLayout = useCallback((items:any,index:number) => ({ length: 110, offset: (17 + 15) * index, index }), [])    

  return <FlatList data={bodyConditionLogs} renderItem={renderItem} keyExtractor={keyExtractor} ItemSeparatorComponent={ItemSeparatorComponent} getItemLayout={getItemLayout} />
}

export default memo(BodyCondition)

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