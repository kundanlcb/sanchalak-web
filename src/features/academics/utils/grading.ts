export const calculateGrade = (percentage: number): { grade: string; points: number; remarks: string } => {
  if (percentage >= 90) return { grade: 'A+', points: 10, remarks: 'Outstanding' };
  if (percentage >= 80) return { grade: 'A', points: 9, remarks: 'Excellent' };
  if (percentage >= 70) return { grade: 'B+', points: 8, remarks: 'Very Good' };
  if (percentage >= 60) return { grade: 'B', points: 7, remarks: 'Good' };
  if (percentage >= 50) return { grade: 'C', points: 6, remarks: 'Average' };
  if (percentage >= 40) return { grade: 'D', points: 5, remarks: 'Pass' };
  return { grade: 'F', points: 0, remarks: 'Fail' };
};

export const calculateTotalAndPercentage = (marksObtained: number, maxMarks: number) => {
    if (maxMarks === 0) return { percentage: 0 };
    const percentage = (marksObtained / maxMarks) * 100;
    return { percentage: parseFloat(percentage.toFixed(2)) };
};
