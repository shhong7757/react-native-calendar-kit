import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';

import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

function ExampleListScreen() {
  const example = ['SwipeableMonthlyCalendar', 'SingleMonthlyCalendar'];
  const navigation = useNavigation();

  const handleExamplePress = useCallback(
    (screen: string) => {
      // @ts-ignore
      navigation.navigate(screen);
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => {
      return (
        <Pressable onPress={() => handleExamplePress(item)}>
          <View style={styles.item}>
            <Text>{item}</Text>
          </View>
        </Pressable>
      );
    },
    [handleExamplePress]
  );

  return <FlatList data={example} renderItem={renderItem} />;
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    padding: 16,
  },
});

export default ExampleListScreen;
