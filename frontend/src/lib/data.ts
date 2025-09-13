import { User, RunningRecord, RankingItem, GoalSetting } from '@/types';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 1,
    nickname: "跑步达人",
    phone: "138****1234",
    monthlyGoal: 50,
    goalSetDate: "2024-01-01"
  },
  {
    id: 2,
    nickname: "马拉松小王",
    phone: "139****5678",
    monthlyGoal: 100,
    goalSetDate: "2024-01-01"
  },
  {
    id: 3,
    nickname: "晨跑爱好者",
    phone: "137****9012",
    monthlyGoal: 30,
    goalSetDate: "2024-01-01"
  },
  {
    id: 4,
    nickname: "夜跑精灵",
    phone: "136****3456",
    monthlyGoal: 80,
    goalSetDate: "2024-01-01"
  },
  {
    id: 5,
    nickname: "健身狂人",
    phone: "135****7890",
    monthlyGoal: 60,
    goalSetDate: "2024-01-01"
  }
];

// 生成模拟跑步记录数据
const generateMockRecords = (): RunningRecord[] => {
  const records: RunningRecord[] = [];
  let recordId = 1;
  
  // 为每个用户生成 10-15 条记录
  mockUsers.forEach(user => {
    const recordCount = Math.floor(Math.random() * 6) + 10; // 10-15 条记录
    
    for (let i = 0; i < recordCount; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // 过去90天内的随机日期
      
      records.push({
        id: recordId++,
        userId: user.id,
        date: date.toISOString().split('T')[0], // YYYY-MM-DD 格式
        distance: Math.round((Math.random() * 15 + 1) * 10) / 10 // 1-16 公里，保留一位小数
      });
    }
  });
  
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockRecords: RunningRecord[] = generateMockRecords();

// 数据管理工具函数
export const getUsers = (): User[] => {
  return mockUsers;
};

export const getUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getRecordsByUserId = (userId: number): RunningRecord[] => {
  return mockRecords.filter(record => record.userId === userId);
};

export const getTotalDistanceByUserId = (userId: number): number => {
  const userRecords = getRecordsByUserId(userId);
  return userRecords.reduce((total, record) => total + record.distance, 0);
};

export const generateRankings = (): RankingItem[] => {
  const rankings: RankingItem[] = mockUsers.map(user => ({
    rank: 0, // 稍后计算
    user,
    totalDistance: getTotalDistanceByUserId(user.id)
  }));
  
  // 按总距离降序排序
  rankings.sort((a, b) => b.totalDistance - a.totalDistance);
  
  // 分配排名
  rankings.forEach((item, index) => {
    item.rank = index + 1;
  });
  
  return rankings;
};

// 添加新记录
export const addRecord = (record: Omit<RunningRecord, 'id'>): RunningRecord => {
  const newRecord: RunningRecord = {
    ...record,
    id: Math.max(...mockRecords.map(r => r.id)) + 1
  };
  mockRecords.unshift(newRecord); // 添加到开头
  return newRecord;
};

// 更新记录
export const updateRecord = (id: number, updates: Partial<RunningRecord>): RunningRecord | null => {
  const index = mockRecords.findIndex(record => record.id === id);
  if (index === -1) return null;
  
  mockRecords[index] = { ...mockRecords[index], ...updates };
  return mockRecords[index];
};

// 删除记录
export const deleteRecord = (id: number): boolean => {
  const index = mockRecords.findIndex(record => record.id === id);
  if (index === -1) return false;
  
  mockRecords.splice(index, 1);
  return true;
};

// 目标管理相关函数
export const getGoalSetting = (userId: number): GoalSetting | null => {
  const user = getUserById(userId);
  if (!user || !user.monthlyGoal) return null;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentMonthRecords = mockRecords.filter(record => 
    record.userId === userId && 
    record.date.startsWith(currentMonth)
  );
  
  const currentMonthProgress = currentMonthRecords.reduce((total, record) => total + record.distance, 0);
  const isGoalCompleted = currentMonthProgress >= user.monthlyGoal;

  return {
    userId,
    monthlyGoal: user.monthlyGoal,
    goalSetDate: user.goalSetDate || new Date().toISOString().split('T')[0],
    currentMonthProgress,
    isGoalCompleted
  };
};

export const setUserGoal = (userId: number, monthlyGoal: number): void => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].monthlyGoal = monthlyGoal;
    mockUsers[userIndex].goalSetDate = new Date().toISOString().split('T')[0];
  }
};

export const hasUserSetGoal = (userId: number): boolean => {
  const user = getUserById(userId);
  return user ? !!user.monthlyGoal : false;
};
