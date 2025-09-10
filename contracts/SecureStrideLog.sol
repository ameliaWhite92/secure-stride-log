// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecureStrideLog is SepoliaConfig {
    using FHE for *;
    
    struct WorkoutSession {
        euint32 sessionId;
        euint32 steps;
        euint32 calories;
        euint32 duration; // in minutes
        euint32 heartRate;
        ebool isCompleted;
        string workoutType;
        address user;
        uint256 timestamp;
    }
    
    struct FitnessGoal {
        euint32 goalId;
        euint32 targetSteps;
        euint32 targetCalories;
        euint32 targetDuration;
        ebool isAchieved;
        string goalType;
        address user;
        uint256 startDate;
        uint256 endDate;
    }
    
    struct HealthMetrics {
        euint32 weight;
        euint32 height;
        euint32 age;
        euint32 bmi;
        address user;
        uint256 lastUpdated;
    }
    
    struct ImpactReport {
        euint32 reportId;
        euint32 totalSteps;
        euint32 totalCalories;
        euint32 totalWorkouts;
        euint32 achievements;
        ebool isVerified;
        string reportHash;
        address user;
        uint256 timestamp;
    }
    
    mapping(uint256 => WorkoutSession) public workoutSessions;
    mapping(uint256 => FitnessGoal) public fitnessGoals;
    mapping(address => HealthMetrics) public healthMetrics;
    mapping(uint256 => ImpactReport) public impactReports;
    mapping(address => euint32) public userReputation;
    
    uint256 public sessionCounter;
    uint256 public goalCounter;
    uint256 public reportCounter;
    
    address public owner;
    address public verifier;
    
    event WorkoutLogged(uint256 indexed sessionId, address indexed user, string workoutType);
    event GoalCreated(uint256 indexed goalId, address indexed user, string goalType);
    event GoalAchieved(uint256 indexed goalId, address indexed user);
    event HealthMetricsUpdated(address indexed user);
    event ImpactReported(uint256 indexed reportId, address indexed user);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function logWorkout(
        externalEuint32 steps,
        externalEuint32 calories,
        externalEuint32 duration,
        externalEuint32 heartRate,
        string memory workoutType,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(workoutType).length > 0, "Workout type cannot be empty");
        
        uint256 sessionId = sessionCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalSteps = FHE.fromExternal(steps, inputProof);
        euint32 internalCalories = FHE.fromExternal(calories, inputProof);
        euint32 internalDuration = FHE.fromExternal(duration, inputProof);
        euint32 internalHeartRate = FHE.fromExternal(heartRate, inputProof);
        
        workoutSessions[sessionId] = WorkoutSession({
            sessionId: FHE.asEuint32(0), // Will be set properly later
            steps: internalSteps,
            calories: internalCalories,
            duration: internalDuration,
            heartRate: internalHeartRate,
            isCompleted: FHE.asEbool(true),
            workoutType: workoutType,
            user: msg.sender,
            timestamp: block.timestamp
        });
        
        emit WorkoutLogged(sessionId, msg.sender, workoutType);
        return sessionId;
    }
    
    function createFitnessGoal(
        externalEuint32 targetSteps,
        externalEuint32 targetCalories,
        externalEuint32 targetDuration,
        string memory goalType,
        uint256 duration,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(goalType).length > 0, "Goal type cannot be empty");
        require(duration > 0, "Duration must be positive");
        
        uint256 goalId = goalCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalTargetSteps = FHE.fromExternal(targetSteps, inputProof);
        euint32 internalTargetCalories = FHE.fromExternal(targetCalories, inputProof);
        euint32 internalTargetDuration = FHE.fromExternal(targetDuration, inputProof);
        
        fitnessGoals[goalId] = FitnessGoal({
            goalId: FHE.asEuint32(0), // Will be set properly later
            targetSteps: internalTargetSteps,
            targetCalories: internalTargetCalories,
            targetDuration: internalTargetDuration,
            isAchieved: FHE.asEbool(false),
            goalType: goalType,
            user: msg.sender,
            startDate: block.timestamp,
            endDate: block.timestamp + duration
        });
        
        emit GoalCreated(goalId, msg.sender, goalType);
        return goalId;
    }
    
    function updateHealthMetrics(
        externalEuint32 weight,
        externalEuint32 height,
        externalEuint32 age,
        bytes calldata inputProof
    ) public {
        // Convert external encrypted values to internal
        euint32 internalWeight = FHE.fromExternal(weight, inputProof);
        euint32 internalHeight = FHE.fromExternal(height, inputProof);
        euint32 internalAge = FHE.fromExternal(age, inputProof);
        
        // Calculate BMI (simplified calculation)
        // BMI = weight / (height/100)^2
        euint32 heightInMeters = FHE.div(internalHeight, FHE.asEuint32(100));
        euint32 heightSquared = FHE.mul(heightInMeters, heightInMeters);
        euint32 bmi = FHE.div(internalWeight, heightSquared);
        
        healthMetrics[msg.sender] = HealthMetrics({
            weight: internalWeight,
            height: internalHeight,
            age: internalAge,
            bmi: bmi,
            user: msg.sender,
            lastUpdated: block.timestamp
        });
        
        emit HealthMetricsUpdated(msg.sender);
    }
    
    function checkGoalAchievement(
        uint256 goalId,
        externalEuint32 currentSteps,
        externalEuint32 currentCalories,
        externalEuint32 currentDuration,
        bytes calldata inputProof
    ) public {
        require(fitnessGoals[goalId].user == msg.sender, "Only goal owner can check achievement");
        require(block.timestamp <= fitnessGoals[goalId].endDate, "Goal period has ended");
        
        // Convert external encrypted values to internal
        euint32 internalCurrentSteps = FHE.fromExternal(currentSteps, inputProof);
        euint32 internalCurrentCalories = FHE.fromExternal(currentCalories, inputProof);
        euint32 internalCurrentDuration = FHE.fromExternal(currentDuration, inputProof);
        
        // Check if goals are achieved (simplified logic)
        ebool stepsAchieved = FHE.gte(internalCurrentSteps, fitnessGoals[goalId].targetSteps);
        ebool caloriesAchieved = FHE.gte(internalCurrentCalories, fitnessGoals[goalId].targetCalories);
        ebool durationAchieved = FHE.gte(internalCurrentDuration, fitnessGoals[goalId].targetDuration);
        
        // All goals must be achieved
        ebool allAchieved = FHE.and(stepsAchieved, FHE.and(caloriesAchieved, durationAchieved));
        
        if (FHE.decrypt(allAchieved)) {
            fitnessGoals[goalId].isAchieved = FHE.asEbool(true);
            emit GoalAchieved(goalId, msg.sender);
        }
    }
    
    function submitImpactReport(
        externalEuint32 totalSteps,
        externalEuint32 totalCalories,
        externalEuint32 totalWorkouts,
        externalEuint32 achievements,
        string memory reportHash,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(reportHash).length > 0, "Report hash cannot be empty");
        
        uint256 reportId = reportCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalTotalSteps = FHE.fromExternal(totalSteps, inputProof);
        euint32 internalTotalCalories = FHE.fromExternal(totalCalories, inputProof);
        euint32 internalTotalWorkouts = FHE.fromExternal(totalWorkouts, inputProof);
        euint32 internalAchievements = FHE.fromExternal(achievements, inputProof);
        
        impactReports[reportId] = ImpactReport({
            reportId: FHE.asEuint32(0), // Will be set properly later
            totalSteps: internalTotalSteps,
            totalCalories: internalTotalCalories,
            totalWorkouts: internalTotalWorkouts,
            achievements: internalAchievements,
            isVerified: FHE.asEbool(false),
            reportHash: reportHash,
            user: msg.sender,
            timestamp: block.timestamp
        });
        
        emit ImpactReported(reportId, msg.sender);
        return reportId;
    }
    
    function verifyImpactReport(uint256 reportId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify reports");
        require(impactReports[reportId].user != address(0), "Report does not exist");
        
        impactReports[reportId].isVerified = FHE.asEbool(isVerified);
    }
    
    function updateUserReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getWorkoutSessionInfo(uint256 sessionId) public view returns (
        string memory workoutType,
        uint8 steps,
        uint8 calories,
        uint8 duration,
        uint8 heartRate,
        bool isCompleted,
        address user,
        uint256 timestamp
    ) {
        WorkoutSession storage session = workoutSessions[sessionId];
        return (
            session.workoutType,
            0, // FHE.decrypt(session.steps) - will be decrypted off-chain
            0, // FHE.decrypt(session.calories) - will be decrypted off-chain
            0, // FHE.decrypt(session.duration) - will be decrypted off-chain
            0, // FHE.decrypt(session.heartRate) - will be decrypted off-chain
            FHE.decrypt(session.isCompleted),
            session.user,
            session.timestamp
        );
    }
    
    function getFitnessGoalInfo(uint256 goalId) public view returns (
        string memory goalType,
        uint8 targetSteps,
        uint8 targetCalories,
        uint8 targetDuration,
        bool isAchieved,
        address user,
        uint256 startDate,
        uint256 endDate
    ) {
        FitnessGoal storage goal = fitnessGoals[goalId];
        return (
            goal.goalType,
            0, // FHE.decrypt(goal.targetSteps) - will be decrypted off-chain
            0, // FHE.decrypt(goal.targetCalories) - will be decrypted off-chain
            0, // FHE.decrypt(goal.targetDuration) - will be decrypted off-chain
            FHE.decrypt(goal.isAchieved),
            goal.user,
            goal.startDate,
            goal.endDate
        );
    }
    
    function getHealthMetricsInfo(address user) public view returns (
        uint8 weight,
        uint8 height,
        uint8 age,
        uint8 bmi,
        uint256 lastUpdated
    ) {
        HealthMetrics storage metrics = healthMetrics[user];
        return (
            0, // FHE.decrypt(metrics.weight) - will be decrypted off-chain
            0, // FHE.decrypt(metrics.height) - will be decrypted off-chain
            0, // FHE.decrypt(metrics.age) - will be decrypted off-chain
            0, // FHE.decrypt(metrics.bmi) - will be decrypted off-chain
            metrics.lastUpdated
        );
    }
    
    function getImpactReportInfo(uint256 reportId) public view returns (
        uint8 totalSteps,
        uint8 totalCalories,
        uint8 totalWorkouts,
        uint8 achievements,
        bool isVerified,
        string memory reportHash,
        address user,
        uint256 timestamp
    ) {
        ImpactReport storage report = impactReports[reportId];
        return (
            0, // FHE.decrypt(report.totalSteps) - will be decrypted off-chain
            0, // FHE.decrypt(report.totalCalories) - will be decrypted off-chain
            0, // FHE.decrypt(report.totalWorkouts) - will be decrypted off-chain
            0, // FHE.decrypt(report.achievements) - will be decrypted off-chain
            FHE.decrypt(report.isVerified),
            report.reportHash,
            report.user,
            report.timestamp
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
}
