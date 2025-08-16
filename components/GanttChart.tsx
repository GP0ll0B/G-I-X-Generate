import React from 'react';
import { MetaAdsEvent } from '../constants';

interface GanttChartProps {
    events: MetaAdsEvent[];
}

const CATEGORY_COLORS: { [key in MetaAdsEvent['category']]: {
    rowBg: string;
    text: string;
    barBg: string;
} } = {
    Global:    { rowBg: 'bg-red-500/10 dark:bg-red-500/20',    text: 'text-red-800 dark:text-red-200',    barBg: 'bg-red-500' },
    Structure: { rowBg: 'bg-yellow-500/10 dark:bg-yellow-500/20', text: 'text-yellow-800 dark:text-yellow-200', barBg: 'bg-yellow-500' },
    Creative:  { rowBg: 'bg-blue-500/10 dark:bg-blue-500/20',   text: 'text-blue-800 dark:text-blue-200',   barBg: 'bg-blue-500' },
    Delivery:  { rowBg: 'bg-green-500/10 dark:bg-green-500/20',  text: 'text-green-800 dark:text-green-200',  barBg: 'bg-green-500' },
    Audience:  { rowBg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-800 dark:text-purple-200', barBg: 'bg-purple-500' },
};

const timelineStart = new Date('2024-01-01T00:00:00Z');
const timelineEnd = new Date('2025-12-31T23:59:59Z');
const totalDuration = timelineEnd.getTime() - timelineStart.getTime();

const getEventPosition = (eventDateStr: string) => {
    const date = new Date(eventDateStr);
    const eventTime = date.getTime();
    if (eventTime < timelineStart.getTime() || eventTime > timelineEnd.getTime()) {
        return -1;
    }
    return ((eventTime - timelineStart.getTime()) / totalDuration) * 100;
};

const getMonthMarkers = () => {
    const markers = [];
    let currentDate = new Date(timelineStart);
    while (currentDate <= timelineEnd) {
        markers.push({
            label: currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            position: getEventPosition(currentDate.toISOString())
        });
        // A marker every 3 months for clarity
        currentDate.setMonth(currentDate.getMonth() + 3); 
    }
    return markers;
};

const monthMarkers = getMonthMarkers();

export const GanttChart: React.FC<GanttChartProps> = ({ events }) => {
    
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate width for a 15-day bar for visual representation
    const barWidthPercent = (15 * 24 * 60 * 60 * 1000 / totalDuration) * 100;

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden animate-fade-in-fast p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Meta Ads Automation Timeline</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Chronological activation of automated ad adjustments. Hover over bars for details.</p>
            
            <div className="w-full relative">
                {/* Timeline Header */}
                <div className="relative h-8 mb-2 border-b-2 border-gray-200/50 dark:border-gray-700/50">
                    {monthMarkers.map((marker, index) => (
                        <div key={index} className="absolute h-full flex flex-col items-center top-0" style={{ left: `${marker.position}%` }}>
                            <span className="text-xs text-gray-500 dark:text-gray-400 transform -translate-x-1/2">{marker.label}</span>
                            <div className="h-full w-px bg-gray-200/50 dark:border-gray-700/50 mt-1"></div>
                        </div>
                    ))}
                </div>

                {/* Chart Rows */}
                <div className="space-y-1">
                    {sortedEvents.map((event, index) => {
                        const leftPosition = getEventPosition(event.date);
                        if (leftPosition === -1) return null;

                        const colors = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Global;

                        return (
                            <div key={index} className={`flex flex-col sm:flex-row sm:items-center p-2 rounded-md ${colors.rowBg} transition-colors duration-300`}>
                                <div className="sm:w-1/3 sm:pr-4 flex-shrink-0 mb-1 sm:mb-0">
                                    <p className={`font-semibold text-sm truncate ${colors.text}`}>{event.recommendation}</p>
                                </div>
                                <div className="w-full sm:w-2/3 relative h-6 group">
                                    <div className="absolute top-0 left-0 w-full h-full bg-black/5 dark:bg-white/5 rounded-sm overflow-hidden">
                                        {/* Vertical grid lines for alignment */}
                                        {monthMarkers.map((marker, idx) => (
                                            <div key={idx} className="absolute top-0 h-full w-px bg-gray-200/50 dark:bg-gray-600/50" style={{ left: `${marker.position}%`}}></div>
                                        ))}
                                    </div>

                                    {/* Gantt Bar with Tooltip */}
                                    <div
                                        className="absolute h-full"
                                        style={{ 
                                            left: `${leftPosition}%`, 
                                            width: `${barWidthPercent}%`,
                                            minWidth: '4px',
                                        }}
                                    >
                                        <div className={`h-full w-full rounded-sm ${colors.barBg}`}></div>

                                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-3 bg-gray-900/80 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 backdrop-blur-sm">
                                            <div className={`p-1 mb-2 text-center rounded text-xs font-bold ${colors.rowBg} ${colors.text}`}>{event.category}</div>
                                            <p className="font-bold text-sm mb-1">{event.recommendation}</p>
                                            <p className="mb-2"><strong className="text-gray-400">Date:</strong> {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <p><strong className="text-gray-400">Purpose:</strong> {event.purpose}</p>
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-900/80"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};