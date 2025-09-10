import { Calendar, Timer, Zap, Lock, Shield, TrendingUp } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface WorkoutEntry {
  id: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
  intensity: "Low" | "Medium" | "High";
  encrypted: boolean;
}

interface WorkoutDetailsDialogProps {
  workout: WorkoutEntry;
  children: React.ReactNode;
}

const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case "High": return "bg-destructive/10 text-destructive";
    case "Medium": return "bg-fitness-secondary/10 text-fitness-secondary";
    case "Low": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getIntensityDescription = (intensity: string) => {
  switch (intensity) {
    case "High": return "Maximum effort training with high heart rate";
    case "Medium": return "Moderate effort with steady heart rate";
    case "Low": return "Light activity with minimal exertion";
    default: return "Standard workout intensity";
  }
};

export const WorkoutDetailsDialog = ({ workout, children }: WorkoutDetailsDialogProps) => {
  const caloriesPerMinute = Math.round(workout.calories / workout.duration);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gradient-card">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-fitness-primary" />
            Workout Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">{workout.type}</h3>
              <div className="flex items-center gap-2">
                <Badge className={getIntensityColor(workout.intensity)}>
                  {workout.intensity} Intensity
                </Badge>
                {workout.encrypted && (
                  <div className="flex items-center gap-1 bg-privacy-primary/10 px-2 py-1 rounded-md">
                    <Lock className="w-3 h-3 text-privacy-primary" />
                    <span className="text-xs text-privacy-primary font-medium">Encrypted</span>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {getIntensityDescription(workout.intensity)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-card-subtle shadow-card">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-fitness-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Timer className="w-5 h-5 text-fitness-primary" />
                </div>
                <div className="text-lg font-bold text-foreground">{workout.duration}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-card-subtle shadow-card">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-fitness-secondary/10 rounded-lg flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-fitness-secondary" />
                </div>
                <div className="text-lg font-bold text-foreground">{workout.calories}</div>
                <div className="text-xs text-muted-foreground">Calories</div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-card-subtle shadow-card">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-fitness-accent/10 rounded-lg flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-fitness-accent" />
                </div>
                <div className="text-lg font-bold text-foreground">{caloriesPerMinute}</div>
                <div className="text-xs text-muted-foreground">Cal/Min</div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-card-subtle shadow-card">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-privacy-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 text-privacy-primary" />
                </div>
                <div className="text-lg font-bold text-foreground">
                  {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs text-muted-foreground">Date</div>
              </div>
            </Card>
          </div>

          {/* Privacy Info */}
          {workout.encrypted && (
            <Card className="p-4 bg-privacy-primary/5 border border-privacy-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-privacy-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-privacy-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Privacy Protected</h4>
                  <p className="text-sm text-muted-foreground">
                    This workout data is encrypted using Fully Homomorphic Encryption (FHE). 
                    Your personal fitness information remains completely private and secure, 
                    even during processing and analysis.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Performance Insights */}
          <Card className="p-4 bg-gradient-card-subtle shadow-card">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-fitness-primary" />
              Performance Insights
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Efficiency Rating:</span>
                <span className="text-foreground font-medium">
                  {caloriesPerMinute > 10 ? 'Excellent' : caloriesPerMinute > 7 ? 'Good' : 'Moderate'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Workout Type:</span>
                <span className="text-foreground font-medium">
                  {workout.type.toLowerCase().includes('run') ? 'Cardio' : 
                   workout.type.toLowerCase().includes('strength') ? 'Resistance' :
                   workout.type.toLowerCase().includes('yoga') ? 'Flexibility' : 'Mixed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Heart Rate Zone:</span>
                <span className="text-foreground font-medium">
                  {workout.intensity === 'High' ? 'Zone 4-5' : 
                   workout.intensity === 'Medium' ? 'Zone 2-3' : 'Zone 1-2'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};