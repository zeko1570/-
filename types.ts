
export enum UserRole {
  STUDENT = 'طالب',
  TEACHER = 'مدرس',
  ADMIN = 'أدمن'
}

export interface User {
  id: string;
  name: string;
  code: string;
  role: UserRole;
}

export interface Student extends User {
  birthDate: string;
  grade: string;
  section: string;
  warningsCount: number;
  warnings: string[];
  attendance: {
    absent: number;
    excused: number;
    present: number;
  };
  grades: {
    term1: number | null;
    midterm: number | null;
    term2: number | null;
  };
  rating: number; // 1-5
  notes: string[];
  parentCallRequested: boolean;
  parentCallReason?: string;
}

export interface Teacher extends User {
  subject: string;
  assignedClasses: string[]; // e.g. "الأول - أ"
}

export interface NewsItem {
  id: string;
  teacherName: string;
  title: string;
  content: string;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'warning' | 'parentCall' | 'attendance' | 'news';
  message: string;
  date: string;
}
