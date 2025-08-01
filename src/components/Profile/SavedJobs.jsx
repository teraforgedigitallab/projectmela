import React from 'react';
import { Card, Typography } from '../../ui';

const SavedJobs = () => (
    <Card>
        <Typography variant="h5" className="font-bold text-xl mb-2">Bookmarked Jobs</Typography>
        <Typography variant="p" className="text-gray-600">
            You have no bookmarked jobs yet.
        </Typography>
    </Card>
);

export default SavedJobs;