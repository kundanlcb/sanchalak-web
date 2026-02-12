import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { useToast } from '../../../components/common/ToastContext';
import { createStudent, updateStudent, getStudent } from '../services/studentService';

// Validation Schema
const studentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  rollNumber: z.coerce.number().min(1, 'Roll number is required'),
  classID: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other'] as const),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const).optional(),
  
  mobileNumber: z.string().regex(/^\d{10}$/, 'Valid 10-digit mobile number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(1, 'Pincode is required'),
    country: z.string(),
  }),
  
  primaryParent: z.object({
    name: z.string().min(1, 'Parent name is required'),
    relationship: z.enum(['Father', 'Mother', 'Guardian', 'Other'] as const),
    mobileNumber: z.string().regex(/^\d{10}$/, 'Valid 10-digit mobile number is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    occupation: z.string().optional(),
    isPrimaryContact: z.boolean(),
  }),
});

type StudentFormData = z.infer<typeof studentSchema>;

export const StudentForm: React.FC = () => {
  const { studentID } = useParams<{ studentID: string }>();
  const isEditMode = !!studentID;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: 'Male',
      academicYear: '2025-2026', // Default for now
      address: {
        country: 'India',
        state: 'Maharashtra', // Default useful for local context
      },
      primaryParent: {
        relationship: 'Father',
        isPrimaryContact: true,
      }
    }
  });

  // Fetch student data if in edit mode
  useEffect(() => {
    if (isEditMode && studentID) {
      const fetchStudent = async () => {
        try {
          const response = await getStudent(studentID);
          const data = response.student;
          // Map data to form structure
          reset({
             name: data.name,
             admissionNumber: data.admissionNumber,
             admissionDate: data.admissionDate.split('T')[0],
             rollNumber: data.rollNumber,
             classID: data.classID,
             section: data.section,
             academicYear: data.academicYear,
             dateOfBirth: data.dateOfBirth.split('T')[0],
             gender: data.gender,
             bloodGroup: data.bloodGroup,
             mobileNumber: data.mobileNumber,
             email: data.email || '',
             address: data.address,
             primaryParent: {
               ...data.primaryParent,
               email: data.primaryParent.email || '',
             }
          });
        } catch (err) {
          console.error('Failed to fetch student:', err);
          showToast('Failed to load student details', 'error');
          navigate('/students');
        } finally {
          setInitialLoading(false);
        }
      };
      
      fetchStudent();
    }
  }, [isEditMode, studentID, reset, showToast, navigate]);

  const onSubmit = async (data: StudentFormData) => {
    setLoading(true);
    try {
      if (isEditMode && studentID) {
        await updateStudent({
          studentID,
          ...data,
          // Ensure dates are properly formatted if needed by backend, though YYYY-MM-DD usually works
        });
        showToast('Student updated successfully', 'success');
      } else {
        await createStudent(data);
        showToast('Student created successfully', 'success');
      }
      navigate('/students');
    } catch (err) {
      console.error('Failed to save student:', err);
      showToast(isEditMode ? 'Failed to update student' : 'Failed to create student', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Academic Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Academic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Input
               label="Admission Number"
               required
               {...register('admissionNumber')}
               error={errors.admissionNumber?.message}
               placeholder="ADMIN-202X-XXX"
             />
             <Input
               label="Admission Date"
               type="date"
               required
               {...register('admissionDate')}
               error={errors.admissionDate?.message}
             />
             <Input
               label="Academic Year"
               required
               {...register('academicYear')}
               error={errors.academicYear?.message}
             />
             
             {/* Class Selection - Ideally this would be a dynamic select from API */}
             <div className="space-y-1">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                 Class <span className="text-red-500">*</span>
               </label>
               <Controller
                 name="classID"
                 control={control}
                 render={({ field }) => (
                   <select
                     className="w-full h-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                     {...field}
                   >
                     <option value="">Select Class</option>
                     <option value="CLS-2026-00001">Class 1</option>
                     <option value="CLS-2026-00002">Class 2</option>
                     <option value="CLS-2026-00003">Class 3</option>
                     <option value="CLS-2026-00004">Class 4</option>
                     <option value="CLS-2026-00005">Class 5</option>
                     <option value="CLS-2026-00010">Class 10</option>
                   </select>
                 )}
               />
               {errors.classID && <p className="text-sm text-red-500 mt-1">{errors.classID.message}</p>}
             </div>

             <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Section <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="section"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="w-full h-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      {...field}
                    >
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  )}
                />
                {errors.section && <p className="text-sm text-red-500 mt-1">{errors.section.message}</p>}
             </div>

             <Input
               label="Roll Number"
               type="number"
               required
               {...register('rollNumber')}
               error={errors.rollNumber?.message}
             />
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <span className="w-1 h-6 bg-green-500 rounded-full"></span>
             Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Full Name"
                required
                {...register('name')}
                error={errors.name?.message}
                placeholder="First Middle Last"
              />
            </div>
            
            <Input
              label="Date of Birth"
              type="date"
              required
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
            />

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="w-full h-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      {...field}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                />
             </div>

             <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Blood Group
                </label>
                <Controller
                  name="bloodGroup"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="w-full h-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      {...field}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  )}
                />
             </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
             Contact Details
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Student Mobile Number"
                required
                {...register('mobileNumber')}
                error={errors.mobileNumber?.message}
                maxLength={10}
              />
              <Input
                label="Student Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
              />
           </div>
           
           <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Address</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <Input
                  label="Street Address"
                  required
                  {...register('address.street')}
                  error={errors.address?.street?.message}
                />
              </div>
              <Input
                label="City"
                required
                {...register('address.city')}
                error={errors.address?.city?.message}
              />
              <Input
                label="State"
                required
                {...register('address.state')}
                error={errors.address?.state?.message}
              />
              <Input
                label="Pincode"
                required
                {...register('address.pincode')}
                error={errors.address?.pincode?.message}
                maxLength={6}
              />
           </div>
        </div>

        {/* Parent Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
             Primary Parent / Guardian
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Parent Name"
                required
                {...register('primaryParent.name')}
                error={errors.primaryParent?.name?.message}
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="primaryParent.relationship"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="w-full h-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      {...field}
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                />
             </div>

             <Input
                label="Mobile Number"
                required
                {...register('primaryParent.mobileNumber')}
                error={errors.primaryParent?.mobileNumber?.message}
                maxLength={10}
              />
              <Input
                label="Email"
                type="email"
                {...register('primaryParent.email')}
                error={errors.primaryParent?.email?.message}
              />
              <Input
                label="Occupation"
                {...register('primaryParent.occupation')}
              />
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" type="button" onClick={() => navigate('/students')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? 'Update Student' : 'Create Student'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
