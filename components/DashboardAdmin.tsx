
import React, { useState } from 'react';
import { User, Student, Teacher, UserRole } from '../types';
import { 
  ShieldCheck, UserPlus, GraduationCap, Users, 
  Trash2, Edit, Save, X, Key, Info, CheckCircle2,
  Calendar, Star, AlertTriangle, PhoneCall, FileText, PlusCircle, Clock
} from 'lucide-react';
import { NewsItem, Notification } from '../types';

interface Props {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  admins: User[];
  setAdmins: React.Dispatch<React.SetStateAction<User[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  addNotification: (userId: string, type: Notification['type'], message: string) => void;
  currentUser: User;
}

const DashboardAdmin: React.FC<Props> = ({ 
  students, setStudents, teachers, setTeachers, admins, setAdmins, news, setNews, addNotification, currentUser 
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'admins' | 'news'>('students');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");

  const [formData, setFormData] = useState({
    name: "", code: "", grade: "الأول", section: "أ", subject: "", role: UserRole.STUDENT, birthDate: ""
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);

    if (activeTab === 'students') {
      const newStudent: Student = {
        id,
        name: formData.name.trim(),
        code: formData.code.trim(),
        role: UserRole.STUDENT,
        birthDate: formData.birthDate || "2010-01-01",
        grade: formData.grade,
        section: formData.section,
        warningsCount: 0,
        warnings: [],
        attendance: { absent: 0, excused: 0, present: 0 },
        grades: { term1: null, midterm: null, term2: null },
        rating: 3,
        notes: [],
        parentCallRequested: false
      };
      setStudents(prev => [...prev, newStudent]);
    } else if (activeTab === 'teachers') {
      const newTeacher: Teacher = {
        id,
        name: formData.name.trim(),
        code: formData.code.trim(),
        role: UserRole.TEACHER,
        subject: formData.subject || "عام",
        assignedClasses: [`${formData.grade} - ${formData.section}`]
      };
      setTeachers(prev => [...prev, newTeacher]);
    } else {
      const newAdmin: User = {
        id,
        name: formData.name.trim(),
        code: formData.code.trim(),
        role: UserRole.ADMIN
      };
      setAdmins(prev => [...prev, newAdmin]);
    }
    setFormData({ name: "", code: "", grade: "الأول", section: "أ", subject: "", role: UserRole.STUDENT, birthDate: "" });
    alert('تمت الإضافة بنجاح إلى القائمة');
  };

  const addWarning = (studentId: string, reason: string) => {
    if (!reason) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        addNotification(s.id, 'warning', `تحذير إداري: ${reason}`);
        return { 
          ...s, 
          warningsCount: s.warningsCount + 1, 
          warnings: [...s.warnings, reason] 
        };
      }
      return s;
    }));
    alert('تم إضافة التحذير');
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

  const handleRating = (studentId: string, rating: number) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, rating } : s));
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
      teacherName: currentUser.name,
      title: newsTitle,
      content: newsContent,
      date: new Date().toISOString()
    };
    setNews(prev => [newItem, ...prev]);
    addNotification('all', 'news', `خبر إداري جديد: ${newsTitle}`);
    setNewsTitle("");
    setNewsContent("");
    alert('تم نشر الخبر بنجاح');
  };

  const deleteUser = (user: User) => {
    if (user.name === 'عبد الصمد القرشي' && user.code === 'f008') {
      alert('لا يمكن حذف حساب المالك الرئيسي للنظام!');
      return;
    }

    if (confirm(`هل أنت متأكد من حذف (${user.name}) من النظام؟`)) {
      if (user.role === UserRole.STUDENT) setStudents(prev => prev.filter(u => u.id !== user.id));
      else if (user.role === UserRole.TEACHER) setTeachers(prev => prev.filter(u => u.id !== user.id));
      else setAdmins(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const startEdit = (user: User) => {
    setIsEditing(user.id);
    setEditName(user.name);
  };

  const saveEdit = (id: string, role: UserRole) => {
    if (role === UserRole.STUDENT) setStudents(prev => prev.map(u => u.id === id ? { ...u, name: editName.trim() } : u));
    else if (role === UserRole.TEACHER) setTeachers(prev => prev.map(u => u.id === id ? { ...u, name: editName.trim() } : u));
    else setAdmins(prev => prev.map(u => u.id === id ? { ...u, name: editName.trim() } : u));
    setIsEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-teal-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-teal-600 p-4 rounded-2xl text-white shadow-lg shadow-teal-100">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-800">بوابة الإدارة</h2>
            <p className="text-teal-600 font-medium">تحكم كامل في الطلاب، الكادر التدريسي، والصلاحيات</p>
          </div>
        </div>
        <div className="flex gap-3">
           <div className="bg-teal-50 border border-teal-100 px-6 py-3 rounded-2xl text-center">
             <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mb-1">المستخدم الحالي</p>
             <p className="text-teal-900 font-bold flex items-center gap-2">
               <CheckCircle2 size={16} className="text-teal-500" /> {currentUser.name}
             </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'students' ? 'bg-teal-600 text-white shadow-xl scale-105' : 'bg-white text-gray-500 hover:bg-teal-50 border border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <Users size={22} /> <span>إدارة الطلاب</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'students' ? 'bg-white/20' : 'bg-gray-100'}`}>{students.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('teachers')}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'teachers' ? 'bg-teal-600 text-white shadow-xl scale-105' : 'bg-white text-gray-500 hover:bg-teal-50 border border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap size={22} /> <span>الكادر التدريسي</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'teachers' ? 'bg-white/20' : 'bg-gray-100'}`}>{teachers.length}</span>
          </button>

          <button 
            onClick={() => setActiveTab('admins')}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'admins' ? 'bg-teal-600 text-white shadow-xl scale-105' : 'bg-white text-gray-500 hover:bg-teal-50 border border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} /> <span>المشرفون</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'admins' ? 'bg-white/20' : 'bg-gray-100'}`}>{admins.length}</span>
          </button>

          <button 
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'news' ? 'bg-teal-600 text-white shadow-xl scale-105' : 'bg-white text-gray-500 hover:bg-teal-50 border border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <PlusCircle size={22} /> <span>نشر الأخبار</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'news' ? 'bg-white/20' : 'bg-gray-100'}`}>{news.length}</span>
          </button>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'news' ? (
             <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
               <h3 className="text-xl font-black flex items-center gap-2 mb-6 text-gray-800">
                 <PlusCircle className="text-teal-600" size={24} /> نشر تعميم إداري جديد
               </h3>
               <form onSubmit={postNews} className="space-y-4">
                 <div>
                   <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">عنوان التعميم</label>
                   <input 
                     type="text" 
                     value={newsTitle}
                     onChange={(e) => setNewsTitle(e.target.value)}
                     className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-black font-bold"
                     placeholder="مثال: عطلة رسمية يوم غد"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">التفاصيل</label>
                   <textarea 
                     value={newsContent}
                     onChange={(e) => setNewsContent(e.target.value)}
                     rows={6}
                     className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-black font-bold"
                     placeholder="اكتب تفاصيل التبليغ الإداري هنا..."
                     required
                   />
                 </div>
                 <button 
                   type="submit"
                   className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-50 transform active:scale-95 transition-all text-lg"
                 >
                   نشر التبليغ فوراً
                 </button>
               </form>
             </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 relative overflow-hidden">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-800 relative z-10">
              <div className="bg-teal-100 p-2 rounded-lg text-teal-600"><UserPlus size={24} /></div>
              إضافة جديد إلى (قائمة {activeTab === 'students' ? 'الطلاب' : activeTab === 'teachers' ? 'المدرسين' : 'المشرفين'})
            </h3>

            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">الاسم الكامل</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm text-black font-bold" 
                  placeholder="أدخل الاسم الرباعي"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">رمز الدخول</label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm font-mono text-black font-black" 
                  placeholder="كلمة السر أو الكود"
                  required 
                />
              </div>

              {activeTab === 'students' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">تاريخ الميلاد</label>
                    <input 
                      type="date" 
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm text-black" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">الصف</label>
                      <select 
                        value={formData.grade}
                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm text-black font-bold"
                      >
                        <option>الأول</option><option>الثاني</option><option>الثالث</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">الشعبة</label>
                      <select 
                        value={formData.section}
                        onChange={(e) => setFormData({...formData, section: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm text-black font-bold"
                      >
                        <option>أ</option><option>ب</option><option>ج</option><option>د</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'teachers' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">المادة الدراسية</label>
                    <input 
                      type="text" 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm text-black font-bold" 
                      placeholder="مثال: اللغة العربية"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-teal-600 text-white font-black py-5 rounded-2xl hover:bg-teal-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-100">
                  <UserPlus size={24} /> حفظ وإضافة للقائمة
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-xl font-black text-gray-800">السجلات المسجلة حالياً</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                  <tr>
                    <th className="p-6">الاسم</th>
                    <th className="p-6">الرمز</th>
                    <th className="p-6">التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(activeTab === 'students' ? students : activeTab === 'teachers' ? teachers : admins).map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-6">
                        {isEditing === user.id ? (
                          <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="p-2 border border-teal-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 w-full font-black text-black"
                          />
                        ) : (
                          <span className="font-black text-black block">{user.name}</span>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-black bg-gray-100 px-3 py-1.5 rounded-lg w-fit font-mono font-black text-sm border border-gray-200">
                          <Key size={14} className="text-teal-600" /> {user.code}
                        </div>
                      </td>
                      <td className="p-6 flex justify-center gap-2">
                        {isEditing === user.id ? (
                          <button onClick={() => saveEdit(user.id, user.role)} className="p-2.5 text-white bg-green-500 rounded-xl"><Save size={18}/></button>
                        ) : (
                          <>
                            {user.role === UserRole.STUDENT && (
                                <button 
                                  onClick={() => setSelectedStudent(user as Student)} 
                                  className="p-2.5 text-teal-600 hover:bg-teal-100 rounded-xl"
                                  title="إدارة التفاصيل"
                                >
                                  <Info size={18}/>
                                </button>
                            )}
                            <button onClick={() => startEdit(user)} className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl"><Edit size={18}/></button>
                            <button 
                              onClick={() => deleteUser(user)} 
                              className={`p-2.5 rounded-xl transition-colors ${(user.name === 'عبد الصمد القرشي' && user.code === 'f008') ? 'text-gray-200 cursor-not-allowed' : 'text-red-600 hover:bg-red-100'}`}
                              disabled={user.name === 'عبد الصمد القرشي' && user.code === 'f008'}
                            >
                              <Trash2 size={18}/>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="bg-teal-700 p-8 text-white flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black">{selectedStudent.name}</h3>
                <p className="text-teal-100 font-bold mt-1">إدارة شاملة للطالب</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-teal-100 hover:text-white bg-white/10 p-2 rounded-full transition-colors">✕</button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* التقييم */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                  <Star size={18} className="text-yellow-500" /> تقييم الطالب
                </label>
                <div className="flex gap-2 bg-gray-50 p-4 rounded-2xl justify-center">
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      size={32} 
                      onClick={() => handleRating(selectedStudent.id, star)}
                      className={`cursor-pointer transition-all ${star <= (students.find(s => s.id === selectedStudent.id)?.rating || 0) ? "fill-yellow-400 text-yellow-400 scale-110" : "text-gray-200 hover:text-yellow-200"}`} 
                    />
                  ))}
                </div>
              </div>

              {/* الحضور والغياب */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                  <Clock size={18} className="text-blue-500" /> سجل الحضور والغياب
                </label>
                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <span className="text-[10px] font-bold text-green-600 block text-center">حاضر</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.attendance.present || 0}
                       onChange={(e) => updateAttendance(selectedStudent.id, 'present', parseInt(e.target.value) || 0)}
                       className="w-full p-3 bg-green-50 border border-green-100 rounded-xl text-center font-bold"
                     />
                   </div>
                   <div className="space-y-2">
                     <span className="text-[10px] font-bold text-red-600 block text-center">غائب</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.attendance.absent || 0}
                       onChange={(e) => updateAttendance(selectedStudent.id, 'absent', parseInt(e.target.value) || 0)}
                       className="w-full p-3 bg-red-50 border border-red-100 rounded-xl text-center font-bold"
                     />
                   </div>
                   <div className="space-y-2">
                     <span className="text-[10px] font-bold text-blue-600 block text-center">مجاز</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.attendance.excused || 0}
                       onChange={(e) => updateAttendance(selectedStudent.id, 'excused', parseInt(e.target.value) || 0)}
                       className="w-full p-3 bg-blue-50 border border-blue-100 rounded-xl text-center font-bold"
                     />
                   </div>
                </div>
              </div>

              {/* الدرجات */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                  <FileText size={18} className="text-purple-500" /> الدرجات الدراسية
                </label>
                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <span className="text-[10px] font-bold text-gray-500 block text-center">نصف السنة</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.grades.midterm || ""}
                       onChange={(e) => updateGrade(selectedStudent.id, 'midterm', e.target.value === "" ? null : parseInt(e.target.value))}
                       placeholder="--"
                       className="w-full p-3 bg-gray-50 border rounded-xl text-center font-bold"
                     />
                   </div>
                   <div className="space-y-2">
                     <span className="text-[10px] font-bold text-gray-500 block text-center">الفصل الأول</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.grades.term1 || ""}
                       onChange={(e) => updateGrade(selectedStudent.id, 'term1', e.target.value === "" ? null : parseInt(e.target.value))}
                       placeholder="--"
                       className="w-full p-3 bg-gray-50 border rounded-xl text-center font-bold"
                     />
                   </div>
                   <div className="space-y-2">
                     <span className="text-[10px] font-bold text-gray-500 block text-center">الفصل الثاني</span>
                     <input 
                       type="number" 
                       value={students.find(s => s.id === selectedStudent.id)?.grades.term2 || ""}
                       onChange={(e) => updateGrade(selectedStudent.id, 'term2', e.target.value === "" ? null : parseInt(e.target.value))}
                       placeholder="--"
                       className="w-full p-3 bg-gray-50 border rounded-xl text-center font-bold"
                     />
                   </div>
                </div>
              </div>

              {/* التحذيرات والاستدعاءات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                    <AlertTriangle size={18} className="text-red-500" /> تحذير رسمي
                  </label>
                  <div className="flex gap-2">
                    <input 
                      id="admin-warning-input"
                      type="text" 
                      placeholder="سبب التحذير..." 
                      className="flex-1 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-xs font-bold"
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('admin-warning-input') as HTMLInputElement;
                        addWarning(selectedStudent.id, input.value);
                        input.value = "";
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-red-600 transition-all"
                    >
                      إرسال
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                    <PhoneCall size={18} className="text-blue-500" /> استدعاء ولي أمر
                  </label>
                  <div className="flex gap-2">
                    <input 
                      id="admin-call-input"
                      type="text" 
                      placeholder="سبب الاستدعاء..." 
                      className="flex-1 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold"
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('admin-call-input') as HTMLInputElement;
                        requestParentCall(selectedStudent.id, input.value);
                        input.value = "";
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-600 transition-all"
                    >
                      طلب
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
