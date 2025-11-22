import React from 'react';
import ComingSoon from '../components/ComingSoon';
import PageHeader from '../components/PageHeader';

const GearPlanner: React.FC = () => {
  return (
    <div>
      <PageHeader title="Gear Planner" description="Assemble and compare your gear sets." />
      <ComingSoon
        title="Gear Planner Coming Soon"
        description="The ultimate gear planning tool is currently under development. Check back later!"
      />
    </div>
  );
};

export default GearPlanner;
