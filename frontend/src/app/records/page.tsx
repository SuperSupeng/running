'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, RunningRecord, GoalSetting } from '@/types';
import { getRecordsByUserId, addRecord, updateRecord, deleteRecord, getGoalSetting, setUserGoal, hasUserSetGoal } from '@/lib/data';
import { storage, STORAGE_KEYS } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import RecordList from '@/components/RecordList';
import RecordForm from '@/components/RecordForm';
import GoalSettingModal from '@/components/GoalSettingModal';
import GoalProgress from '@/components/GoalProgress';

export default function RecordsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [records, setRecords] = useState<RunningRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RunningRecord | null>(null);
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
    loadUserRecords(user.id);
  }, [router]);

  const loadUserRecords = (userId: number) => {
    const userRecords = getRecordsByUserId(userId);
    setRecords(userRecords);
    
    // 加载目标设定
    const goal = getGoalSetting(userId);
    setGoalSetting(goal);
  };

  const handleUserChange = (user: User | null) => {
    if (user) {
      setCurrentUser(user);
      storage.set(STORAGE_KEYS.CURRENT_USER, user);
      loadUserRecords(user.id);
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
    loadUserRecords(currentUser.id);
    setShowAddForm(false);
  };

  const handleEditRecord = (record: RunningRecord) => {
    setEditingRecord(record);
  };

  const handleUpdateRecord = (recordData: Omit<RunningRecord, 'id'>) => {
    if (!editingRecord) return;
    
    const updatedRecord = updateRecord(editingRecord.id, recordData);
    if (updatedRecord) {
      // 更新本地状态
      loadUserRecords(currentUser!.id);
      setEditingRecord(null);
    }
  };

  const handleDeleteRecord = (recordId: number) => {
    const success = deleteRecord(recordId);
    if (success) {
      // 更新本地状态
      loadUserRecords(currentUser!.id);
    }
  };

  const handleGoalSubmit = (monthlyGoal: number) => {
    if (!currentUser) return;
    
    setUserGoal(currentUser.id, monthlyGoal);
    
    // 更新用户数据
    const updatedUser = { ...currentUser, monthlyGoal, goalSetDate: new Date().toISOString().split('T')[0] };
    setCurrentUser(updatedUser);
    storage.set(STORAGE_KEYS.CURRENT_USER, updatedUser);
    
    // 重新加载数据
    loadUserRecords(currentUser.id);
    setShowGoalModal(false);
  };

  const handleEditGoal = () => {
    setShowGoalModal(true);
  };

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
    <div className="min-h-screen bg-gray-50">
      <Navigation currentUser={currentUser} onUserChange={handleUserChange} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 目标进度卡片 */}
        <div className="mb-8">
          <GoalProgress 
            goalSetting={goalSetting} 
            onEditGoal={handleEditGoal}
          />
        </div>

        <RecordList
          records={records}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
          onAdd={() => setShowAddForm(true)}
          currentUserId={currentUser.id}
        />
      </main>

      {/* 添加记录表单 */}
      {showAddForm && (
        <RecordForm
          onSubmit={handleAddRecord}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* 编辑记录表单 */}
      {editingRecord && (
        <RecordForm
          onSubmit={handleUpdateRecord}
          onCancel={() => setEditingRecord(null)}
          initialData={editingRecord}
          isEditing={true}
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
