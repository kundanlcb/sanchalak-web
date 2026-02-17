import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, School } from 'lucide-react';
import { type Class, ClassSchema } from '../types';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Skeleton } from '../../../components/common/Skeleton';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';

const CreateClassSchema = ClassSchema.omit({ classID: true });
type ClassFormValues = z.infer<typeof CreateClassSchema>;

interface ClassManagerProps {
  classes: Class[];
  addClass: (data: Partial<Class>) => Promise<any>;
  updateClass?: (id: string, data: Partial<Class>) => Promise<any>;
  deleteClass?: (id: string) => Promise<void>;
  loading: boolean;
}

export const ClassManager: React.FC<ClassManagerProps> = ({
  classes,
  addClass,
  updateClass,
  deleteClass,
  loading
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ClassFormValues>({
    resolver: zodResolver(CreateClassSchema),
  });

  const handleEdit = (cls: Class) => {
    setEditingId(cls.classID);
    setValue('grade', cls.grade);
    setValue('section', cls.section);
    setValue('className', cls.className || '');
    setValue('room', cls.room || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = async (data: ClassFormValues) => {
    try {
      if (editingId && updateClass) {
        await updateClass(editingId, data);
      } else {
        await addClass(data);
      }
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId || !deleteClass) return;
    try {
      await deleteClass(deleteId);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredClasses = classes.filter(cls =>
    (cls.className?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    cls.grade.toString().includes(searchTerm) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <School className="w-5 h-5 text-orange-500" />
            Classes
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage school classes and sections</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              {classes.length} total
            </span>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          {/* Mobile Button */}
          <div className="sm:hidden">
            <Button onClick={() => setIsModalOpen(true)} className="w-full justify-center">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Desktop Button */}
          <div className="hidden sm:block">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by grade, section, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Classes Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-16 ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <School className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              {searchTerm ? 'No classes found matching your search' : 'No classes defined yet'}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first class'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsModalOpen(true)} className="mt-6">
                <Plus className="w-4 h-4 mr-2" />
                Add First Class
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredClasses.map((cls) => (
                  <tr key={cls.classID} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {cls.classID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {cls.className || `Grade ${cls.grade}-${cls.section}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {cls.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {cls.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                        {cls.room || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        {updateClass && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(cls)}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                          </Button>
                        )}
                        {deleteClass && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteId(cls.classID)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                          </Button>
                        )}
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
        title={editingId ? "Edit Class" : "Add New Class"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Grade (Number)"
              type="number"
              placeholder="e.g. 10"
              error={errors.grade?.message}
              {...register('grade')}
            />
            <Input
              label="Section"
              placeholder="e.g. A"
              error={errors.section?.message}
              {...register('section')}
            />
          </div>
          <Input
            label="Class Name (Optional)"
            placeholder="e.g. Grade 10-A"
            error={errors.className?.message}
            {...register('className')}
          />
          <Input
            label="Room Number"
            placeholder="e.g. 101"
            error={errors.room?.message}
            {...register('room')}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {editingId ? "Save Changes" : "Add Class"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      {deleteClass && (
        <ConfirmationDialog
          isOpen={!!deleteId}
          title="Delete Class"
          message="Are you sure you want to delete this class? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onClose={() => setDeleteId(null)}
          type="danger"
        />
      )}
    </div>
  );
};
