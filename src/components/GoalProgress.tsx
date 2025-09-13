'use client';

import { GoalSetting } from '@/types';
import { Target, Trophy, TrendingUp } from 'lucide-react';
import { formatDistance } from '@/lib/utils';

interface GoalProgressProps {
  goalSetting: GoalSetting | null;
  onEditGoal?: () => void;
}

export default function GoalProgress({ goalSetting, onEditGoal }: GoalProgressProps) {
  if (!goalSetting) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">还没有设定目标</h3>
        <p className="text-gray-500 mb-4">设定一个跑步目标，开始你的挑战之旅！</p>
        {onEditGoal && (
          <button
            onClick={onEditGoal}
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            设定目标
          </button>
        )}
      </div>
    );
  }

  const progress = Math.min((goalSetting.currentMonthProgress / goalSetting.monthlyGoal) * 100, 100);
  const isCompleted = goalSetting.isGoalCompleted;
  const remaining = Math.max(goalSetting.monthlyGoal - goalSetting.currentMonthProgress, 0);

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 ${
      isCompleted 
        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300' 
        : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
    }`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
            isCompleted 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-400' 
              : 'bg-gradient-to-br from-green-400 to-green-500'
          }`}>
            {isCompleted ? (
              <Trophy className="w-6 h-6 text-white" />
            ) : (
              <Target className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isCompleted ? '🎉 目标已完成！' : '月度跑步目标'}
            </h3>
            <p className="text-sm text-gray-600">
              {isCompleted ? '恭喜你完成了这个月的目标！' : '继续加油，目标就在前方！'}
            </p>
          </div>
        </div>
        {onEditGoal && (
          <button
            onClick={onEditGoal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="修改目标"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">完成进度</span>
          <span className="text-sm font-bold text-gray-900">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                : 'bg-gradient-to-r from-green-400 to-green-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 数据统计 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatDistance(goalSetting.currentMonthProgress)}
          </div>
          <div className="text-sm text-gray-600">已完成</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatDistance(goalSetting.monthlyGoal)}
          </div>
          <div className="text-sm text-gray-600">目标距离</div>
        </div>
      </div>

      {/* 剩余距离 */}
      {!isCompleted && remaining > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">
              还需完成 {formatDistance(remaining)}
            </div>
            <div className="text-sm text-gray-500">
              平均每天 {formatDistance(remaining / 30)} 即可达成目标
            </div>
          </div>
        </div>
      )}

      {/* 完成庆祝 */}
      {isCompleted && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl text-center">
          <div className="text-lg font-bold text-orange-800 mb-1">
            🎉 恭喜完成目标！🎉
          </div>
          <div className="text-sm text-orange-700">
            你在这个月完成了 {formatDistance(goalSetting.currentMonthProgress)} 的跑步！
          </div>
        </div>
      )}
    </div>
  );
}
