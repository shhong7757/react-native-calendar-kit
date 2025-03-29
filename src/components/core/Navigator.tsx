import { useCalendarContext } from '../../context/CalendarContext';

import { MonthMap, type NavigatorRenderProps } from '../../types';

interface NavigatorProps {
  render: (props: NavigatorRenderProps) => React.ReactNode;
}

const Navigator = ({ render }: NavigatorProps): React.ReactNode => {
  const { labels, viewingDate, updateViewingDate } = useCalendarContext();

  const monthLabel = labels.months[(viewingDate.month - 1) as MonthMap];

  return render({
    monthLabel,
    viewingDate,
    updateViewingDate,
  });
};

export default Navigator;
