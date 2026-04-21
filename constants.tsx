
import { UserRole, Student, Teacher, NewsItem, User } from './types';

export const ADMIN_CREDENTIALS = {
  name: 'abmin',
  code: 'F008'
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'أحمد علي',
    code: '1234',
    role: UserRole.STUDENT,
    birthDate: '2010-05-12',
    grade: 'الأول',
    section: 'أ',
    warningsCount: 1,
    warnings: ['تأخير عن الدرس الأول'],
    attendance: { absent: 2, excused: 1, present: 45 },
    grades: { term1: 85, midterm: 78, term2: null },
    rating: 4,
    notes: ['طالب مجتهد'],
    parentCallRequested: false
  },
  {
    id: 's2',
    name: 'فاطمة جاسم',
    code: '5678',
    role: UserRole.STUDENT,
    birthDate: '2011-02-20',
    grade: 'الأول',
    section: 'ب',
    warningsCount: 0,
    warnings: [],
    attendance: { absent: 0, excused: 0, present: 48 },
    grades: { term1: 95, midterm: 92, term2: null },
    rating: 5,
    notes: ['ممتازة في المشاركة'],
    parentCallRequested: false
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'أ. محمد السعدي',
    code: 'T101',
    role: UserRole.TEACHER,
    subject: 'الرياضيات',
    assignedClasses: ['الأول - أ', 'الثاني - ج']
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    teacherName: 'أ. محمد السعدي',
    title: 'موعد امتحان الرياضيات',
    content: 'يرجى العلم أن امتحان الشهر الأول لمادة الرياضيات سيكون يوم الثلاثاء القادم.',
    date: new Date().toISOString()
  }
];

export const INITIAL_ADMINS: User[] = [
  {
    id: 'a1',
    name: 'عبد الصمد القرشي',
    code: 'f008',
    role: UserRole.ADMIN
  }
];
