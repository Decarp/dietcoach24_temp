import { Patient, Sessions } from '@/types/types';
import { addWeeks, fromUnixTime, getUnixTime, subWeeks } from 'date-fns';

export const getBasketTimestamps = (patient?: Patient, sessions?: Sessions) => {
    const ffqTimestamp = patient?.medicalHistory.ffqDate;

    const ffqTimestampMinus8Weeks = getUnixTime(subWeeks(fromUnixTime(ffqTimestamp || 0), 8));

    const ffqTimestampPlus8Weeks = getUnixTime(addWeeks(fromUnixTime(ffqTimestamp || 0), 8));
    if (sessions === undefined) {
        return {
            startTimestamp: '',
            endTimestamp: '',
        };
    }

    if (sessions?.length === 0 || sessions?.length === 1) {
        return {
            startTimestamp: ffqTimestampMinus8Weeks.toString(),
            endTimestamp: ffqTimestamp?.toString() || '',
        };
    } else {
        return {
            startTimestamp: ffqTimestampMinus8Weeks.toString(),
            endTimestamp: ffqTimestampPlus8Weeks.toString(),
        };
    }
};
