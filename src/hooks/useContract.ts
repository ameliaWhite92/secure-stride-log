import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useToast } from './use-toast';

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "_verifier", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "sessionId", "type": "uint256"},
      {"indexed": true, "name": "user", "type": "address"},
      {"indexed": false, "name": "workoutType", "type": "string"}
    ],
    "name": "WorkoutLogged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "goalId", "type": "uint256"},
      {"indexed": true, "name": "user", "type": "address"},
      {"indexed": false, "name": "goalType", "type": "string"}
    ],
    "name": "GoalCreated",
    "type": "event"
  },
  {
    "inputs": [
      {"name": "steps", "type": "bytes"},
      {"name": "calories", "type": "bytes"},
      {"name": "duration", "type": "bytes"},
      {"name": "heartRate", "type": "bytes"},
      {"name": "workoutType", "type": "string"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "logWorkout",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "targetSteps", "type": "bytes"},
      {"name": "targetCalories", "type": "bytes"},
      {"name": "targetDuration", "type": "bytes"},
      {"name": "goalType", "type": "string"},
      {"name": "duration", "type": "uint256"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "createFitnessGoal",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "weight", "type": "bytes"},
      {"name": "height", "type": "bytes"},
      {"name": "age", "type": "bytes"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "updateHealthMetrics",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "sessionId", "type": "uint256"}
    ],
    "name": "getWorkoutSessionInfo",
    "outputs": [
      {"name": "workoutType", "type": "string"},
      {"name": "steps", "type": "uint8"},
      {"name": "calories", "type": "uint8"},
      {"name": "duration", "type": "uint8"},
      {"name": "heartRate", "type": "uint8"},
      {"name": "isCompleted", "type": "bool"},
      {"name": "user", "type": "address"},
      {"name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - This would be the deployed contract address
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D001C2f" as const;

export const useSecureStrideLog = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { toast } = useToast();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const logWorkout = async (
    steps: number,
    calories: number,
    duration: number,
    heartRate: number,
    workoutType: string
  ) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, you would encrypt these values using FHE
      // For now, we'll simulate the encrypted data
      const encryptedSteps = new Uint8Array(32); // Placeholder for encrypted data
      const encryptedCalories = new Uint8Array(32);
      const encryptedDuration = new Uint8Array(32);
      const encryptedHeartRate = new Uint8Array(32);
      const inputProof = new Uint8Array(64); // Placeholder for proof

      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'logWorkout',
        args: [
          encryptedSteps,
          encryptedCalories,
          encryptedDuration,
          encryptedHeartRate,
          workoutType,
          inputProof
        ],
      });

      toast({
        title: "Workout logged",
        description: "Your workout has been securely logged on-chain",
      });
    } catch (err) {
      console.error('Error logging workout:', err);
      toast({
        title: "Error",
        description: "Failed to log workout",
        variant: "destructive",
      });
    }
  };

  const createFitnessGoal = async (
    targetSteps: number,
    targetCalories: number,
    targetDuration: number,
    goalType: string,
    duration: number
  ) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, you would encrypt these values using FHE
      const encryptedTargetSteps = new Uint8Array(32);
      const encryptedTargetCalories = new Uint8Array(32);
      const encryptedTargetDuration = new Uint8Array(32);
      const inputProof = new Uint8Array(64);

      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createFitnessGoal',
        args: [
          encryptedTargetSteps,
          encryptedTargetCalories,
          encryptedTargetDuration,
          goalType,
          duration,
          inputProof
        ],
      });

      toast({
        title: "Goal created",
        description: "Your fitness goal has been created",
      });
    } catch (err) {
      console.error('Error creating goal:', err);
      toast({
        title: "Error",
        description: "Failed to create fitness goal",
        variant: "destructive",
      });
    }
  };

  const updateHealthMetrics = async (
    weight: number,
    height: number,
    age: number
  ) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, you would encrypt these values using FHE
      const encryptedWeight = new Uint8Array(32);
      const encryptedHeight = new Uint8Array(32);
      const encryptedAge = new Uint8Array(32);
      const inputProof = new Uint8Array(64);

      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'updateHealthMetrics',
        args: [
          encryptedWeight,
          encryptedHeight,
          encryptedAge,
          inputProof
        ],
      });

      toast({
        title: "Health metrics updated",
        description: "Your health metrics have been securely updated",
      });
    } catch (err) {
      console.error('Error updating health metrics:', err);
      toast({
        title: "Error",
        description: "Failed to update health metrics",
        variant: "destructive",
      });
    }
  };

  return {
    logWorkout,
    createFitnessGoal,
    updateHealthMetrics,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    isConnected,
    address,
  };
};

export const useWorkoutSession = (sessionId: number) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getWorkoutSessionInfo',
    args: [BigInt(sessionId)],
  });

  return {
    sessionData: data,
    isLoading,
    error,
  };
};
