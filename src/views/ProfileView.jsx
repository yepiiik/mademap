import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { editorController } from '../config/base';
import { AuthContext } from '../components/authentication/Auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { 
    format, 
    subDays, 
    isSameDay, 
    differenceInDays, 
    startOfDay, 
    eachDayOfInterval, 
    subYears 
} from 'date-fns';
import { BookOpen, FileText, Zap, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';

const parseDate = (value) => {
    if (!value) return new Date(0);
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    if (typeof value.seconds === 'number') {
        return new Date(value.seconds * 1000 + (value.nanoseconds || 0) / 1e6);
    }
    if (typeof value._seconds === 'number') {
        return new Date(value._seconds * 1000 + (value._nanoseconds || 0) / 1e6);
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date(0) : date;
};

const ProfileView = () => {
    const { username } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBlocks: 0,
        totalWords: 0,
        longestStreak: 0,
        currentStreak: 0
    });

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userBlocks = await editorController.getBlocks();
                const validBlocks = (userBlocks || []).filter(b => b && b.createdAt);
                setBlocks(validBlocks);
                calculateStats(validBlocks);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [username]);

    const calculateStats = (userBlocks) => {
        if (!userBlocks || userBlocks.length === 0) {
            setStats({ totalBlocks: 0, totalWords: 0, longestStreak: 0, currentStreak: 0 });
            return;
        }

        const totalBlocks = userBlocks.length;
        
        let totalWords = 0;
        userBlocks.forEach(block => {
            const text = typeof block.content === 'string' ? block.content : '';
            totalWords += text.trim().split(/\s+/).filter(w => w.length > 0).length;
        });

        // Calculate streaks
        const dates = userBlocks
            .map(b => startOfDay(parseDate(b.createdAt)))
            .sort((a, b) => b - a); // Newest first

        const uniqueDates = [...new Set(dates.map(d => d.getTime()))]
            .map(t => new Date(t))
            .sort((a, b) => b - a);
        
        let currentStreak = 0;
        let longestStreak = 0;

        if (uniqueDates.length > 0) {
            const today = startOfDay(new Date());
            const yesterday = subDays(today, 1);
            
            // Current streak check
            if (isSameDay(uniqueDates[0], today) || isSameDay(uniqueDates[0], yesterday)) {
                currentStreak = 1;
                for (let i = 0; i < uniqueDates.length - 1; i++) {
                    if (differenceInDays(uniqueDates[i], uniqueDates[i+1]) === 1) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }

            // Longest streak check
            let tempStreak = 1;
            for (let i = 0; i < uniqueDates.length - 1; i++) {
                if (differenceInDays(uniqueDates[i], uniqueDates[i+1]) === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, tempStreak);
        }

        setStats({ totalBlocks, totalWords, longestStreak, currentStreak });
    };

    const ActivityGrid = () => {
        const endDate = new Date();
        const startDate = subYears(endDate, 1);
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        const getContributionLevel = (count) => {
            if (count === 0) return "bg-muted";
            if (count < 2) return "bg-secondary/30";
            if (count < 5) return "bg-secondary/60";
            if (count < 10) return "bg-secondary/80";
            return "bg-secondary";
        };

        const activityMap = {};
        blocks.forEach(block => {
            const dateStr = format(parseDate(block.createdAt), 'yyyy-MM-dd');
            activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
        });

        return (
            <div className="flex flex-wrap gap-1 w-full overflow-x-auto pb-4">
                <TooltipProvider>
                    {days.map((day, i) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const count = activityMap[dateStr] || 0;
                        return (
                            <Tooltip key={i}>
                                <TooltipTrigger asChild>
                                    <div 
                                        className={cn(
                                            "w-3 h-3 rounded-sm transition-colors cursor-help",
                                            getContributionLevel(count)
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">{count} blocks on {format(day, 'MMM d, yyyy')}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </div>
        );
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading Profile...</div>;

    const profileName = username === currentUser?.displayName ? currentUser?.displayName : username;

    return (
        <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Info */}
                <div className="space-y-6">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                        <Avatar className="w-48 h-48 border-4 border-background shadow-xl">
                            <AvatarImage src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1496360711189-5edeb09fe715?q=80&w=1974&auto=format&fit=crop'} />
                            <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[var(--primary-color)]">{profileName}</h1>
                            <p className="text-muted-foreground">mademap.web.app/{username}</p>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <span className="font-medium text-[var(--primary-color)]">10 <span className="text-muted-foreground font-normal">followers</span></span>
                            <span className="font-medium text-[var(--primary-color)]">11 <span className="text-muted-foreground font-normal">following</span></span>
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--primary-color)]/80 max-w-xs">
                            Creating thoughts into digital blocks. Mapping ideas one piece at a time. 
                            Passionate about structural writing and knowledge organization.
                        </p>
                    </div>
                </div>

                {/* Right Column: Stats & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-[var(--transperant-background)] border-[var(--primary-border)] shadow-none">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <BookOpen className="w-3 h-3" /> Blocks
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-[var(--primary-color)]">{stats.totalBlocks}</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-[var(--transperant-background)] border-[var(--primary-border)] shadow-none">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> Words
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-[var(--primary-color)]">{stats.totalWords}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[var(--transperant-background)] border-[var(--primary-border)] shadow-none">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Current Streak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-[var(--primary-color)]">{stats.currentStreak}d</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[var(--transperant-background)] border-[var(--primary-border)] shadow-none">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-secondary" /> Longest
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold text-[var(--primary-color)]">{stats.longestStreak}d</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-[var(--transperant-background)] border-[var(--primary-border)] shadow-none">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-[var(--primary-color)]">
                                <CalendarIcon className="w-4 h-4" /> Activity Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityGrid />
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-6">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-none px-0 py-2">Overview</TabsTrigger>
                            <TabsTrigger value="blocks" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-none px-0 py-2">All Blocks</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="pt-6">
                            <div className="text-sm text-muted-foreground italic">
                                Overview of your recent activity and most used words will appear here.
                            </div>
                        </TabsContent>
                        <TabsContent value="blocks" className="pt-6">
                            <div className="space-y-4">
                                {blocks.slice(0, 5).map(block => (
                                    <Card key={block.id} className="bg-[var(--transperant-background)] border-[var(--primary-border)] shadow-none">
                                        <CardContent className="p-4">
                                            <p className="text-sm line-clamp-2 text-[var(--primary-color)]/90">
                                                {typeof block.content === 'string' ? block.content : 'Empty block'}
                                            </p>
                                            <div className="mt-2 text-[10px] text-muted-foreground uppercase">
                                                {format(parseDate(block.createdAt), 'MMM d, yyyy')}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
