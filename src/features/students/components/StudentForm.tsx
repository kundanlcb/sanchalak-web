import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Plus, Upload, Trash2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { useToast } from '../../../components/common/ToastContext';
import { createStudent, updateStudent, getStudent } from '../services/studentService';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { DOMAINS, getMasterValues, type MasterValue } from '../../../services/api/masterDataService';

// Validation Schema
const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  rollNumber: z.coerce.number().min(1, 'Roll number is required'),
  classId: z.coerce.number().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  academicYear: z.string().min(1, 'Academic year is required'),

  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  bloodGroup: z.string().optional(),

  mobileNumber: z.string().regex(/^\d{10}$/, 'Valid 10-digit mobile number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),

  // New identity fields — all optional for backward compat
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  studentAadhar: z.string().regex(/^\d{12}$/, 'Must be 12 digits').optional().or(z.literal('')),
  fatherAadhar: z.string().regex(/^\d{12}$/, 'Must be 12 digits').optional().or(z.literal('')),
  motherAadhar: z.string().regex(/^\d{12}$/, 'Must be 12 digits').optional().or(z.literal('')),
  nationality: z.string().optional(),
  isDisabled: z.boolean().optional(),
  photoUrl: z.string().optional(),

  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(1, 'Pincode is required'),
    country: z.string(),
    village: z.string().optional(),
    district: z.string().optional(),
  }),

  primaryParent: z.object({
    name: z.string().min(1, 'Parent name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    mobileNumber: z.string().regex(/^\d{10}$/, 'Valid 10-digit mobile number is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    occupation: z.string().optional(),
    isPrimaryContact: z.boolean(),
  }),
});

type StudentFormData = z.infer<typeof studentSchema>;

