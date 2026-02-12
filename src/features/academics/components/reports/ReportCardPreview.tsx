import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { ReportCardDocument } from './ReportCardDocument';

// Same interface as Document
interface ReportData {
  student: { name: string; rollNumber: string; class: string; section: string };
  exam: { name: string; year: string };
  marks: Array<{ subject: string; max: number; obtained: number; grade: string }>;
  summary: { totalMax: number; totalObtained: number; percentage: number; finalGrade: string };
}

interface ReportCardPreviewProps {
  data: ReportData;
}

export const ReportCardPreview: React.FC<ReportCardPreviewProps> = ({ data }) => {
  return (
    <div className="w-full h-screen border rounded-lg overflow-hidden">
      <PDFViewer width="100%" height="100%" className='rounded-lg'>
        <ReportCardDocument data={data} />
      </PDFViewer>
    </div>
  );
};
