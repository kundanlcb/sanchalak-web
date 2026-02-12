import { useState, useCallback, useEffect } from 'react';
import type { Class, Subject } from '../types';
import { schoolOpsApi } from '../services/api';

export const useAcademicStructure = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStructure = useCallback(async () => {
    setLoading(true);
    try {
      const [classesData, subjectsData] = await Promise.all([
        schoolOpsApi.getClasses(),
        schoolOpsApi.getSubjects()
      ]);
      setClasses(classesData);
      setSubjects(subjectsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch academic structure');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStructure();
  }, [fetchStructure]);

  const addClass = async (data: Partial<Class>) => {
    setLoading(true);
    try {
      const newClass = await schoolOpsApi.createClass(data);
      setClasses(prev => [...prev, newClass]);
      return newClass;
    } catch (err: any) {
      setError(err.message || 'Failed to add class');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async (data: Partial<Subject>) => {
    setLoading(true);
    try {
      const newSubject = await schoolOpsApi.createSubject(data);
      setSubjects(prev => [...prev, newSubject]);
      return newSubject;
    } catch (err: any) {
      setError(err.message || 'Failed to add subject');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    classes,
    subjects,
    loading,
    error,
    refresh: fetchStructure,
    addClass,
    addSubject
  };
};
