
import React from 'react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card className="flex items-center space-x-4">
      {icon && <div className="text-primary-400 text-3xl">{icon}</div>}
      <div>
        <h4 className="text-sm font-medium text-gray-400">{title}</h4>
        <p className="text-2xl font-bold text-white">{value}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </Card>
  );
};

export default StatCard;
