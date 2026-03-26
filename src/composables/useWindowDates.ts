import { computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import { getLongDateString, getLongDateTimeString } from '@/utils/dateUtils';

export function useWindowDates() {
  const configStore = useConfigStore();

  const getWindowStartDateTimeString = computed(() => {
    const windowStartDate = configStore.windowStartDate;

    if (windowStartDate === null) {
      return null;
    }

    return getLongDateString(windowStartDate);
  });

  const getWindowEndDateTimeString = computed(() => {
    const windowEndDate = configStore.windowEndDate;

    if (windowEndDate === null) {
      return null;
    }

    return getLongDateTimeString(windowEndDate);
  });

  const getWindowEndDateString = computed(() => {
    const windowEndDate = configStore.windowEndDate;

    if (windowEndDate === null) {
      return null;
    }

    return getLongDateString(windowEndDate);
  });

  const getMatchDateString = computed(() => {
    const windowEndDate = configStore.windowEndDate;

    if (windowEndDate === null) {
      return null;
    }

    const dayAfter: Date = new Date(windowEndDate);
    dayAfter.setDate(dayAfter.getDate() + 1);

    return getLongDateString(dayAfter);
  });

  return {
    getWindowStartDateTimeString,
    getWindowEndDateTimeString,
    getWindowEndDateString,
    getMatchDateString
  };
}
