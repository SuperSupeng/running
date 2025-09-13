'use client';

import { useState } from 'react';
import { GoalFormData } from '@/types';
import { Target, X, Trophy } from 'lucide-react';

interface GoalSettingModalProps {
  onSubmit: (goal: number) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function GoalSettingModal({ onSubmit, onCancel, isOpen }: GoalSettingModalProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    monthlyGoal: '50',
  });
  const [errors, setErrors] = useState<{ monthlyGoal?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { monthlyGoal?: string } = {};
    const goal = parseFloat(formData.monthlyGoal);

    if (!formData.monthlyGoal) {
      newErrors.monthlyGoal = '请输入月度跑步目标';
    } else if (isNaN(goal) || goal < 10 || goal > 500) {
      newErrors.monthlyGoal = '目标必须在 10-500 公里之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const goal = parseFloat(formData.monthlyGoal);
    onSubmit(goal);
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, monthlyGoal: value }));
    
    // 清除错误
    if (errors.monthlyGoal) {
      setErrors(prev => ({ ...prev, monthlyGoal: undefined }));
    }
  };

  const quickGoals = [20, 50, 100, 150, 200];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-200">
        <div className="p-8">
          {/* 头部 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">设定你的跑步目标</h2>
            <p className="text-gray-600">为自己设定一个挑战性的月度目标，让跑步更有动力！</p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 快速选择 */}
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-3">
                快速选择目标
              </label>
              <div className="grid grid-cols-3 gap-3">
                {quickGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleInputChange(goal.toString())}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      formData.monthlyGoal === goal.toString()
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">{goal}</div>
                      <div className="text-xs text-gray-500">公里/月</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义输入 */}
            <div>
              <label htmlFor="monthlyGoal" className="block text-base font-semibold text-gray-800 mb-3">
                自定义目标
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="monthlyGoal"
                  value={formData.monthlyGoal}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="请输入目标公里数"
                  min="10"
                  max="500"
                  step="1"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900 placeholder-gray-500 ${
                    errors.monthlyGoal ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  公里/月
                </div>
              </div>
              {errors.monthlyGoal && (
                <p className="mt-2 text-sm text-red-600">{errors.monthlyGoal}</p>
              )}
              <p className="mt-2 text-sm text-gray-600 font-medium">
                建议目标范围：10-500 公里/月
              </p>
            </div>

            {/* 目标建议 */}
            <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-gray-800">目标建议</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• 初学者：20-50 公里/月</div>
                <div>• 进阶者：50-100 公里/月</div>
                <div>• 挑战者：100+ 公里/月</div>
              </div>
            </div>

            {/* 按钮组 */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                稍后设定
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                设定目标
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
