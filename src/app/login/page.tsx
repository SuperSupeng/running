'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { mockUsers } from '@/lib/data';
import { storage, STORAGE_KEYS } from '@/lib/utils';
import { Activity, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // 检查是否已经登录
    const currentUser = storage.get<User>(STORAGE_KEYS.CURRENT_USER);
    if (currentUser) {
      router.push('/');
    }
  }, [router]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleLogin = () => {
    if (selectedUser) {
      storage.set(STORAGE_KEYS.CURRENT_USER, selectedUser);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左侧内容 */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                欢迎来到<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-orange-500">
                  跑步打卡
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                记录你的每一步，与跑友们一起挑战，让跑步成为生活的一部分。
              </p>
            </div>
            
            {/* 特色功能 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">轻松记录跑步数据</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-gray-700">实时排行榜激励</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700">数据统计与分析</span>
              </div>
            </div>
          </div>

          {/* 右侧登录区域 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">选择用户身份</h2>
              <p className="text-gray-600">选择一个用户开始体验</p>
            </div>

            <div className="space-y-4">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedUser?.id === user.id
                      ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      selectedUser?.id === user.id 
                        ? 'bg-gradient-to-br from-green-400 to-green-500' 
                        : 'bg-gray-100'
                    }`}>
                      <UserIcon className={`w-6 h-6 ${
                        selectedUser?.id === user.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className={`text-lg font-semibold ${
                        selectedUser?.id === user.id ? 'text-green-700' : 'text-gray-900'
                      }`}>
                        {user.nickname}
                      </p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </div>
                    {selectedUser?.id === user.id && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleLogin}
              disabled={!selectedUser}
              className={`w-full mt-8 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                selectedUser
                  ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedUser ? '开始使用' : '请选择用户'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                这是一个演示应用，使用模拟数据进行功能验证
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
