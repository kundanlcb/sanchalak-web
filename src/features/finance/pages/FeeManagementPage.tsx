import React, { useEffect, useState } from 'react';
import { useFees } from '../hooks/useFees';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { FeeStructureList } from '../components/FeeStructureList';
import { FeeCategoryForm } from '../components/FeeCategoryForm';
import { FeeStructureForm } from '../components/FeeStructureForm';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { useToast } from '../../../components/common/ToastContext';
import type { FeeCategoryFormData, FeeStructureFormData } from '../types/schema';
import type { FeeStructure } from '../types';

export const FeeManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const { 
    structures, categories, isLoading, error, 
    fetchStructures, fetchCategories, createCategory, createStructure,
    updateStructure, deleteStructure
  } = useFees();

  const { classes: opsClasses, refresh: fetchClasses } = useAcademicStructure();
  
  const [activeTab, setActiveTab] = useState<'structures' | 'categories'>('structures');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const [deleteStructureId, setDeleteStructureId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchStructures();
    fetchClasses();
  }, [fetchCategories, fetchStructures, fetchClasses]);

  const classes = opsClasses.map(c => ({
    id: c.classID,
    name: c.className || `Grade ${c.grade}-${c.section}`
  }));

  const handleCreateCategory = async (data: FeeCategoryFormData) => {
    await createCategory(data);
    setIsCategoryModalOpen(false);
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
        <h1 className="text-2xl font-bold text-gray-800">Fee Management</h1>
        <Button 
          onClick={() => activeTab === 'categories' ? setIsCategoryModalOpen(true) : setIsStructureModalOpen(true)}
          className="w-full sm:w-auto"
        >
          Add {activeTab === 'categories' ? 'Category' : 'Structure'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-8 min-w-max">
          <button
            onClick={() => setActiveTab('structures')}
            className={`${activeTab === 'structures' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Fee Structures
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`${activeTab === 'categories' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Fee Categories
          </button>
        </nav>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded mb-4">{error}</div>}
      
      {isLoading && structures.length === 0 && categories.length === 0 && (
        <div className="text-gray-500 py-8 text-center">Loading...</div>
      )}

      {activeTab === 'structures' && (
        <FeeStructureList 
          structures={structures} 
          categories={categories}
          onEdit={openEditStructure}
          onDelete={setDeleteStructureId}
        />
      )}

      {activeTab === 'categories' && (
        <div className="bg-white rounded shadow overflow-hidden border border-gray-200">
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mandatory</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {categories.map((cat) => (
                   <tr key={cat.id}>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.type}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.frequency}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cat.isMandatory ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                         {cat.isMandatory ? 'Yes' : 'No'}
                       </span>
                     </td>
                   </tr>
                 ))}
                 {categories.length === 0 && !isLoading && (
                   <tr>
                     <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No categories found. Create a new one.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      <Modal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        title="New Fee Category"
      >
        <FeeCategoryForm 
          onSubmit={handleCreateCategory} 
          onCancel={() => setIsCategoryModalOpen(false)}
          isLoading={isLoading}
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
            classId: editingStructure.classId,
            categoryId: editingStructure.categoryId,
            amount: editingStructure.amount,
            dueDateDay: editingStructure.dueDateDay,
            academicYear: '2025-2026' // Assuming mocked
          } : undefined}
        />
      </Modal>

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
