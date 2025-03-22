import { Text } from 'react-native';
import type { WeekDayProps } from '../../types';

function WeekDay({ text }: WeekDayProps) {
  return <Text>{text}</Text>;
}

export default WeekDay;
