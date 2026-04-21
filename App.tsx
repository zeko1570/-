
import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Student, 
  Teacher, 
  NewsItem, 
  Notification 
} from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_TEACHERS, 
  INITIAL_NEWS, 
  INITIAL_ADMINS 
} from './constants';
import Login from './components/Login';
import DashboardStudent from './components/DashboardStudent';
import DashboardTeacher from './components/DashboardTeacher';
import DashboardAdmin from './components/DashboardAdmin';
import { Bell, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [admins, setAdmins] = useState<User[]>(INITIAL_ADMINS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const savedStudents = localStorage.getItem('om-abiha-students');
    const savedTeachers = localStorage.getItem('om-abiha-teachers');
    const savedNews = localStorage.getItem('om-abiha-news');
    const savedAdmins = localStorage.getItem('om-abiha-admins');
    const savedUser = localStorage.getItem('om-abiha-current-user');

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    if (savedNews) setNews(JSON.parse(savedNews));
    if (savedAdmins) {
      const parsed = JSON.parse(savedAdmins);
      if (parsed.length > 0) setAdmins(parsed);
    }
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('om-abiha-students', JSON.stringify(students));
    localStorage.setItem('om-abiha-teachers', JSON.stringify(teachers));
    localStorage.setItem('om-abiha-news', JSON.stringify(news));
    localStorage.setItem('om-abiha-admins', JSON.stringify(admins));
  }, [students, teachers, news, admins]);

  const addNotification = (userId: string, type: Notification['type'], message: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      message,
      date: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLogin = (name: string, code: string) => {
    const trimmedName = name.trim();
    const trimmedCode = code.trim();
    
    let foundUser: User | undefined;
    
    // أولاً: البحث في المشرفين
    foundUser = admins.find(a => a.name === trimmedName && a.code === trimmedCode);
    
    // ثانياً: البحث في المدرسين
    if (!foundUser) {
      foundUser = teachers.find(t => t.name === trimmedName && t.code === trimmedCode);
    }
    
    // ثالثاً: البحث في الطلاب
    if (!foundUser) {
      foundUser = students.find(s => s.name === trimmedName && s.code === trimmedCode);
    }

    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('om-abiha-current-user', JSON.stringify(foundUser));
    } else {
      alert('خطأ في تسجيل الدخول: يرجى التأكد من الاسم الربعاي والرمز الصحيح');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('om-abiha-current-user');
  };

  const renderDashboard = () => {
    if (!currentUser) return <Login onLogin={handleLogin} />;

    switch (currentUser.role) {
      case UserRole.STUDENT:
        const studentData = students.find(s => s.id === currentUser.id);
        return studentData ? <DashboardStudent student={studentData} news={news} /> : null;
      case UserRole.TEACHER:
        const teacherData = teachers.find(t => t.id === currentUser.id);
        return teacherData ? (
          <DashboardTeacher 
            teacher={teacherData} 
            students={students} 
            setStudents={setStudents}
            news={news}
            setNews={setNews}
            addNotification={addNotification}
          />
        ) : null;
      case UserRole.ADMIN:
        return (
          <DashboardAdmin 
            students={students} 
            setStudents={setStudents}
            teachers={teachers} 
            setTeachers={setTeachers}
            admins={admins}
            setAdmins={setAdmins}
            news={news}
            setNews={setNews}
            addNotification={addNotification}
            currentUser={currentUser}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Cairo'] text-right">
      {currentUser && (
        <header className="bg-teal-700 text-white p-4 shadow-xl flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-full shadow-lg">
               <img src="https://picsum.photos/seed/school-main/80/80" alt="logo" className="w-8 h-8 rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-none">بوابة أم أبيها التعليمية</h1>
              <span className="text-[10px] text-teal-200 block mt-1">المتوسطة المختلطة</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-teal-600 rounded-xl transition-all"
            >
              <Bell size={22} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-teal-700 animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>
            <div className="h-6 w-[1px] bg-teal-600 opacity-30"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-teal-800 hover:bg-red-700 px-4 py-2 rounded-xl transition-all text-xs font-bold shadow-md"
            >
              <LogOut size={16} />
              <span className="hidden xs:inline">خروج</span>
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 container mx-auto p-4 max-w-6xl animate-fade-in">
        {renderDashboard()}
      </main>

      {showNotifications && (
        <div className="fixed inset-0 z-[100]" onClick={() => setShowNotifications(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div 
            className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-xl font-black text-teal-800 flex items-center gap-2">
                <Bell size={20} className="text-teal-600" /> الإشعارات
              </h2>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-red-500">✕</button>
            </div>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Bell size={48} className="opacity-20 mb-4" />
                <p className="font-bold">لا توجد تنبيهات جديدة</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map(n => (
                  <div key={n.id} className="p-4 bg-teal-50 border-r-4 border-teal-600 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-gray-800 leading-relaxed mb-1">{n.message}</p>
                    <span className="text-[10px] text-gray-400 block">{new Date(n.date).toLocaleString('ar-IQ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="bg-white border-t p-6 text-center">
        <p className="text-gray-400 text-[11px] font-bold">بوابة أم أبيها التعليمية &copy; {new Date().getFullYear()} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default App;
