import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Edit, UserCog, Upload } from 'lucide-react';
import Select from 'react-select';
import { TeacherSchema } from '../types';
import { useTeachers } from '../hooks/useTeachers';
import { useAcademicStructure } from '../hooks/useAcademicStructure';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Skeleton } from '../../../components/common/Skeleton';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { schoolOpsApi } from '../services/api';
import { useToast } from '../../../components/common/ToastContext';

// Schema for creating a teacher (id is optional/generated)
const CreateTeacherSchema = TeacherSchema.omit({ id: true, isActive: true }).extend({
  specializedSubjects: z.array(z.coerce.number()).min(1, 'At least one subject is required'),
});

type CreateTeacherForm = z.infer<typeof CreateTeacherSchema>;

export const TeacherManager: React.FC = () => {
  const navigate = useNavigate();
  const { teachers, loading, error, addTeacher, updateTeacher, removeTeacher } = useTeachers();
  const { subjects } = useAcademicStructure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateTeacherForm>({
    resolver: zodResolver(CreateTeacherSchema),
    defaultValues: {
      specializedSubjects: [],
    }
  });

  const handleEdit = (teacher: any) => {
    setEditingId(teacher.id);
    setValue('name', teacher.name);
    setValue('email', teacher.email);
    setValue('phone', teacher.phone || '');
    setValue('joiningDate', teacher.joiningDate.split('T')[0]);
    setValue('qualification', teacher.qualification || '');
    setValue('specializedSubjects', teacher.specializedSubjects || []);
    // Ensure profileImage is also handled if we decide to use form state for it
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset({ specializedSubjects: [] });
    setPreviewUrl(null);
    setSelectedFile(null);
  };
  const onSubmit = async (data: CreateTeacherForm) => {
    try {
      let teacherId = editingId;
      if (editingId) {
        await updateTeacher(editingId, data);
        showToast('Teacher updated successfully', 'success');
      } else {
        const response = await addTeacher({
          ...data,
          isActive: true,
        }) as any;
        teacherId = response.id;
        showToast('Teacher created successfully', 'success');
      }

      // Handle photo upload if a file was selected
      if (selectedFile && teacherId) {
        try {
          setUploading(true);
          const { uploadUrl, publicUrl } = await schoolOpsApi.getPhotoUploadUrl(teacherId, selectedFile.name, selectedFile.type);
          await schoolOpsApi.uploadFileToUrl(uploadUrl, selectedFile, selectedFile.type);
          // Update teacher with the new publicUrl
          await updateTeacher(teacherId, { profileImage: publicUrl } as any);
          showToast('Photo uploaded successfully', 'success');
        } catch (uploadErr) {
          console.error('Photo upload failed:', uploadErr);
          showToast('Teacher saved, but photo upload failed', 'warning');
        } finally {
          setUploading(false);
        }
      }

      closeModal();
    } catch (e) {
      console.error(e);
      showToast('Failed to save teacher', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await removeTeacher(deleteId);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubjectNames = (subjectIds: number[]) => {
    return subjectIds.map(id => subjects.find(s => s.id === Number(id))?.name || id).join(', ');
  };

  // Prepare options for react-select
  const subjectOptions = subjects.map(subject => ({
    value: String(subject.id),
    label: `${subject.name} (${subject.code})`,
  }));

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Teachers</h1>
          <div className="flex items-center gap-2 mt-1 sm:mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage faculty members
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {teachers.length} total
            </span>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Mobile Add Button */}
          <div className="sm:hidden flex gap-2 w-full">
            <Button onClick={() => setIsModalOpen(true)} className="flex-1 justify-center">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Desktop Add Button */}
          <div className="hidden sm:flex gap-3">
            <Button onClick={() => setIsModalOpen(true)} data-testid="add-teacher-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="teacher-search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Teachers Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Teacher ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                        <div className="ml-4 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCog className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              {searchTerm ? 'No teachers found matching your search' : 'No teachers added yet'}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first teacher'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsModalOpen(true)} className="mt-6">
                <Plus className="w-4 h-4 mr-2" />
                Add First Teacher
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Teacher ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group/row"
                    data-testid="teacher-row"
                    onClick={() => navigate(`/admin/teachers/${teacher.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {teacher.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {teacher.profileImage ? (
                            <img src={teacher.profileImage} alt={teacher.name} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover/row:bg-blue-200 dark:group-hover/row:bg-blue-800 transition-colors">
                              <span className="font-medium text-blue-700 dark:text-blue-300">
                                {teacher.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white group-hover/row:text-blue-600 dark:group-hover/row:text-blue-400">
                            {teacher.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {teacher.qualification || 'No qualification'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {teacher.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="max-w-xs truncate" title={getSubjectNames(teacher.specializedSubjects)}>
                        {getSubjectNames(teacher.specializedSubjects) || 'No subjects'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(teacher)}
                          className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          data-testid="edit-teacher-btn"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteId(teacher.id)}
                          className="text-red-500 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                          data-testid="delete-teacher-btn"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Teacher" : "Add New Teacher"}
      >
        <div className="mb-6 flex justify-center">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900/50 transition-all group-hover:border-blue-500 dark:group-hover:border-blue-400 shadow-sm">
              {(previewUrl || (editingId && teachers.find(t => t.id === editingId)?.profileImage)) ? (
                <img
                  src={previewUrl || teachers.find(t => t.id === editingId)?.profileImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Plus className="w-6 h-6" />
                  <span className="text-[10px] items-center uppercase font-bold tracking-wider">Photo</span>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setSelectedFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>
            {(previewUrl || (editingId && teachers.find(t => t.id === editingId)?.profileImage)) && (
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  if (editingId) {
                    // If editing, we might want to clear the existing image
                    // For now just clear local preview
                  }
                }}
                className="absolute top-0 right-0 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 shadow-sm border border-white dark:border-gray-800"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

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
              Specialized Subjects *
            </label>
            <Controller
              name="specializedSubjects"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  options={subjectOptions}
                  value={subjectOptions.filter(option => field.value?.includes(Number(option.value)))}
                  onChange={(selected) => field.onChange(selected.map(s => Number(s.value)))}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select subjects..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: 'var(--tw-bg-opacity, 1)',
                      borderColor: errors.specializedSubjects ? '#ef4444' : '#d1d5db',
                      '&:hover': {
                        borderColor: errors.specializedSubjects ? '#ef4444' : '#9ca3af',
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: 'white',
                      zIndex: 9999,
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#dbeafe',
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#1e40af',
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: '#1e40af',
                      ':hover': {
                        backgroundColor: '#bfdbfe',
                        color: '#1e3a8a',
                      },
                    }),
                  }}
                />
              )}
            />
            {errors.specializedSubjects && (
              <p className="mt-1 text-sm text-red-600">{errors.specializedSubjects.message}</p>
            )}
            {subjects.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">
                No subjects found. Please add subjects in Academic Setup first.
              </p>
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
            <Button type="submit" disabled={isSubmitting || uploading} data-testid="submit-teacher-btn">
              {(isSubmitting || uploading) ? (
                <><span className="animate-spin mr-2">⏳</span> Processing...</>
              ) : (
                editingId ? "Save Changes" : "Add Teacher"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteId}
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
        type="danger"
      />
    </div>
  );
};
