
import React, { useState } from 'react';
import { Teacher, Student, NewsItem, UserRole } from '../types';
import { 
  Users, Star, AlertTriangle, PhoneCall, 
  StickyNote, PlusCircle, CheckCircle, Search, Filter, Clock, FileText
} from 'lucide-react';

interface Props {
  teacher: Teacher;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  addNotification: (userId: string, type: 'warning' | 'parentCall' | 'attendance' | 'news', message: string) => void;
}

const DashboardTeacher: React.FC<Props> = ({ 
  teacher, students, setStudents, news, setNews, addNotification 
}) => {
  const [selectedClass, setSelectedClass] = useState(teacher.assignedClasses[0] || "");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(s => {
    const classMatch = `${s.grade} - ${s.section}` === selectedClass;
    const searchMatch = s.name.includes(searchTerm);
    return classMatch && searchMatch;
  });

  const handleRating = (studentId: string, rating: number) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, rating } : s));
  };

  const addWarning = (studentId: string, reason: string) => {
    if (!reason) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        addNotification(s.id, 'warning', `تحذير جديد: ${reason}`);
        return { 
          ...s, 
          warningsCount: s.warningsCount + 1, 
          warnings: [...s.warnings, reason] 
        };
      }
      return s;
    }));
    alert('تم إضافة التحذير بنجاح');
  };

  const requestParentCall = (studentId: string, reason: string) => {
    if (!reason) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        addNotification(s.id, 'parentCall', `استدعاء ولي أمر: ${reason}`);
        return { ...s, parentCallRequested: true, parentCallReason: reason };
      }
      return s;
    }));
    alert('تم طلب استدعاء ولي الأمر');
  };

  const addNote = (studentId: string, note: string) => {
    if (!note) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, notes: [...s.notes, note] };
      }
      return s;
    }));
    alert('تم إضافة الملاحظة');
  };

  const updateAttendance = (studentId: string, type: 'present' | 'absent' | 'excused', value: number) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendance: { ...s.attendance, [type]: value } } : s));
  };

  const updateGrade = (studentId: string, term: 'term1' | 'midterm' | 'term2', value: number | null) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, grades: { ...s.grades, [term]: value } } : s));
  };

  const postNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) return;
    const newItem: NewsItem = {
      id: Math.random().toString(36).substr(2, 9),
      teacherName: teacher.name,
      title: newsTitle,
      content: newsContent,
      date: new Date().toISOString()
    };
    setNews(prev => [newItem, ...prev]);
    addNotification('all', 'news', `خبر جديد من ${teacher.name}: ${newsTitle}`);
    setNewsTitle("");
    setNewsContent("");
    alert('تم نشر الخبر بنجاح');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Welcome Section */}
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
        <img src="https://picsum.photos/seed/school-front/1200/400" alt="school" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-transparent flex items-center p-8">
          <div className="text-white">
            <h2 className="text-3xl font-black mb-2">أهلاً بك، {teacher.name}</h2>
            <p className="text-teal-100 flex items-center gap-2 font-bold">
              <CheckCircle size={18} /> مدرسة متوسطة أم أبيها المختلطة
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h3 className="text-xl font-black flex items-center gap-2 text-gray-800">
                <Users className="text-teal-600" size={24} /> إدارة الطلاب
              </h3>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="بحث عن طالب..." 
                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-black font-bold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <select 
                  className="bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 text-black font-bold"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {teacher.assignedClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-black tracking-widest">
                  <tr>
                    <th className="p-4 rounded-r-xl">الاسم</th>
                    <th className="p-4">التقييم</th>
                    <th className="p-4">التحذيرات</th>
                    <th className="p-4 rounded-l-xl text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-teal-50/30 transition-colors">
                      <td className="p-4 font-black text-gray-800">{student.name}</td>
                      <td className="p-4">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(star => (
                            <Star 
                              key={star} 
                              size={16} 
                              onClick={() => handleRating(student.id, star)}
                              className={`cursor-pointer transition-all ${star <= student.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 hover:text-yellow-200"}`} 
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${student.warningsCount > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {student.warningsCount} تحذير
                        </span>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-teal-700 transition-all shadow-md shadow-teal-50"
                        >
                          إدارة
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="text-center py-20 text-gray-300 font-bold">
                  لا يوجد طلاب مطابقين للبحث
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Publish News Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-black flex items-center gap-2 mb-6 text-gray-800">
              <PlusCircle className="text-teal-600" size={24} /> نشر خبر جديد
            </h3>
            <form onSubmit={postNews} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">عنوان الخبر</label>
                <input 
                  type="text" 
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-black font-bold"
                  placeholder="مثال: موعد الرحلة المدرسية"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">نص الخبر</label>
                <textarea 
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-black font-bold"
                  placeholder="اكتب تفاصيل الخبر هنا..."
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-50 transform active:scale-95 transition-all"
              >
                نشر الخبر للطلاب
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Student Action Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-teal-700 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black">{selectedStudent.name}</h3>
                <p className="text-teal-100 font-bold mt-1">الصف {selectedStudent.grade} - شعبة {selectedStudent.section}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-teal-100 hover:text-white bg-white/10 p-2 rounded-full transition-colors">✕</button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Attendance Section */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                  <Clock size={18} className="text-blue-500" /> سجل الحضور والغياب
                </label>
                <div className="grid grid-cols-3 gap-3">
                   <div className="space-y-1">
                     <span className="text-[10px] font-bold text-green-600 block text-center">حاضر</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.attendance.present || 0}
                       onChange={(e) => updateAttendance(selectedStudent.id, 'present', parseInt(e.target.value) || 0)}
                       className="w-full p-2 bg-green-50 border border-green-100 rounded-lg text-center font-bold text-sm"
                     />
                   </div>
                   <div className="space-y-1">
                     <span className="text-[10px] font-bold text-red-600 block text-center">غائب</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.attendance.absent || 0}
                       onChange={(e) => updateAttendance(selectedStudent.id, 'absent', parseInt(e.target.value) || 0)}
                       className="w-full p-2 bg-red-50 border border-red-100 rounded-lg text-center font-bold text-sm"
                     />
                   </div>
                   <div className="space-y-1">
                     <span className="text-[10px] font-bold text-blue-600 block text-center">مجاز</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.attendance.excused || 0}
                       onChange={(e) => updateAttendance(selectedStudent.id, 'excused', parseInt(e.target.value) || 0)}
                       className="w-full p-2 bg-blue-50 border border-blue-100 rounded-lg text-center font-bold text-sm"
                     />
                   </div>
                </div>
              </div>

              {/* Grades Section */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                  <FileText size={18} className="text-purple-500" /> رصد الدرجات للمادة
                </label>
                <div className="grid grid-cols-3 gap-3">
                   <div className="space-y-1">
                     <span className="text-[10px] font-bold text-gray-500 block text-center">نصف السنة</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.grades.midterm || ""}
                       onChange={(e) => updateGrade(selectedStudent.id, 'midterm', e.target.value === "" ? null : parseInt(e.target.value))}
                       className="w-full p-2 bg-gray-50 border rounded-lg text-center font-bold text-sm"
                       placeholder="--"
                     />
                   </div>
                   <div className="space-y-1">
                     <span className="text-[10px] font-bold text-gray-500 block text-center">الفصل الأول</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.grades.term1 || ""}
                       onChange={(e) => updateGrade(selectedStudent.id, 'term1', e.target.value === "" ? null : parseInt(e.target.value))}
                       className="w-full p-2 bg-gray-50 border rounded-lg text-center font-bold text-sm"
                       placeholder="--"
                     />
                   </div>
                   <div className="space-y-1">
                     <span className="text-[10px] font-bold text-gray-500 block text-center">الفصل الثاني</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.grades.term2 || ""}
                       onChange={(e) => updateGrade(selectedStudent.id, 'term2', e.target.value === "" ? null : parseInt(e.target.value))}
                       className="w-full p-2 bg-gray-50 border rounded-lg text-center font-bold text-sm"
                       placeholder="--"
                     />
                   </div>
                </div>
              </div>

              {/* Warning Action */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                  <AlertTriangle size={18} className="text-red-500" /> إضافة تحذير رسمي
                </label>
                <div className="flex gap-2">
                  <input 
                    id="warning-input"
                    type="text" 
                    placeholder="سبب التحذير..." 
                    className="flex-1 p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-black font-bold"
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('warning-input') as HTMLInputElement;
                      addWarning(selectedStudent.id, input.value);
                      input.value = "";
                    }}
                    className="bg-red-500 text-white px-6 py-4 rounded-xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-50"
                  >
                    إرسال
                  </button>
                </div>
              </div>

              {/* Parent Call Action */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                  <PhoneCall size={18} className="text-blue-500" /> استدعاء ولي أمر
                </label>
                <div className="flex gap-2">
                  <input 
                    id="call-input"
                    type="text" 
                    placeholder="سبب الاستدعاء..." 
                    className="flex-1 p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-black font-bold"
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('call-input') as HTMLInputElement;
                      requestParentCall(selectedStudent.id, input.value);
                      input.value = "";
                    }}
                    className="bg-blue-500 text-white px-6 py-4 rounded-xl font-black hover:bg-blue-600 transition-all shadow-lg shadow-blue-50"
                  >
                    طلب
                  </button>
                </div>
              </div>

              {/* Note Action */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                  <StickyNote size={18} className="text-teal-500" /> إضافة ملاحظة في السجل
                </label>
                <div className="flex gap-2">
                  <input 
                    id="note-input"
                    type="text" 
                    placeholder="اكتب ملاحظة تظهر للطالب..." 
                    className="flex-1 p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-black font-bold"
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('note-input') as HTMLInputElement;
                      addNote(selectedStudent.id, input.value);
                      input.value = "";
                    }}
                    className="bg-teal-500 text-white px-6 py-4 rounded-xl font-black hover:bg-teal-600 transition-all shadow-lg shadow-teal-50"
                  >
                    حفظ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTeacher;
