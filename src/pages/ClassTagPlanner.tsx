import React from 'react';
import ComingSoon from '../../components/ComingSoon';
import PageHeader from '../../components/PageHeader';

const ClassTagPlanner: React.FC = () => {
    return (
        <div>
            <PageHeader title="Class & Tag Planner" description="Create and save your class builds." />
            <ComingSoon
                title="Class Planner Coming Soon"
                description="We are working hard to bring you the best class and tag planning experience. Stay tuned!"
            />
        </div>
    );
};

export default ClassTagPlanner;
