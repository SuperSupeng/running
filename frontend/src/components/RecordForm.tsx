'use client';

import { useState, useEffect } from 'react';
import { RunningRecord } from '@/types';
import { Calendar, MapPin, X } from 'lucide-react';
import { getTodayString, isValidDate, isValidDistance } from '@/lib/utils';

interface RecordFormProps {
  onSubmit: (record: Omit<RunningRecord, 'id'>) => void;
  onCancel: () => void;
  initialData?: Partial<RunningRecord>;
  isEditing?: boolean;
}

export default function RecordForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing = false 
}: RecordFormProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date || getTodayString(),
    distance: initialData?.distance?.toString() || '',
  });
  const [errors, setErrors] = useState<{ date?: string; distance?: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || getTodayString(),
        distance: initialData.distance?.toString() || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: { date?: string; distance?: string } = {};

    if (!formData.date) {
      newErrors.date = '请选择日期';
    } else if (!isValidDate(formData.date)) {
      newErrors.date = '日期格式不正确';
    }

    if (!formData.distance) {
      newErrors.distance = '请输入跑步距离';
    } else if (!isValidDistance(formData.distance)) {
      newErrors.distance = '距离必须在 0.1-100 公里之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const record: Omit<RunningRecord, 'id'> = {
      userId: initialData?.userId || 0, // 这个会在父组件中设置
      date: formData.date,
      distance: parseFloat(formData.distance),
    };

    onSubmit(record);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-8">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? '编辑跑步记录' : '添加跑步记录'}
            </h2>
            <button
              onClick={onCancel}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 日期输入 */}
            <div>
              <label htmlFor="date" className="block text-base font-semibold text-gray-800 mb-3">
                <Calendar className="w-5 h-5 inline mr-2 text-green-600" />
                跑步日期
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900 ${errors.date ? 'border-red-500 focus:ring-red-500' : ''}`}
                max={getTodayString()}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* 距离输入 */}
            <div>
              <label htmlFor="distance" className="block text-base font-semibold text-gray-800 mb-3">
                <MapPin className="w-5 h-5 inline mr-2 text-green-600" />
                跑步距离 (公里)
              </label>
              <input
                type="number"
                id="distance"
                value={formData.distance}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                placeholder="请输入跑步距离"
                step="0.1"
                min="0.1"
                max="100"
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900 placeholder-gray-500 ${errors.distance ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.distance && (
                <p className="mt-1 text-sm text-red-600">{errors.distance}</p>
              )}
              <p className="mt-2 text-sm text-gray-600 font-medium">
                请输入 0.1-100 公里之间的数值
              </p>
            </div>

            {/* 按钮组 */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isEditing ? '更新记录' : '添加记录'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
