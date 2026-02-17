import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Trash2, Mail, Phone, BookOpen, Calendar, Edit } from 'lucide-react';
import { TeacherSchema } from '../types';
import { useTeachers } from '../hooks/useTeachers';
import { useAcademicStructure } from '../hooks/useAcademicStructure';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

// Schema for creating a teacher (id is optional/generated)
const CreateTeacherSchema = TeacherSchema.omit({ id: true, isActive: true }).extend({
  specializedSubjects: z.array(z.string()).min(1, 'At least one subject is required'),
});

type CreateTeacherForm = z.infer<typeof CreateTeacherSchema>;

export const TeacherManager: React.FC = () => {
  const { teachers, loading, error, addTeacher, updateTeacher, removeTeacher } = useTeachers();
  const { subjects } = useAcademicStructure(); // To list subjects for selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CreateTeacherForm>({
    resolver: zodResolver(CreateTeacherSchema),
    defaultValues: {
      specializedSubjects: [],
    }
  });

  const selectedSubjects = watch('specializedSubjects');

  const handleSubjectToggle = (subjectId: string) => {
    const current = selectedSubjects || [];
    if (current.includes(subjectId)) {
      setValue('specializedSubjects', current.filter(id => id !== subjectId), { shouldValidate: true });
    } else {
      setValue('specializedSubjects', [...current, subjectId], { shouldValidate: true });
    }
  };

  const handleEdit = (teacher: any) => {
    setEditingId(teacher.id);
    setValue('name', teacher.name);
    setValue('email', teacher.email);
    setValue('phone', teacher.phone || '');
    setValue('joiningDate', teacher.joiningDate.split('T')[0]);
    setValue('qualification', teacher.qualification || '');
    setValue('specializedSubjects', teacher.specializedSubjects || []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset({ specializedSubjects: [] });
  };

  const onSubmit = async (data: CreateTeacherForm) => {
    try {
      if (editingId) {
        await updateTeacher(editingId, data);
      } else {
        await addTeacher({
          ...data,
          isActive: true,
        });
      }
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubjectNames = (subjectIds: string[]) => {
    return subjectIds.map(id => subjects.find(s => s.id === id)?.name || id).join(', ');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Teachers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage faculty members and their subject specializations
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Teacher
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm dark:text-gray-200"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Teacher List - Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{teacher.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px]">
                      Active
                    </span>
                    {teacher.qualification && (
                      <span>• {teacher.qualification}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(teacher)}
                  className="text-gray-400 hover:text-blue-500 p-1 transition-colors"
                  title="Edit Teacher"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeTeacher(teacher.id)}
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                  title="Remove Teacher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{teacher.email}</span>
              </div>
              {teacher.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2" title={getSubjectNames(teacher.specializedSubjects)}>
                  {getSubjectNames(teacher.specializedSubjects) || 'No subjects assigned'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Joined: {new Date(teacher.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredTeachers.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No teachers found. Click "Add Teacher" to get started.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Teacher" : "Add New Teacher"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="e.g. John Doe"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="john@school.edu"
            />
            <Input
              label="Phone"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="+1 234 567 890"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Joining Date"
              type="date"
              {...register('joiningDate')}
              error={errors.joiningDate?.message}
            />
            <Input
              label="Qualification"
              {...register('qualification')}
              error={errors.qualification?.message}
              placeholder="e.g. M.Sc. Mathematics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specialized Subjects
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3">
              {subjects.map(subject => (
                <label key={subject.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSubjects?.includes(String(subject.id))}
                    onChange={() => handleSubjectToggle(String(subject.id))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{subject.name} ({subject.code})</span>
                </label>
              ))}
              {subjects.length === 0 && (
                <p className="col-span-2 text-xs text-gray-500 text-center py-2">
                  No subjects found. Please add subjects in Academic Setup first.
                </p>
              )}
            </div>
            {errors.specializedSubjects && (
              <p className="mt-1 text-sm text-red-600">{errors.specializedSubjects.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editingId ? "Save Changes" : "Add Teacher"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
