import React, { useEffect, useState } from 'react';
import { useFees } from '../hooks/useFees';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { FeeStructureList } from '../components/FeeStructureList';
import { FeeCategoryForm } from '../components/FeeCategoryForm';
import { FeeStructureForm } from '../components/FeeStructureForm';
import { GenerateBillsTab } from '../components/GenerateBillsTab';
import { FeeLedgerTab } from '../components/FeeLedgerTab';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { useToast } from '../../../components/common/ToastContext';
import type { FeeCategoryFormData, FeeStructureFormData } from '../types/schema';
import type { FeeStructure, FeeCategory } from '../types';


export const FeeManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const {
    structures, categories, isLoading, error,
    fetchStructures, fetchCategories, createCategory, createStructure,
    updateStructure, deleteStructure, updateCategory, deleteCategory
  } = useFees();

  const { classes: opsClasses, refresh: fetchClasses } = useAcademicStructure();

  const [activeTab, setActiveTab] = useState<'structures' | 'categories' | 'generate-bills' | 'fee-ledger'>('fee-ledger');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<FeeCategory | null>(null);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [deleteStructureId, setDeleteStructureId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchStructures();
    fetchClasses();
  }, [fetchCategories, fetchStructures, fetchClasses]);

  const classes = opsClasses.map(c => ({
    id: c.id,
    name: c.className || `Grade ${c.grade}-${c.section}`
  }));

  const handleCreateOrUpdateCategory = async (data: FeeCategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        showToast('Fee category updated successfully', 'success');
      } else {
        await createCategory(data);
        showToast('Fee category created successfully', 'success');
      }
      closeCategoryModal();
    } catch (e) {
      showToast('Operation failed', 'error');
    }
  };

  const openEditCategory = (category: FeeCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleCreateOrUpdateStructure = async (data: FeeStructureFormData) => {
    try {
      if (editingStructure) {
        await updateStructure(editingStructure.id, data);
        showToast('Fee structure updated successfully', 'success');
      } else {
        await createStructure(data);
        showToast('Fee structure created successfully', 'success');
      }
      closeStructureModal();
    } catch (e) {
      showToast('Operation failed', 'error');
    }
  };

  const openEditStructure = (structure: FeeStructure) => {
    setEditingStructure(structure);
    setIsStructureModalOpen(true);
  };

  const closeStructureModal = () => {
    setIsStructureModalOpen(false);
    setEditingStructure(null);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    try {
      await deleteCategory(deleteCategoryId);
      showToast('Fee category deleted successfully', 'success');
    } catch (e) {
      showToast('Failed to delete category. It might be in use.', 'error');
    } finally {
      setDeleteCategoryId(null);
    }
  };

  const confirmDeleteStructure = async () => {
    if (!deleteStructureId) return;
    try {
      await deleteStructure(deleteStructureId);
      showToast('Fee structure deleted successfully', 'success');
    } catch (e) {
      showToast('Failed to delete structure', 'error');
    } finally {
      setDeleteStructureId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Fee Management</h1>
        {activeTab !== 'generate-bills' && (
          <Button
            onClick={() => activeTab === 'categories' ? setIsCategoryModalOpen(true) : setIsStructureModalOpen(true)}
            className="w-full sm:w-auto"
          >
            Add {activeTab === 'categories' ? 'Category' : 'Structure'}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav className="-mb-px flex space-x-8 min-w-max">
          <button
            onClick={() => setActiveTab('fee-ledger')}
            className={`${activeTab === 'fee-ledger' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Fee Ledger
          </button>
          <button
            onClick={() => setActiveTab('generate-bills')}
            className={`${activeTab === 'generate-bills' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Generate Bills
          </button>
          <button
            onClick={() => setActiveTab('structures')}
            className={`${activeTab === 'structures' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Fee Structures
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`${activeTab === 'categories' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Fee Categories
          </button>
        </nav>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded mb-4">{error}</div>}

      {isLoading && structures.length === 0 && categories.length === 0 && (
        <div className="text-gray-500 dark:text-gray-400 py-8 text-center font-medium">Loading...</div>
      )}

      {activeTab === 'structures' && (
        <FeeStructureList
          structures={structures}
          categories={categories}
          onEdit={openEditStructure}
          onDelete={setDeleteStructureId}
        />
      )}

      {activeTab === 'generate-bills' && (
        <GenerateBillsTab
          categories={categories}
          classes={classes}
        />
      )}

      {activeTab === 'fee-ledger' && (
        <FeeLedgerTab
          classes={classes}
        />
      )}

      {activeTab === 'categories' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mandatory</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cat.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cat.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cat.frequency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cat.isMandatory ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {cat.isMandatory ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditCategory(cat)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">Edit</button>
                      <button onClick={() => setDeleteCategoryId(cat.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 italic">No categories found. Create a new one.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}



      <Modal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        title={editingCategory ? "Edit Fee Category" : "New Fee Category"}
      >
        <FeeCategoryForm
          onSubmit={handleCreateOrUpdateCategory}
          onCancel={closeCategoryModal}
          isLoading={isLoading}
          initialData={editingCategory ? {
            name: editingCategory.name,
            description: editingCategory.description,
            type: editingCategory.type,
            frequency: editingCategory.frequency,
            isMandatory: editingCategory.isMandatory,
            active: editingCategory.active
          } : undefined}
        />
      </Modal>

      <Modal
        isOpen={isStructureModalOpen}
        onClose={closeStructureModal}
        title={editingStructure ? "Edit Fee Structure" : "New Fee Structure"}
      >
        <FeeStructureForm
          categories={categories}
          classes={classes}
          onSubmit={handleCreateOrUpdateStructure}
          onCancel={closeStructureModal}
          isLoading={isLoading}
          initialData={editingStructure ? {
            name: editingStructure.name,
            classId: editingStructure.classId,
            categoryId: editingStructure.categoryId,
            amount: editingStructure.amount,
            frequency: editingStructure.frequency,
            dueDateDay: editingStructure.dueDateDay,
            lateFeeAmount: editingStructure.lateFeeAmount,
            gracePeriodDays: editingStructure.gracePeriodDays,
            academicYear: editingStructure.academicYear || '2025-2026'
          } : undefined}
        />
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteCategoryId}
        title="Delete Fee Category"
        message="Are you sure you want to delete this fee category? This cannot be undone if it's already in use."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteCategory}
        onClose={() => setDeleteCategoryId(null)}
        type="danger"
      />

      <ConfirmationDialog
        isOpen={!!deleteStructureId}
        title="Delete Fee Structure"
        message="Are you sure you want to delete this fee structure? This will not affect existing transactions."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteStructure}
        onClose={() => setDeleteStructureId(null)}
        type="danger"
      />
    </div>
  );
};
