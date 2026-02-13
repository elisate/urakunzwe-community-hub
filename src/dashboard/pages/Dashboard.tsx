import { Users, BookOpen, Layers, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/dashboard/ui/button";

const data = [
  { name: 'Jan', beneficiaries: 400, donations: 240 },
  { name: 'Feb', beneficiaries: 300, donations: 139 },
  { name: 'Mar', beneficiaries: 200, donations: 980 },
  { name: 'Apr', beneficiaries: 278, donations: 390 },
  { name: 'May', beneficiaries: 189, donations: 480 },
  { name: 'Jun', beneficiaries: 239, donations: 380 },
  { name: 'Jul', beneficiaries: 349, donations: 430 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    programs: 0,
    team: 0,
    news: 0,
    messages: 0,
    donations: 0,
    achievements: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Recent Activity Pagination State
  const [activityPage, setActivityPage] = useState(1);
  const itemsPerActivityPage = 5;

  const totalActivityPages = Math.ceil(activities.length / itemsPerActivityPage);
  const indexOfLastActivity = activityPage * itemsPerActivityPage;
  const indexOfFirstActivity = indexOfLastActivity - itemsPerActivityPage;
  const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);

  // Helper function to format relative time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch all lists in parallel
        const [programsRes, teamRes, newsRes, contactRes, donationRes, storiesRes, achievementsRes] = await Promise.all([
          api.get('/program/getAllPrograms'),
          api.get('/team/getAllMembers'),
          api.get('/news/getAllNews'),
          api.get('/contact/getAllContacts'),
          api.get('/donation/getDonations'),
          api.get('/success_story/getAllStories'),
          api.get('/achievement/getAllAchievements')
        ]);

        const programsData = Array.isArray(programsRes.data) ? programsRes.data : programsRes.data.programs || [];
        const teamData = Array.isArray(teamRes.data) ? teamRes.data : teamRes.data.members || [];
        const newsData = Array.isArray(newsRes.data) ? newsRes.data : newsRes.data.news || [];
        const contactsData = Array.isArray(contactRes.data) ? contactRes.data : contactRes.data.contacts || [];
        const donationsData = Array.isArray(donationRes.data) ? donationRes.data : donationRes.data.donations || [];
        const storiesData = Array.isArray(storiesRes.data) ? storiesRes.data : storiesRes.data.stories || [];
        const achievementsData = Array.isArray(achievementsRes.data) ? achievementsRes.data : achievementsRes.data.achievements || [];

        setStats({
          programs: programsData.length,
          team: teamData.length,
          news: newsData.length,
          messages: contactsData.length,
          donations: donationsData.length,
          achievements: achievementsData.length
        });

        // Combine and transform into activities
        const combinedActivities = [
          ...programsData.flatMap((item: any) => {
            const created = {
              id: `prog-${item.id}`,
              title: "New Program",
              description: item.title,
              time: formatTimeAgo(item.createdAt),
              rawDate: new Date(item.createdAt),
              color: "bg-green-500",
              ping: (new Date().getTime() - new Date(item.createdAt).getTime()) < 3600000 // Ping if less than 1 hour old
            };
            const updated = item.updatedAt && new Date(item.updatedAt).getTime() > new Date(item.createdAt).getTime() + 60000 ? [{
              id: `prog-upd-${item.id}`,
              title: "Program Updated",
              description: item.title,
              time: formatTimeAgo(item.updatedAt),
              rawDate: new Date(item.updatedAt),
              color: "bg-green-400",
              ping: (new Date().getTime() - new Date(item.updatedAt).getTime()) < 3600000
            }] : [];
            return [created, ...updated];
          }),
          ...teamData.flatMap((item: any) => {
            const created = {
              id: `team-${item.id}`,
              title: "New Team Member",
              description: `${item.name} joined as ${item.position}`,
              time: formatTimeAgo(item.createdAt),
              rawDate: new Date(item.createdAt),
              color: "bg-orange-500"
            };
            const updated = item.updatedAt && new Date(item.updatedAt).getTime() > new Date(item.createdAt).getTime() + 60000 ? [{
              id: `team-upd-${item.id}`,
              title: "Team Member Updated",
              description: `${item.name}'s profile updated`,
              time: formatTimeAgo(item.updatedAt),
              rawDate: new Date(item.updatedAt),
              color: "bg-orange-400",
              ping: (new Date().getTime() - new Date(item.updatedAt).getTime()) < 3600000
            }] : [];
            return [created, ...updated];
          }),
          ...newsData.flatMap((item: any) => {
            const created = {
              id: `news-${item.id}`,
              title: "News Published",
              description: item.title,
              time: formatTimeAgo(item.createdAt),
              rawDate: new Date(item.createdAt),
              color: "bg-purple-500"
            };
            const updated = item.updatedAt && new Date(item.updatedAt).getTime() > new Date(item.createdAt).getTime() + 60000 ? [{
              id: `news-upd-${item.id}`,
              title: "News Updated",
              description: item.title,
              time: formatTimeAgo(item.updatedAt),
              rawDate: new Date(item.updatedAt),
              color: "bg-purple-400",
              ping: (new Date().getTime() - new Date(item.updatedAt).getTime()) < 3600000
            }] : [];
            return [created, ...updated];
          }),
          ...contactsData.map((item: any) => ({
            id: `cont-${item.id}`,
            title: "New Message",
            description: `From ${item.firstName} ${item.lastName}: ${item.subject}`,
            time: formatTimeAgo(item.createdAt),
            rawDate: new Date(item.createdAt),
            color: "bg-red-500"
          })),
          ...donationsData.map((item: any) => ({
            id: `don-${item.id}`,
            title: "New Donation",
            description: `$${item.amount} from ${item.donorName || "Anonymous"}`,
            time: formatTimeAgo(item.createdAt),
            rawDate: new Date(item.createdAt),
            color: "bg-blue-500"
          })),
          ...storiesData.flatMap((item: any) => {
            const created = {
              id: `story-${item.id}`,
              title: "Impact Story Added",
              description: item.title,
              time: formatTimeAgo(item.createdAt || new Date()),
              rawDate: new Date(item.createdAt || new Date()),
              color: "bg-indigo-500"
            };
            const updated = item.updatedAt && new Date(item.updatedAt).getTime() > new Date(item.createdAt || 0).getTime() + 60000 ? [{
              id: `story-upd-${item.id}`,
              title: "Story Updated",
              description: item.title,
              time: formatTimeAgo(item.updatedAt),
              rawDate: new Date(item.updatedAt),
              color: "bg-indigo-400",
              ping: (new Date().getTime() - new Date(item.updatedAt).getTime()) < 3600000
            }] : [];
            return [created, ...updated];
          }),
          ...achievementsData.flatMap((item: any) => {
            const created = {
              id: `ach-${item.id}`,
              title: "New Achievement",
              description: item.title,
              time: formatTimeAgo(item.createdAt),
              rawDate: new Date(item.createdAt),
              color: "bg-yellow-500"
            };
            const updated = item.updatedAt && new Date(item.updatedAt).getTime() > new Date(item.createdAt).getTime() + 60000 ? [{
              id: `ach-upd-${item.id}`,
              title: "Achievement Updated",
              description: item.title,
              time: formatTimeAgo(item.updatedAt),
              rawDate: new Date(item.updatedAt),
              color: "bg-yellow-400",
              ping: (new Date().getTime() - new Date(item.updatedAt).getTime()) < 3600000
            }] : [];
            return [created, ...updated];
          })
        ];

        // Sort by date descending
        combinedActivities.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
        setActivities(combinedActivities);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Programs */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.programs}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.team}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Donations */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.donations}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>

        {/* Active Now / News */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.news}</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Reports Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Impact Analytics</CardTitle>
            <CardDescription>
              Overview of beneficiaries and donations over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Area type="monotone" dataKey="beneficiaries" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="donations" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions performed in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 min-h-[350px]">
              {currentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <span className="relative flex h-2 w-2 mr-4">
                    {activity.ping && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${activity.color}`}></span>
                  </span>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-muted/50 pt-6 px-1">
              <span className="text-xs text-muted-foreground">
                Showing {activities.length > 0 ? indexOfFirstActivity + 1 : 0} to {Math.min(indexOfLastActivity, activities.length)} of {activities.length}
              </span>
              {totalActivityPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivityPage(prev => Math.max(1, prev - 1))}
                    disabled={activityPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-medium">{activityPage} / {totalActivityPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivityPage(prev => Math.min(totalActivityPages, prev + 1))}
                    disabled={activityPage === totalActivityPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
