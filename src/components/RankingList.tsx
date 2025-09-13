'use client';

import { RankingItem } from '@/types';
import { Trophy, Medal, Award, User } from 'lucide-react';
import { formatTotalDistance, getRankText } from '@/lib/utils';

interface RankingListProps {
  rankings: RankingItem[];
  currentUserId: number;
}

export default function RankingList({ rankings, currentUserId }: RankingListProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">{rank}</span>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  if (rankings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无排行榜数据</h3>
        <p className="text-gray-500">开始跑步记录，登上排行榜吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          跑步排行榜
        </h2>
        <div className="text-sm text-gray-500">
          共 {rankings.length} 位跑友
        </div>
      </div>

      {/* 前三名特殊展示 */}
      {rankings.slice(0, 3).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {rankings.slice(0, 3).map((item, index) => (
            <div
              key={item.user.id}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 text-center ${
                item.user.id === currentUserId 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : ''
              }`}
            >
              <div className="flex justify-center mb-3">
                {getRankIcon(item.rank)}
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getRankBadgeColor(item.rank)}`}>
                {getRankText(item.rank)}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.user.nickname}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.user.phone}</p>
              <p className="text-2xl font-bold text-green-600">
                {formatTotalDistance(item.totalDistance)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 完整排行榜 */}
      <div className="space-y-2">
        {rankings.map((item, index) => (
          <div
            key={item.user.id}
            className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
              item.user.id === currentUserId 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* 排名 */}
                <div className="flex-shrink-0">
                  {index < 3 ? (
                    getRankIcon(item.rank)
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">{item.rank}</span>
                    </div>
                  )}
                </div>

                {/* 用户信息 */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.user.nickname}</h4>
                    <p className="text-sm text-gray-500">{item.user.phone}</p>
                  </div>
                </div>
              </div>

              {/* 总距离 */}
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">
                  {formatTotalDistance(item.totalDistance)}
                </p>
                <p className="text-xs text-gray-500">总距离</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 当前用户位置提示 */}
      {rankings.some(item => item.user.id === currentUserId) && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <span className="font-medium">你在排行榜中！</span>
            {' '}继续加油，争取更好的名次！
          </p>
        </div>
      )}
    </div>
  );
}
