'use client';

import { RunningRecord } from '@/types';
import { Calendar, MapPin, Edit2, Trash2, Plus } from 'lucide-react';
import { formatDate, formatDistance } from '@/lib/utils';

interface RecordListProps {
  records: RunningRecord[];
  onEdit: (record: RunningRecord) => void;
  onDelete: (recordId: number) => void;
  onAdd: () => void;
  currentUserId: number;
}

export default function RecordList({ 
  records, 
  onEdit, 
  onDelete, 
  onAdd,
  currentUserId 
}: RecordListProps) {
  const handleDelete = (record: RunningRecord) => {
    if (window.confirm(`确定要删除 ${formatDate(record.date)} 的跑步记录吗？`)) {
      onDelete(record.id);
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">还没有跑步记录</h3>
        <p className="text-gray-500 mb-6">开始记录你的跑步之旅吧！</p>
        <button
          onClick={onAdd}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>添加第一条记录</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 添加按钮 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          我的跑步记录 ({records.length})
        </h2>
        <button
          onClick={onAdd}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>添加记录</span>
        </button>
      </div>

      {/* 记录列表 */}
      <div className="space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(record.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-semibold text-green-600">
                        {formatDistance(record.distance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => onEdit(record)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="编辑记录"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(record)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="删除记录"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 统计信息 */}
      {records.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {records.length}
              </p>
              <p className="text-sm text-gray-600">总记录数</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {formatDistance(records.reduce((total, record) => total + record.distance, 0))}
              </p>
              <p className="text-sm text-gray-600">总距离</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
