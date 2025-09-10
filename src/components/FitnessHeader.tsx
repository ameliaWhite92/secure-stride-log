import { Shield, Activity, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FitnessHeaderProps {
  dailyProgress: number;
  weeklyGoal: number;
  currentStreak: number;
}

export const FitnessHeader = ({ dailyProgress = 65, weeklyGoal = 150, currentStreak = 7 }: FitnessHeaderProps) => {
  const progressPercentage = (dailyProgress / weeklyGoal) * 100;

  return (
    <header className="bg-gradient-card border-b border-border shadow-header">
      <div className="container mx-auto px-6 py-6">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-fitness rounded-xl shadow-button">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">FHE Workout Privacy</h1>
              <p className="text-sm text-muted-foreground flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span>Fully Encrypted Fitness Tracking</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-fitness-primary">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-fitness-primary/10 rounded-full">
              <Activity className="w-6 h-6 text-fitness-primary" />
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Daily Activity</h2>
            <span className="text-sm text-muted-foreground">{dailyProgress}/{weeklyGoal} min</span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-muted" 
            />
            <div 
              className="absolute top-0 left-0 h-3 bg-gradient-progress rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-fitness-primary">2.3k</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-fitness-secondary">8.5k</div>
              <div className="text-xs text-muted-foreground">Steps</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-fitness-accent">45</div>
              <div className="text-xs text-muted-foreground">Workouts</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};