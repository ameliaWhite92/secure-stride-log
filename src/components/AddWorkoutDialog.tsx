import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Calendar, Timer, Zap, TrendingUp, Heart } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSecureStrideLog } from "@/hooks/useContract";

const workoutSchema = z.object({
  type: z.string().min(1, "Workout type is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  calories: z.number().min(1, "Calories must be at least 1"),
  steps: z.number().min(0, "Steps must be non-negative"),
  heartRate: z.number().min(40, "Heart rate must be at least 40 BPM").max(220, "Heart rate must be at most 220 BPM"),
  intensity: z.enum(["Low", "Medium", "High"]),
  date: z.string().min(1, "Date is required"),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

interface AddWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddWorkoutDialog = ({ open, onOpenChange }: AddWorkoutDialogProps) => {
  const { toast } = useToast();
  const { logWorkout, isPending, isConnected } = useSecureStrideLog();

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      type: "",
      duration: 30,
      calories: 200,
      steps: 0,
      heartRate: 120,
      intensity: "Medium",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: WorkoutFormData) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to log workouts",
        variant: "destructive",
      });
      return;
    }

    try {
      await logWorkout(
        data.steps,
        data.calories,
        data.duration,
        data.heartRate,
        data.type
      );

      toast({
        title: "Workout logged successfully",
        description: "Your workout has been securely recorded on-chain",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error logging workout:', error);
      toast({
        title: "Error logging workout",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const workoutTypes = [
    "Running",
    "Walking",
    "Cycling",
    "Swimming",
    "Weight Training",
    "Yoga",
    "Pilates",
    "HIIT",
    "Dancing",
    "Hiking",
    "Other"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <Plus className="w-6 h-6 text-fitness-primary" />
            <span>Log New Workout</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Workout Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select workout type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workoutTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="intensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Intensity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground flex items-center space-x-1">
                      <Timer className="w-4 h-4" />
                      <span>Duration (minutes)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        className="bg-background border-border"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>Calories Burned</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="200"
                        className="bg-background border-border"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="steps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Steps</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-background border-border"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heartRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>Heart Rate (BPM)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="120"
                        className="bg-background border-border"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Date</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="bg-background border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-privacy hover:opacity-90 text-white shadow-button"
              >
                {isPending ? "Logging..." : "Log Workout"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};