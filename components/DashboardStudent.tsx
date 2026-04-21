
import React from 'react';
import { Student, NewsItem } from '../types';
import { 
  User, Calendar, BookOpen, AlertCircle, 
  Clock, Star, FileText, Newspaper 
} from 'lucide-react';

interface Props {
  student: Student;
  news: NewsItem[];
}

const DashboardStudent: React.FC<Props> = ({ student, news }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-teal-100 flex flex-col md:flex-row justify-between gap-6 items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <div className="flex gap-4 text-gray-500 text-sm mt-1">
              <span className="flex items-center gap-1"><BookOpen size={14} /> الصف: {student.grade} - {student.section}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> التولد: {student.birthDate}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-xl border border-yellow-200">
          <AlertCircle size={20} />
          <span className="font-bold">عدد التحذيرات: {student.warningsCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Statistics */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="text-blue-500" size={20} /> الحضور والغياب
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700">دوام فعلي</span>
              <span className="font-bold">{student.attendance.present} يوم</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700">غياب</span>
              <span className="font-bold">{student.attendance.absent} يوم</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700">مجاز</span>
              <span className="font-bold">{student.attendance.excused} يوم</span>
            </div>
          </div>
        </div>

        {/* Grades Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="text-purple-500" size={20} /> النتائج الدراسية
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border-b">
              <span className="text-gray-600">الفصل الأول</span>
              <span className="font-bold text-teal-600">{student.grades.term1 || '--'}</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b">
              <span className="text-gray-600">نصف السنة</span>
              <span className="font-bold text-teal-600">{student.grades.midterm || '--'}</span>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-gray-600">الفصل الثاني</span>
              <span className="font-bold text-teal-600">{student.grades.term2 || '--'}</span>
            </div>
          </div>
        </div>

        {/* Evaluation & Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Star className="text-orange-500" size={20} /> التقييم والملاحظات
          </h3>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                size={24} 
                className={star <= student.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
              />
            ))}
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {student.notes.length > 0 ? (
              student.notes.map((note, idx) => (
                <div key={idx} className="text-sm bg-gray-50 p-2 rounded border-r-2 border-teal-500">
                  {note}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">لا توجد ملاحظات حالياً</p>
            )}
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Newspaper className="text-teal-600" size={20} /> آخر الأخبار والتبليغات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.length > 0 ? (
            news.map(item => (
              <div key={item.id} className="p-4 border rounded-xl hover:bg-teal-50 transition-colors border-teal-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-teal-800">{item.title}</span>
                  <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('ar-IQ')}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                <div className="text-xs font-semibold text-teal-600">بواسطة: {item.teacherName}</div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 py-10">لا توجد أخبار حالياً</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
