{/* Report Crowd Level Section 
    This is the purpose of Activity Context.tsx  
  */}
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Activity = {
  id: string;
  locationId: string;
  crowdLevel: string;
  timestamp: string;
};

type ActivityContextType = {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);


export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      id: String(Date.now()),
      ...activity,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivity must be used within ActivityProvider');
  return context;
};
