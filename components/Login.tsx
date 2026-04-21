
import React, { useState } from 'react';
import { UserRole } from '../types';
import { User, ShieldCheck, GraduationCap, Users } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string, code: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && code) {
      onLogin(name, code);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
      <div className="bg-teal-700 p-8 text-white text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30 shadow-inner">
          <GraduationCap size={40} />
        </div>
        <h2 className="text-2xl font-black">بوابة أم أبيها التعليمية</h2>
        <p className="text-teal-100 mt-2 text-sm font-bold">بوابة الإدارة والتعليم</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 mr-1">الاسم الكامل</label>
              <div className="relative">
                 <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-3 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-black font-black"
                  placeholder="أدخل الاسم الرباعي"
                  required
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 mr-1">الرمز الخاص</label>
              <div className="relative">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full pl-3 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-black font-black"
                  placeholder="أدخل رمز الدخول"
                  required
                />
                <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600" size={20} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-teal-100 transform active:scale-95 transition-all text-lg"
          >
            دخول للنظام
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
