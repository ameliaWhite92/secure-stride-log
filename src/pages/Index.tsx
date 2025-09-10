import { useState } from "react";
import { WalletComponent } from "@/components/WalletComponent";
import { FitnessHeader } from "@/components/FitnessHeader";
import { WorkoutLog } from "@/components/WorkoutLog";
import { AddWorkoutDialog } from "@/components/AddWorkoutDialog";
import { WorkoutDetailsDialog } from "@/components/WorkoutDetailsDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSecureStrideLog } from "@/hooks/useContract";
import { Plus, Target, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const { isConnected } = useSecureStrideLog();

  const handleAddWorkout = () => {
    if (!isConnected) {
      return;
    }
    setShowAddWorkout(true);
  };

  const handleWorkoutSelect = (workoutId: number) => {
    setSelectedWorkout(workoutId);
  };

  return (
    <div className="min-h-screen bg-gradient-fitness">
      <FitnessHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Wallet Connection Section */}
        <div className="mb-8">
          <WalletComponent />
        </div>

        {/* Privacy Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-fitness-primary/10 text-fitness-primary">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">FHE Encryption</h3>
                <p className="text-sm text-muted-foreground">All data encrypted with FHE</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-fitness-primary/10 text-fitness-primary">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Smart Goals</h3>
                <p className="text-sm text-muted-foreground">Set and track fitness goals</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-fitness-primary/10 text-fitness-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Impact Reports</h3>
                <p className="text-sm text-muted-foreground">Generate encrypted reports</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Workout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Workout Log</h2>
              <Button
                onClick={handleAddWorkout}
                disabled={!isConnected}
                className="bg-gradient-privacy hover:opacity-90 text-white shadow-button flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Workout</span>
              </Button>
            </div>
            
            <WorkoutLog onWorkoutSelect={handleWorkoutSelect} />
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Workouts</span>
                  <span className="font-semibold text-fitness-primary">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Steps</span>
                  <span className="font-semibold text-fitness-primary">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Calories Burned</span>
                  <span className="font-semibold text-fitness-primary">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Goals Achieved</span>
                  <span className="font-semibold text-fitness-primary">0</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Privacy Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data Encryption</span>
                  <div className="flex items-center space-x-1 text-fitness-primary">
                    <div className="w-2 h-2 bg-fitness-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Blockchain Storage</span>
                  <div className="flex items-center space-x-1 text-fitness-primary">
                    <div className="w-2 h-2 bg-fitness-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Secure</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">FHE Processing</span>
                  <div className="flex items-center space-x-1 text-fitness-primary">
                    <div className="w-2 h-2 bg-fitness-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <AddWorkoutDialog
        open={showAddWorkout}
        onOpenChange={setShowAddWorkout}
      />
      
      <WorkoutDetailsDialog
        workoutId={selectedWorkout}
        open={selectedWorkout !== null}
        onOpenChange={(open) => !open && setSelectedWorkout(null)}
      />
    </div>
  );
};

export default Index;