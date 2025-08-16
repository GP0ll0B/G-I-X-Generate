

import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SKILLS_DATA, SkillLevel, Challenge as ChallengeType } from '../constants';
import { Button } from './ui/Button';
import { 
    LockIcon, CheckCircleIcon, DocumentTextIcon, ChatBubbleIcon, DollarSignIcon, ChartBarIcon 
} from './ui/icons';

interface SkillsDashboardProps {
  completedChallenges: string[];
  setCompletedChallenges: React.Dispatch<React.SetStateAction<string[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const challengeIconMap: { [key in ChallengeType['icon']]: React.ReactNode } = {
    post: <DocumentTextIcon />,
    engage: <ChatBubbleIcon />,
    monetize: <DollarSignIcon />,
    analyze: <ChartBarIcon />
};

const ChallengeCard: React.FC<{
    challenge: ChallengeType;
    isCompleted: boolean;
    isLocked: boolean;
    onComplete: (id: string) => void;
}> = ({ challenge, isCompleted, isLocked, onComplete }) => {
    
    const challengeCardAnimation = {
        layout: true,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
    };
    
    const cardStateClasses = isCompleted 
        ? 'bg-green-500/10 dark:bg-green-900/20 border-green-500/20' 
        : isLocked 
        ? 'bg-gray-100/50 dark:bg-gray-800/30 border-gray-200/20 dark:border-gray-700/20 opacity-60 cursor-not-allowed'
        : 'bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:shadow-lg transform hover:-translate-y-1';

    return (
        <motion.div
            {...challengeCardAnimation as any}
            className={`p-5 rounded-xl shadow-md transition-all duration-300 border ${cardStateClasses}`}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 text-blue-500 dark:text-blue-400 ${isLocked || isCompleted ? 'opacity-50' : ''}`}>
                       {challengeIconMap[challenge.icon]}
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{challenge.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{challenge.description}</p>
                    </div>
                </div>
                <div className="mt-auto pt-4">
                    {isCompleted ? (
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                           <CheckCircleIcon /> Completed
                        </div>
                    ) : isLocked ? (
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                           <LockIcon /> Locked
                        </div>
                    ) : (
                        <Button 
                            variant="secondary" 
                            className="w-full"
                            onClick={() => onComplete(challenge.id)}
                        >
                            Mark as Complete
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};


const SkillsDashboard: React.FC<SkillsDashboardProps> = ({ completedChallenges, setCompletedChallenges, showToast }) => {

    const { currentLevel, levelProgress, totalChallengesInLevel } = useMemo(() => {
        let completedCount = 0;
        for (const level of SKILLS_DATA) {
            const challengesInLevel = level.challenges.map(c => c.id);
            const completedInLevel = challengesInLevel.filter(id => completedChallenges.includes(id)).length;
            
            if (completedInLevel < challengesInLevel.length) {
                return {
                    currentLevel: level,
                    levelProgress: completedInLevel,
                    totalChallengesInLevel: challengesInLevel.length
                };
            }
            completedCount += completedInLevel;
        }
        // If all levels are completed
        const lastLevel = SKILLS_DATA[SKILLS_DATA.length - 1];
        return {
            currentLevel: lastLevel,
            levelProgress: lastLevel.challenges.length,
            totalChallengesInLevel: lastLevel.challenges.length
        };
    }, [completedChallenges]);

    const handleCompleteChallenge = (id: string) => {
        const alreadyCompleted = completedChallenges.includes(id);
        if (alreadyCompleted) return;

        const updatedCompleted = [...completedChallenges, id];
        
        // Check for level up
        const challengesInCurrentLevel = currentLevel.challenges.map(c => c.id);
        const completedInLevelAfterUpdate = challengesInCurrentLevel.filter(cid => updatedCompleted.includes(cid)).length;

        if (completedInLevelAfterUpdate === challengesInCurrentLevel.length && currentLevel.level < SKILLS_DATA.length) {
             const nextLevel = SKILLS_DATA.find(l => l.level === currentLevel.level + 1);
             showToast(`Level Up! You are now a ${nextLevel?.title || 'Master'}!`, 'success');
        } else {
             showToast('Challenge Completed!', 'success');
        }

        setCompletedChallenges(updatedCompleted);
    };

    const progressPercentage = totalChallengesInLevel > 0 ? (levelProgress / totalChallengesInLevel) * 100 : 0;

    const progressBarAnimation = {
        initial: { width: 0 },
        animate: { width: `${progressPercentage}%` },
        transition: { duration: 0.5, ease: 'easeInOut' }
    };

    const sectionAnimation = { 
        layout: true 
    };

    return (
        <div className="animate-fade-in-fast max-w-7xl mx-auto">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Your Creator Journey
                </h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Complete challenges to level up your skills and unlock new potential.
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-6 sm:p-8 mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Current Level: {currentLevel.level}</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{currentLevel.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentLevel.description}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:w-1/3">
                         <div className="flex justify-between items-baseline mb-1">
                             <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Level Progress</span>
                             <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{levelProgress}/{totalChallengesInLevel}</span>
                         </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <motion.div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                {...progressBarAnimation as any}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                <AnimatePresence>
                {SKILLS_DATA.map(level => {
                    const isLevelLocked = level.level > currentLevel.level;
                    return (
                        <motion.section key={level.level} {...sectionAnimation as any}>
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-blue-500/50 pb-2 mb-6 flex items-center gap-3">
                                {isLevelLocked && <LockIcon />}
                                Level {level.level}: {level.title}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {level.challenges.map(challenge => (
                                    <ChallengeCard 
                                        key={challenge.id}
                                        challenge={challenge}
                                        isCompleted={completedChallenges.includes(challenge.id)}
                                        isLocked={isLevelLocked}
                                        onComplete={handleCompleteChallenge}
                                    />
                                ))}
                            </div>
                        </motion.section>
                    );
                })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SkillsDashboard;