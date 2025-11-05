export interface Task {
    id: string;
    title: string;
    description: string;
    assignedTo: string; // User ID
    status: 'Pending' | 'In Progress' | 'Done';
    createdAt: Date;
    updatedAt: Date;
}