import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2 } from 'lucide-react';
import { type Routine, type Subject, type Teacher } from '../types';
import { Modal } from '../../../components/common/Modal';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';

// Schema for the form inside the modal
// We only need subjectId and teacherId, as day/period/classId are fixed context
const AssignmentSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),
});

type AssignmentFormValues = z.infer<typeof AssignmentSchema>;

interface RoutineAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AssignmentFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
  day: string;
  period: string;
  classNameStr: string; // Display name of the class
  currentRoutine?: Routine;
  subjects: Subject[];
  teachers: Teacher[];
}

export const RoutineAssignmentModal: React.FC<RoutineAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  day,
  period,
  classNameStr,
  currentRoutine,
  subjects,
  teachers,
}) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<AssignmentFormValues>({
    resolver: zodResolver(AssignmentSchema),
  });

  // Reset form when modal opens or context changes
  useEffect(() => {
    if (isOpen) {
      if (currentRoutine) {
        setValue('subjectId', currentRoutine.subjectId);
        setValue('teacherId', currentRoutine.teacherId);
      } else {
        reset({ subjectId: '', teacherId: '' });
      }
    }
  }, [isOpen, currentRoutine, reset, setValue]);

  const handleFormSubmit = async (data: AssignmentFormValues) => {
    await onSave(data);
    onClose();
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to clear this period?')) {
      await onDelete();
      onClose();
    }
  };

  const subjectOptions = subjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }));
  const teacherOptions = teachers.map(t => ({ value: t.id, label: t.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${classNameStr} - ${day}, ${period}`}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        <Select
          label="Subject"
          {...register('subjectId')}
          error={errors.subjectId?.message}
          options={[{ value: '', label: 'Select Subject' }, ...subjectOptions]}
        />

        <Select
          label="Teacher"
          {...register('teacherId')}
          error={errors.teacherId?.message}
          options={[{ value: '', label: 'Select Teacher' }, ...teacherOptions]}
        />

        <div className="flex justify-between items-center pt-4">
          <div>
            {currentRoutine && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Period
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Saving...' : 'Assign'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
