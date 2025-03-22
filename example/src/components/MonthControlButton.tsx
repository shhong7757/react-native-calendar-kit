import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
} from 'react-native';

interface MonthControlButtonProps extends PressableProps {
  text: string;
}

function MonthControlButton({
  text,
  ...pressableProps
}: MonthControlButtonProps) {
  return (
    <Pressable {...pressableProps}>
      <View style={styles.container}>
        <Text style={styles.month}>{text}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 8,
    justifyContent: 'center',
    padding: 8,
  },
  month: {
    color: 'white',
  },
});

export default MonthControlButton;
