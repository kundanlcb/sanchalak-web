import { useState, useCallback, useEffect } from 'react';
import { schoolOpsApi } from '../services/api';
import type { TimetableSlot } from '../types';

export const useTimetableSlots = () => {
    const [slots, setSlots] = useState<TimetableSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSlots = useCallback(async () => {
        try {
            setLoading(true);
            const data = await schoolOpsApi.getTimetableSlots();
            setSlots(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch timetable settings');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSlots = async (newSlots: TimetableSlot[]) => {
        try {
            setLoading(true);
            const data = await schoolOpsApi.updateTimetableSlots(newSlots);
            setSlots(data);
            setError(null);
            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update timetable settings');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    return { slots, loading, error, updateSlots, refetch: fetchSlots };
};
