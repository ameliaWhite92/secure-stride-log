import { useState } from "react";
import { Calendar, Timer, Zap, Lock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddWorkoutDialog } from "./AddWorkoutDialog";
import { WorkoutDetailsDialog } from "./WorkoutDetailsDialog";

interface WorkoutEntry {
  id: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
  intensity: "Low" | "Medium" | "High";
  encrypted: boolean;
}

const workoutData: WorkoutEntry[] = [
  {
    id: "1",
    type: "Morning Run",
    duration: 45,
    calories: 420,
    date: "2024-01-15",
    intensity: "Medium",
    encrypted: true,
  },
  {
    id: "2",
    type: "Strength Training",
    duration: 60,
    calories: 380,
    date: "2024-01-14",
    intensity: "High",
    encrypted: true,
  },
  {
    id: "3",
    type: "Yoga Session",
    duration: 30,
    calories: 150,
    date: "2024-01-13",
    intensity: "Low",
    encrypted: true,
  },
  {
    id: "4",
    type: "Cycling",
    duration: 75,
    calories: 560,
    date: "2024-01-12",
    intensity: "High",
    encrypted: true,
  },
];

const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case "High": return "bg-destructive/10 text-destructive";
    case "Medium": return "bg-fitness-secondary/10 text-fitness-secondary";
    case "Low": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export const WorkoutLog = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(workoutData);

  const handleAddWorkout = (newWorkout: WorkoutEntry) => {
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  const totalMinutes = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Workout History</h2>
          <p className="text-muted-foreground">Your encrypted fitness journey</p>
        </div>
        <AddWorkoutDialog onAddWorkout={handleAddWorkout} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-fitness-primary/10 rounded-lg flex items-center justify-center">
              <Timer className="w-5 h-5 text-fitness-primary" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{totalMinutes}</div>
              <div className="text-xs text-muted-foreground">Total Minutes</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-fitness-secondary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-fitness-secondary" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{totalCalories.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Calories Burned</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-fitness-accent/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-fitness-accent" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">+15%</div>
              <div className="text-xs text-muted-foreground">Week Progress</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Workout Entries */}
      <div className="space-y-4">
        {workouts.map((workout) => (
          <Card key={workout.id} className="p-5 bg-gradient-card shadow-card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-foreground">{workout.type}</h3>
                  <Badge className={getIntensityColor(workout.intensity)}>
                    {workout.intensity}
                  </Badge>
                  {workout.encrypted && (
                    <div className="flex items-center space-x-1 text-privacy-primary">
                      <Lock className="w-3 h-3" />
                      <span className="text-xs">Encrypted</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Timer className="w-4 h-4" />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{workout.calories} cal</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(workout.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <WorkoutDetailsDialog workout={workout}>
                <Button variant="ghost" size="sm" className="text-privacy-primary hover:bg-privacy-primary/10">
                  View Details
                </Button>
              </WorkoutDetailsDialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};