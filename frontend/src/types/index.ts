// 用户类型定义
export interface User {
  id: number;
  nickname: string;
  phone: string;
  monthlyGoal?: number; // 月度跑步目标（公里）
  goalSetDate?: string; // 目标设定日期
}

// 跑步记录类型定义
export interface RunningRecord {
  id: number;
  userId: number;
  date: string;
  distance: number;
}

// 排行榜项目类型定义
export interface RankingItem {
  rank: number;
  user: User;
  totalDistance: number;
}

// 组件 Props 类型定义
export interface NavigationProps {
  currentUser: User | null;
  onUserChange: (user: User) => void;
}

export interface RecordFormProps {
  onSubmit: (record: Omit<RunningRecord, 'id'>) => void;
  onCancel: () => void;
  initialData?: Partial<RunningRecord>;
  isEditing?: boolean;
}

export interface RecordListProps {
  records: RunningRecord[];
  onEdit: (record: RunningRecord) => void;
  onDelete: (recordId: number) => void;
  currentUserId: number;
}

export interface RankingListProps {
  rankings: RankingItem[];
  currentUserId: number;
}

// 表单数据类型
export interface RecordFormData {
  date: string;
  distance: string;
}

// 目标设定数据类型定义
export interface GoalSetting {
  userId: number;
  monthlyGoal: number; // 月度目标（公里）
  goalSetDate: string; // 目标设定日期
  currentMonthProgress: number; // 当月已完成距离
  isGoalCompleted: boolean; // 目标是否已完成
}

// 目标设定表单数据类型
export interface GoalFormData {
  monthlyGoal: string;
}

// 本地存储键名
export const STORAGE_KEYS = {
  CURRENT_USER: 'running_app_current_user',
  RUNNING_RECORDS: 'running_app_records',
  GOAL_SETTINGS: 'running_app_goal_settings',
} as const;
