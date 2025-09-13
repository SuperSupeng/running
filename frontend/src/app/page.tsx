'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, RunningRecord, GoalSetting } from '@/types';
import { mockUsers, getRecordsByUserId, getTotalDistanceByUserId, addRecord, getGoalSetting, setUserGoal, hasUserSetGoal } from '@/lib/data';
import { storage, STORAGE_KEYS, formatDate, formatDistance } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import RecordForm from '@/components/RecordForm';
import GoalSettingModal from '@/components/GoalSettingModal';
import GoalProgress from '@/components/GoalProgress';
import { Plus, MapPin, Calendar, TrendingUp, Activity } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [recentRecords, setRecentRecords] = useState<RunningRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalSetting, setGoalSetting] = useState<GoalSetting | null>(null);

  useEffect(() => {
    // 检查登录状态
    const user = storage.get<User>(STORAGE_KEYS.CURRENT_USER);
    if (!user) {
      router.push('/login');
      return;
    }
    
    setCurrentUser(user);
    loadUserData(user.id);
    
    // 检查是否需要设定目标
    if (!hasUserSetGoal(user.id)) {
      setShowGoalModal(true);
    }
  }, [router]);

  const loadUserData = (userId: number) => {
    const records = getRecordsByUserId(userId);
    setRecentRecords(records.slice(0, 5)); // 只显示最近5条
    
    // 加载目标设定
    const goal = getGoalSetting(userId);
    setGoalSetting(goal);
  };

  const handleUserChange = (user: User | null) => {
    if (user) {
      setCurrentUser(user);
      storage.set(STORAGE_KEYS.CURRENT_USER, user);
      loadUserData(user.id);
    } else {
      // 退出登录
      setCurrentUser(null);
      storage.remove(STORAGE_KEYS.CURRENT_USER);
      router.push('/login');
    }
  };

  const handleAddRecord = (recordData: Omit<RunningRecord, 'id'>) => {
    if (!currentUser) return;
    
    const newRecord = addRecord({
      ...recordData,
      userId: currentUser.id,
    });
    
    // 更新本地状态
    loadUserData(currentUser.id);
    setShowAddForm(false);
  };

  const handleGoalSubmit = (monthlyGoal: number) => {
    if (!currentUser) return;
    
    setUserGoal(currentUser.id, monthlyGoal);
    
    // 更新用户数据
    const updatedUser = { ...currentUser, monthlyGoal, goalSetDate: new Date().toISOString().split('T')[0] };
    setCurrentUser(updatedUser);
    storage.set(STORAGE_KEYS.CURRENT_USER, updatedUser);
    
    // 重新加载数据
    loadUserData(currentUser.id);
    setShowGoalModal(false);
  };

  const handleEditGoal = () => {
    setShowGoalModal(true);
  };

  const totalDistance = currentUser ? getTotalDistanceByUserId(currentUser.id) : 0;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentUser={currentUser} onUserChange={handleUserChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero 区域 */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  开始跑步，<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-orange-500">
                    记录每一步
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  一个简单易用的跑步记录应用，帮助你追踪每日跑步距离，通过排行榜激励持续运动，让健康生活成为习惯。
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
                >
                  <Plus className="w-5 h-5" />
                  <span>开始记录</span>
                </button>
                <Link href="/ranking" className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-flex items-center justify-center space-x-2 text-lg px-8 py-4">
                  <Activity className="w-5 h-5" />
                  <span>查看排行榜</span>
                </Link>
              </div>
            </div>

            {/* 右侧插画区域 */}
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-green-100 to-orange-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
                {/* 简单的跑步者插画 */}
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-orange-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <Activity className="w-16 h-16 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-2 bg-green-300 rounded-full mx-auto"></div>
                    <div className="w-20 h-2 bg-orange-300 rounded-full mx-auto"></div>
                    <div className="w-16 h-2 bg-green-300 rounded-full mx-auto"></div>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">跑步数据</p>
                </div>
                
                {/* 装饰性元素 */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-500" />
                </div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 目标进度卡片 */}
        <div className="mb-16">
          <GoalProgress 
            goalSetting={goalSetting} 
            onEditGoal={handleEditGoal}
          />
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{formatDistance(totalDistance)}</h3>
            <p className="text-gray-600 font-medium">总跑步距离</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{recentRecords.length}</h3>
            <p className="text-gray-600 font-medium">跑步记录数</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {recentRecords.length > 0 
                ? formatDistance(totalDistance / recentRecords.length)
                : '0.0 公里'
              }
            </h3>
            <p className="text-gray-600 font-medium">平均距离</p>
          </div>
        </div>

        {/* 最近记录区域 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">最近跑步记录</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>添加记录</span>
            </button>
          </div>
          
          {recentRecords.length > 0 ? (
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(record.date)}</p>
                      <p className="text-sm text-gray-500">跑步记录</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{formatDistance(record.distance)}</p>
                    <p className="text-sm text-gray-500">距离</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有跑步记录</h3>
              <p className="text-gray-500 mb-6">开始记录你的第一次跑步，开启健康生活！</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>添加第一条记录</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 添加记录表单 */}
      {showAddForm && (
        <RecordForm
          onSubmit={handleAddRecord}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* 目标设定弹窗 */}
      <GoalSettingModal
        isOpen={showGoalModal}
        onSubmit={handleGoalSubmit}
        onCancel={() => setShowGoalModal(false)}
      />
    </div>
  );
}