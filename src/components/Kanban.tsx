import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreHorizontal, User, Calendar, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  columnId?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, columnId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assignee: '',
    dueDate: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });

    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      tags: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Task</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Design, Frontend, Urgent"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing transition-transform hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
          {task.title}
        </h4>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <MoreHorizontal size={14} className="text-gray-400" />
        </button>
      </div>
      
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        {task.assignee && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <User size={12} />
            <span>{task.assignee}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-1">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 rounded"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Kanban: React.FC = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-gray-100 dark:bg-gray-700',
      tasks: [
        {
          id: '1',
          title: 'Design new landing page',
          description: 'Create a modern and responsive landing page for the new product launch',
          priority: 'high',
          assignee: 'John Doe',
          dueDate: '2024-01-25',
          tags: ['Design', 'UI/UX'],
        },
        {
          id: '2',
          title: 'User research analysis',
          description: 'Analyze user feedback and create insights report',
          priority: 'medium',
          assignee: 'Jane Smith',
          dueDate: '2024-01-28',
          tags: ['Research'],
        },
      ],
    },
    {
      id: 'progress',
      title: 'In Progress',
      color: 'bg-primary-100 dark:bg-primary-900',
      tasks: [
        {
          id: '3',
          title: 'API integration',
          description: 'Integrate third-party payment API with our system',
          priority: 'high',
          assignee: 'Mike Johnson',
          dueDate: '2024-01-30',
          tags: ['Backend', 'API'],
        },
        {
          id: '4',
          title: 'Mobile app testing',
          description: 'Comprehensive testing of the mobile application',
          priority: 'medium',
          assignee: 'Sarah Wilson',
          dueDate: '2024-02-02',
          tags: ['Mobile', 'Testing'],
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      color: 'bg-yellow-100 dark:bg-yellow-900',
      tasks: [
        {
          id: '5',
          title: 'Code review',
          description: 'Review pull requests for the authentication module',
          priority: 'medium',
          assignee: 'Alex Brown',
          dueDate: '2024-01-26',
          tags: ['Code Review'],
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-accent-100 dark:bg-accent-900',
      tasks: [
        {
          id: '6',
          title: 'Database optimization',
          description: 'Optimize database queries for better performance',
          priority: 'low',
          assignee: 'Chris Davis',
          dueDate: '2024-01-20',
          tags: ['Database'],
        },
      ],
    },
  ]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setShowTaskModal(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    };

    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === selectedColumnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns
      .flatMap(col => col.tasks)
      .find(task => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = active.id as string;
    const overColumnId = over.id as string;

    // Find the active task and its current column
    let activeTask: Task | undefined;
    let activeColumnIndex = -1;
    let activeTaskIndex = -1;

    columns.forEach((column, colIndex) => {
      const taskIndex = column.tasks.findIndex(task => task.id === activeTaskId);
      if (taskIndex !== -1) {
        activeTask = column.tasks[taskIndex];
        activeColumnIndex = colIndex;
        activeTaskIndex = taskIndex;
      }
    });

    if (!activeTask) return;

    // Find the target column
    const targetColumnIndex = columns.findIndex(col => col.id === overColumnId);
    if (targetColumnIndex === -1) return;

    // If dropping in the same column, just reorder
    if (activeColumnIndex === targetColumnIndex) {
      return; // For simplicity, we're not handling reordering within the same column
    }

    // Move task to new column
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      
      // Remove from source column
      newColumns[activeColumnIndex].tasks.splice(activeTaskIndex, 1);
      
      // Add to target column
      newColumns[targetColumnIndex].tasks.push(activeTask!);
      
      return newColumns;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize and track your project tasks</p>
        </div>
        <button 
          onClick={() => handleAddTask('todo')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-900 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <button 
                  onClick={() => handleAddTask(column.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                >
                  <Plus size={16} className="text-gray-400" />
                </button>
              </div>

              <SortableContext
                items={column.tasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className="space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700"
                  data-column-id={column.id}
                >
                  {column.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleTaskSubmit}
        columnId={selectedColumnId}
      />
    </div>
  );
};

export default Kanban;