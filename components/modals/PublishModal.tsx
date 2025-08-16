






import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublishModalProps, MAKE_WEBHOOK_URL } from '../../constants';
import { useFacebook } from '../../hooks/useFacebook';
import { constructMakePayload, sendToMakeWebhook } from '../../services/makeService';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { FacebookIcon, MakeIcon, SendIcon, XIcon } from '../ui/icons';
import { Tabs } from '../ui/Tabs';
import { ManualTokenInfo } from '../ManualTokenInfo';
import { PublishingControls } from '../PublishingControls';


const getTodayAtMidnight = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const ModalContent: React.FC<PublishModalProps> = ({ isOpen, onClose, generatedContent, showToast }) => {
    const modalAnimation = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.2, ease: 'easeOut' },
    };

    const scheduleAnimation = {
        initial: {opacity: 0, height: 0},
        animate: {opacity: 1, height: 'auto'}
    };

    const targetAnimation = {
        initial: {opacity: 0},
        animate: {opacity: 1},
        exit: {opacity: 0}
    };
    
    const [publishTarget, setPublishTarget] = useState<'make' | 'facebook'>('make');
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    
    const [makePublishStatus, setMakePublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
    const [fbPublishStatus, setFbPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');

    const fb = useFacebook();
    const isHttpsError = fb.loginError && fb.loginError.includes('HTTPS');

    const [manualToken, setManualToken] = useState('');
    const [manualPageId, setManualPageId] = useState('');

    const handleManualConnect = () => fb.connectWithManualToken(manualToken, manualPageId);

    const handleMakePublish = useCallback(async () => {
        if (!generatedContent) return;
        setMakePublishStatus('publishing');
        try {
            const finalDate = isScheduling && scheduleDate && scheduleTime ? new Date(`${scheduleDate}T${scheduleTime}`) : null;
            const payload = constructMakePayload(generatedContent, finalDate);
            await sendToMakeWebhook(MAKE_WEBHOOK_URL, payload);
            setMakePublishStatus('success');
            showToast(finalDate ? 'Post scheduled successfully via Make.com!' : 'Post sent to Make.com successfully!', 'success');
            setTimeout(() => { setMakePublishStatus('idle'); onClose(); }, 2000);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            setMakePublishStatus('error');
            showToast(msg, 'error');
            setTimeout(() => setMakePublishStatus('idle'), 4000);
        }
    }, [generatedContent, isScheduling, scheduleDate, scheduleTime, showToast, onClose]);

    const handleFacebookPublish = async () => {
        if (!generatedContent || !fb.selectedPage) return;
        setFbPublishStatus('publishing');
        try {
            const finalDate = isScheduling && scheduleDate && scheduleTime ? new Date(`${scheduleDate}T${scheduleTime}`) : null;
            await fb.handlePublishToFacebook(generatedContent, finalDate);
            setFbPublishStatus('success');
            showToast(finalDate ? `Post scheduled successfully to ${fb.selectedPage.name}!` : `Post published successfully to ${fb.selectedPage.name}!`, 'success');
            setTimeout(() => { setFbPublishStatus('idle'); onClose(); }, 2000);
        } catch (e) {
            setFbPublishStatus('error');
            setTimeout(() => setFbPublishStatus('idle'), 4000);
        }
    };

    const getMakeButtonText = () => {
        if (makePublishStatus === 'publishing') return isScheduling ? 'Scheduling...' : 'Publishing...';
        if (makePublishStatus === 'success') return 'Success!';
        if (makePublishStatus === 'error') return 'Failed!';
        return isScheduling ? 'Schedule Post' : 'Publish Now';
    };

    const getFacebookButtonText = () => {
        if (fbPublishStatus === 'publishing' || fb.isPublishing) return isScheduling ? 'Scheduling...' : 'Publishing...';
        if (fbPublishStatus === 'success') return 'Success!';
        if (fbPublishStatus === 'error') return 'Failed!';
        return isScheduling ? 'Schedule Post' : 'Publish to Page';
    };

    const isMakeButtonDisabled = makePublishStatus === 'publishing' || (isScheduling && (!scheduleDate || !scheduleTime));
    const isFacebookButtonDisabled = fb.isPublishing || !fb.selectedPage || fbPublishStatus === 'publishing' || (isScheduling && (!scheduleDate || !scheduleTime));
    const showFacebookPublish = generatedContent?.type !== 'strategy' && generatedContent?.type !== 'video_generation' && generatedContent?.type !== 'voice_dialog';
    const postType = generatedContent?.type;

    const makeNote = postType === 'video' ? 'Video posts will be published as text scripts.' : postType === 'strategy' ? 'The full strategy plan (JSON) will be sent to your scenario.' : postType === 'video_generation' ? 'The video URL will be sent to your Make.com scenario.' : postType === 'voice_dialog' ? 'The structured dialog will be sent to your Make.com scenario.' : 'Posts will be sent to your Make.com scenario.';
    const facebookNote = !fb.isLoggedIn ? "Connect to Facebook or provide an access token." : fb.pages.length === 0 ? "No manageable Facebook Pages found." : "Select a Page to publish or schedule your content.";

    return (
        <motion.div
            {...modalAnimation as any}
            className="relative w-full max-w-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-white/10"
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold">Publish Content</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400">
                    <XIcon />
                </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
                <Tabs
                    options={[
                        { value: 'make', label: 'Publish via Make', icon: <MakeIcon/> },
                        { value: 'facebook', label: 'Publish to Facebook', icon: <FacebookIcon/> }
                    ]}
                    active={publishTarget}
                    onSelect={(val) => setPublishTarget(val)}
                />

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="publish-type" checked={!isScheduling} onChange={() => setIsScheduling(false)} className="form-radio text-blue-600 focus:ring-blue-500" />
                    <span className="font-medium text-sm">Publish Now</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="publish-type" checked={isScheduling} onChange={() => setIsScheduling(true)} className="form-radio text-blue-600 focus:ring-blue-500" />
                    <span className="font-medium text-sm">Schedule for Later</span>
                  </label>
                </div>

                {isScheduling && (
                  <motion.div {...scheduleAnimation as any} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                      <input type="date" id="schedule-date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} min={getTodayAtMidnight().toISOString().split('T')[0]} className="w-full p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                      <input type="time" id="schedule-time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                  </motion.div>
                )}
                
                <AnimatePresence mode="wait">
                    {publishTarget === 'make' ? (
                        <motion.div key="make" {...targetAnimation as any} className="space-y-3 pt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">{makeNote}</p>
                            <Button onClick={handleMakePublish} disabled={isMakeButtonDisabled} className={`w-full transition-all ${makePublishStatus === 'success' ? '!bg-green-600 hover:!bg-green-700' : makePublishStatus === 'error' ? '!bg-red-600 hover:!bg-red-700' : ''}`}>
                                {makePublishStatus === 'publishing' ? <Loader text={getMakeButtonText()} /> : <SendIcon />}
                                {getMakeButtonText()}
                            </Button>
                        </motion.div>
                    ) : (
                         <motion.div key="facebook" {...targetAnimation as any} className="space-y-3 pt-2">
                             {!showFacebookPublish ? (
                                generatedContent?.type === 'strategy' ? (
                                    <p className="text-sm text-center text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 p-3 rounded-md">Strategy plans cannot be published directly to Facebook and must be copied.</p>
                                ) : generatedContent?.type === 'voice_dialog' ? (
                                    <p className="text-sm text-center text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 p-3 rounded-md">Voice dialogs cannot be published directly to Facebook.</p>
                                ) : (
                                    <p className="text-sm text-center text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 p-3 rounded-md">Generated videos must be downloaded and published to Facebook manually.</p>
                                )
                             ) : (
                                <>
                                <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">{facebookNote}</p>
                                {!fb.isLoggedIn ? (
                                    <div className="space-y-3">
                                        {isHttpsError ? (
                                            <p className="text-xs text-red-600 dark:text-red-400 text-center p-2 bg-red-500/10 rounded-md">{fb.loginError}</p>
                                        ) : (
                                            <>
                                            <Button onClick={fb.login} disabled={!fb.isSdkLoaded} className="w-full !bg-blue-800 hover:!bg-blue-900">
                                            <FacebookIcon/> Connect with Facebook
                                            </Button>
                                            {fb.loginError && <p className="text-xs text-red-600 dark:text-red-400 text-center">{fb.loginError}</p>}
                                            </>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <hr className="flex-grow border-gray-300/50 dark:border-gray-600/50" />
                                            <span className="text-xs text-gray-500">OR</span>
                                            <hr className="flex-grow border-gray-300/50 dark:border-gray-600/50" />
                                        </div>
                                        <ManualTokenInfo
                                            manualToken={manualToken}
                                            setManualToken={setManualToken}
                                            manualPageId={manualPageId}
                                            setManualPageId={setManualPageId}
                                            onConnect={handleManualConnect}
                                            isConnecting={fb.isVerifyingToken}
                                            error={fb.verificationError}
                                        />
                                    </div>
                                ) : (
                                    <PublishingControls
                                        onPublish={handleFacebookPublish}
                                        isPublishing={fb.isPublishing || fbPublishStatus === 'publishing'}
                                        buttonText={getFacebookButtonText()}
                                        isButtonDisabled={isFacebookButtonDisabled}
                                        publishStatus={fbPublishStatus}
                                        error={fb.publishError}
                                        pages={fb.pages}
                                        selectedPage={fb.selectedPage}
                                        onSelectPage={fb.setSelectedPage}
                                    />
                                )}
                                </>
                             )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export const PublishModal: React.FC<PublishModalProps> = (props) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-overlay-show backdrop-blur-md"
            onClick={props.onClose}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <ModalContent {...props} />
            </div>
        </div>
    );
};