export const StudentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = id ? Number(id) : undefined;
  const isEditMode = !!studentId;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Start true to load masters
  const { classes } = useAcademicStructure();
  const [genders, setGenders] = useState<MasterValue[]>([]);
  const [bloodGroups, setBloodGroups] = useState<MasterValue[]>([]);
  const [relations, setRelations] = useState<MasterValue[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: '',
      academicYear: '2025-2026', // Default for now
      address: {
        country: 'India',
        state: 'Maharashtra', // Default useful for local context
      },
      primaryParent: {
        relationship: '',
        isPrimaryContact: true,
      }
    }
  });

  // Fetch Master Data and Student Data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Parallel fetch for master data
        const [genderList, bloodGroupList, relationList] = await Promise.all([
          getMasterValues(DOMAINS.GENDER),
          getMasterValues(DOMAINS.BLOOD_GROUP),
          getMasterValues(DOMAINS.RELATION)
        ]);

        setGenders(genderList);
        setBloodGroups(bloodGroupList);
        setRelations(relationList);

        // If edit mode, fetch student
        if (isEditMode && studentId) {
          const response = await getStudent(studentId);
          const data = response.student;

          reset({
            firstName: data.firstName || '',
            middleName: data.middleName || '',
            lastName: data.lastName || '',
            admissionNumber: data.admissionNumber,
            admissionDate: data?.admissionDate ? data.admissionDate.split('T')[0] : '',
            rollNumber: data.rollNumber,
            classId: data.classId,
            section: data.section,
            academicYear: data.academicYear || '2025-2026',
            dateOfBirth: data?.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
            gender: data.gender,
            bloodGroup: data.bloodGroup || '',
            mobileNumber: data.mobileNumber,
            email: data.email || '',
            photoUrl: data.profilePhoto || '',
            address: data.address,
            primaryParent: {
              name: data?.primaryParent?.name || '',
              relationship: data?.primaryParent?.relationship || '',
              mobileNumber: data?.primaryParent?.mobileNumber || '',
              email: data?.primaryParent?.email || '',
              occupation: data?.primaryParent?.occupation || '',
              isPrimaryContact: data?.primaryParent?.isPrimaryContact ?? true,
            } as any
          });
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        showToast('Failed to load data', 'error');
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [isEditMode, studentId, reset, showToast]);

  const onSubmit = async (data: StudentFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        name: `${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`.trim(),
        rollNo: data.rollNumber,
        classId: Number(data.classId)
      };

      if (isEditMode && studentId) {
        await updateStudent({
          id: studentId,
          ...payload
        } as any);
        showToast('Student updated successfully', 'success');
      } else {
        const response = await createStudent(payload as any);
        const newId = response.id;

        // If there's a selected file, upload it now
        if (selectedFile && newId) {
          try {
            const { uploadUrl, publicUrl } = await import('../services/studentService').then(s => s.getPhotoUploadUrl(newId, selectedFile.name, selectedFile.type));
            await import('../services/studentService').then(s => s.uploadFileToUrl(uploadUrl, selectedFile, selectedFile.type));
            // Note: Since we're navigating away, we don't strictly need to update the student record with photoUrl here 
            // but the backend handles it via publicUrl in getPhotoUploadUrl? 
            // Wait, the backend doesn't automatically save the photoUrl to the student. 
            // The frontend should send another update or the publicUrl should be part of the initial payload.
            // But for new students, we don't have the ID yet to generate the key.
            // So we MUST update the student record AFTER upload.
            await updateStudent({ id: newId, photoUrl: publicUrl } as any);
          } catch (uploadErr) {
            console.error('Photo upload failed:', uploadErr);
            showToast('Student created, but photo upload failed', 'warning');
          }
        }

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

            {/* Class Selection */}
            <Controller
              name="classId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Class"
                  required
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                  error={errors.classId?.message}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className || `Grade ${cls.grade}-${cls.section}`}
                    </option>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <Select
                  label="Section"
                  required
                  {...field}
                  error={errors.section?.message}
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </Select>
              )}
            />

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
            {/* Premium Photo Row - Dedicated */}
            <div className="md:col-span-3 flex justify-center sm:justify-start pb-6 mb-2">
              <div className="relative group">
                <div className="h-28 w-28 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900/50 transition-all group-hover:border-blue-500 dark:group-hover:border-blue-400 shadow-sm">
                  {(previewUrl || control._formValues.photoUrl) ? (
                    <img src={previewUrl || control._formValues.photoUrl} alt="Student" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <Plus className="w-8 h-8" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Photo</span>
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // For both edit and create modes, show preview
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                      setSelectedFile(file);

                      if (isEditMode && studentId) {
                        try {
                          setLoading(true);
                          const { uploadUrl, publicUrl } = await import('../services/studentService').then(s => s.getPhotoUploadUrl(studentId, file.name, file.type));
                          await import('../services/studentService').then(s => s.uploadFileToUrl(uploadUrl, file, file.type));
                          reset({ ...control._formValues, photoUrl: publicUrl });
                          showToast('Photo uploaded successfully', 'success');
                          setPreviewUrl(null); // Clear preview once uploaded
                          setSelectedFile(null);
                        } catch (err) {
                          showToast('Failed to upload photo', 'error');
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                  />
                </div>
                {(previewUrl || control._formValues.photoUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      reset({ ...control._formValues, photoUrl: '' });
                    }}
                    className="absolute top-0 right-0 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-sm z-20 border border-white dark:border-gray-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="absolute -bottom-2 -left-2 -right-2 text-center pointer-events-none">
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-700">
                    {(previewUrl || control._formValues.photoUrl) ? 'Change' : 'Upload'}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="First Name"
                required
                {...register('firstName')}
                error={errors.firstName?.message}
                placeholder="First Name"
                className="text-lg font-semibold"
              />
              <Input
                label="Middle Name"
                {...register('middleName')}
                placeholder="Middle Name"
                className="text-lg font-semibold"
              />
              <Input
                label="Last Name"
                required
                {...register('lastName')}
                error={errors.lastName?.message}
                placeholder="Last Name"
                className="text-lg font-semibold"
              />
            </div>

            <Input
              label="Date of Birth"
              type="date"
              required
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  label="Gender"
                  required
                  {...field}
                  error={errors.gender?.message}
                >
                  <option value="">Select Gender</option>
                  {genders.map((g) => (
                    <option key={g.code} value={g.code}>{g.label}</option>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="bloodGroup"
              control={control}
              render={({ field }) => (
                <Select
                  label="Blood Group"
                  {...field}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg.code} value={bg.code}>{bg.label}</option>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>

        {/* Aadhar & Identity Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
            Identity & Aadhar Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Father's Name"
              {...register('fatherName')}
              placeholder="Father's full name"
            />
            <Input
              label="Mother's Name"
              {...register('motherName')}
              placeholder="Mother's full name"
            />
            <div /> {/* spacer */}

            <Input
              label="Student Aadhar No."
              {...register('studentAadhar')}
              placeholder="12-digit Aadhar number"
              maxLength={12}
              error={errors.studentAadhar?.message}
            />
            <Input
              label="Father's Aadhar No."
              {...register('fatherAadhar')}
              placeholder="12-digit Aadhar number"
              maxLength={12}
              error={errors.fatherAadhar?.message}
            />
            <Input
              label="Mother's Aadhar No."
              {...register('motherAadhar')}
              placeholder="12-digit Aadhar number"
              maxLength={12}
              error={errors.motherAadhar?.message}
            />

            <Input
              label="Nationality"
              {...register('nationality')}
              placeholder="Indian"
            />

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Disability
              </label>
              <Controller
                name="isDisabled"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="false"
                        checked={field.value === false || field.value === undefined}
                        onChange={() => field.onChange(false)}
                        className="accent-blue-500"
                      />
                      <span className="text-sm">No</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="true"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        className="accent-blue-500"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </div>
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
            <Input
              label="Village"
              {...register('address.village')}
              placeholder="Village name"
            />
            <Input
              label="District"
              {...register('address.district')}
              placeholder="District name"
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

            <Controller
              name="primaryParent.relationship"
              control={control}
              render={({ field }) => (
                <Select
                  label="Relationship"
                  required
                  {...field}
                  error={errors.primaryParent?.relationship?.message}
                >
                  <option value="">Select Relationship</option>
                  {relations.map((r) => (
                    <option key={r.code} value={r.code}>{r.label}</option>
                  ))}
                </Select>
              )}
            />

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
