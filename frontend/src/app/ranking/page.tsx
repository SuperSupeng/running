'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, RankingItem } from '@/types';
import { generateRankings } from '@/lib/data';
import { storage, STORAGE_KEYS } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import RankingList from '@/components/RankingList';

export default function RankingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [rankings, setRankings] = useState<RankingItem[]>([]);

  useEffect(() => {
    // 检查登录状态
    const user = storage.get<User>(STORAGE_KEYS.CURRENT_USER);
    if (!user) {
      router.push('/login');
      return;
    }
    
    setCurrentUser(user);
    loadRankings();
  }, [router]);

  const loadRankings = () => {
    const rankingData = generateRankings();
    setRankings(rankingData);
  };

  const handleUserChange = (user: User | null) => {
    if (user) {
      setCurrentUser(user);
      storage.set(STORAGE_KEYS.CURRENT_USER, user);
      loadRankings(); // 重新加载排行榜
    } else {
      // 退出登录
      setCurrentUser(null);
      storage.remove(STORAGE_KEYS.CURRENT_USER);
      router.push('/login');
    }
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
        <RankingList
          rankings={rankings}
          currentUserId={currentUser.id}
        />
      </main>
    </div>
  );
}
