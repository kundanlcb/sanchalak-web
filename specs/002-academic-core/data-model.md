# Data Model: Academic Core

**Feature**: Academic Core (Phase 2)

## Entities

### ExamTerm
Represents a major assessment period.
```typescript
interface ExamTerm {
  id: string; // "term_001"
  name: string; // "Mid-Term 2026"
  academicYear: string; // "2025-2026"
  startDate: string; // ISO Date "2026-03-15"
  endDate: string; // ISO Date "2026-03-22"
  isActive: boolean; // true
  classes: string[]; // ["class_5a", "class_5b"] - IDs of classes participating
}
```

### Subject (Refinement from Phase 1)
Subjects configured for specific classes.
```typescript
interface Subject {
  id: string; // "subj_math_5"
  name: string; // "Mathematics"
  code: string; // "MATH05"
  classId: string; // "class_5a"
  maxMarks: number; // 100
  passingMarks: number; // 35
}
```

### MarkEntry
A single mark record.
```typescript
interface MarkEntry {
  id: string; // "mark_101"
  studentId: string; // "stu_001"
  examTermId: string; // "term_001"
  subjectId: string; // "subj_math_5"
  marksObtained: number; // 85.5
  remarks?: string; // "Excellent"
  lastUpdated: string; // ISO Timestamp
}
```

### Homework
Digital diary entries.
```typescript
interface Homework {
  id: string; // "hw_999"
  classId: string; // "class_5a"
  subjectId: string; // "subj_math_5"
  title: string; // "Algebra Exercise 4.2"
  description: string; // "Complete questions 1-10"
  dueDate: string; // ISO Date
  attachments: HomeworkAttachment[];
  createdAt: string;
}

interface HomeworkAttachment {
  id: string;
  name: string; // "worksheet.pdf"
  url: string; // Mock URL
  type: "image" | "pdf";
}
```

## Relationships

*   **1 ExamTerm** has **Many MarkEntries**.
*   **1 Student** has **Many MarkEntries** (across subjects/exams).
*   **1 Class** has **Many Subjects**.
*   **1 Class** has **Many Homeworks**.

## Mock Data Files
*   `src/mocks/data/exams.json`: Array of `ExamTerm`.
*   `src/mocks/data/subjects.json`: Array of `Subject`.
*   `src/mocks/data/marks.json`: Flat list of `MarkEntry`.
*   `src/mocks/data/homework.json`: Array of `Homework`.
