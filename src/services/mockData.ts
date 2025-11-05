import { Task } from '../models/Task';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design User Dashboard',
    description: 'Create wireframes and mockups for the main user dashboard interface using Figma.',
    assignedTo: 'user1',
    status: 'In Progress',
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03')
  },
  {
    id: '2',
    title: 'Implement Authentication Flow',
    description: 'Set up JWT authentication with refresh tokens and secure route protection.',
    assignedTo: 'user2',
    status: 'Done',
    createdAt: new Date('2025-10-28'),
    updatedAt: new Date('2025-11-02')
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Connect frontend components with backend APIs and implement error handling.',
    assignedTo: 'user1',
    status: 'Pending',
    createdAt: new Date('2025-11-04'),
    updatedAt: new Date('2025-11-04')
  },
  {
    id: '4',
    title: 'Mobile Responsive Layout',
    description: 'Ensure all components work properly on mobile devices and implement responsive design patterns.',
    assignedTo: 'user3',
    status: 'Pending',
    createdAt: new Date('2025-11-03'),
    updatedAt: new Date('2025-11-03')
  },
  {
    id: '5',
    title: 'Performance Optimization',
    description: 'Analyze and optimize application performance, including lazy loading and code splitting.',
    assignedTo: 'user2',
    status: 'In Progress',
    createdAt: new Date('2025-10-30'),
    updatedAt: new Date('2025-11-01')
  }
];

export const mockUsers = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
  },
  {
    id: 'user3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson'
  }
];

// Helper function to get user details
export const getUserById = (userId: string) => {
  return mockUsers.find(user => user.id === userId);
};

// Helper function to get tasks by status
export const getTasksByStatus = (status: Task['status']) => {
  return mockTasks.filter(task => task.status === status);
};

// Helper function to get tasks by assignee
export const getTasksByAssignee = (userId: string) => {
  return mockTasks.filter(task => task.assignedTo === userId);
};