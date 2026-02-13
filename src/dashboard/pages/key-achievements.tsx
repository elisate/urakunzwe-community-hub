import { Plus, MoreVertical, Search, Filter, Eye, Edit, Trash2, Award, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/dashboard/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/dashboard/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/dashboard/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/dashboard/ui/dialog";
import { ScrollArea } from "@/dashboard/ui/scroll-area";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface KeyAchievement {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}

export default function DashKeyAchievements() {
    const [achievements, setAchievements] = useState<KeyAchievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [selectedAchievement, setSelectedAchievement] = useState<KeyAchievement | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await api.get('/achievement/getAllAchievements');
            setAchievements(Array.isArray(response.data) ? response.data : response.data.achievements || []);
        } catch (error) {
            console.error("Failed to fetch achievements", error);
            toast.error("Failed to load achievements");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        toast("Are you sure you want to delete this achievement?", {
            description: "This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await api.delete(`/achievement/deleteAchievement/${id}`);
                        toast.success("Achievement deleted successfully");
                        fetchAchievements();
                    } catch (error) {
                        console.error("Delete failed", error);
                        toast.error("Failed to delete achievement");
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
        });
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = achievements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(achievements.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Key Achievements</h1>
                    <p className="mt-1 text-muted-foreground">
                        Highlight the major milestones and impacts of your community hub.
                    </p>
                </div>
                <Button className="gradient-primary border-0 text-primary-foreground" asChild>
                    <Link to="/admin/key-achievements/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Achievement
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle>All Achievements</CardTitle>
                        <CardDescription>A track record of our community success.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search achievements..."
                                className="w-[200px] pl-9 sm:w-[300px]"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px]">Icon</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
                                    </TableRow>
                                ) : currentItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10">No achievements found.</TableCell>
                                    </TableRow>
                                ) : (
                                    currentItems.map((achievement) => (
                                        <TableRow key={achievement.id}>
                                            <TableCell>
                                                <div className="h-10 w-10 overflow-hidden rounded-md border bg-primary/10 flex items-center justify-center text-primary">
                                                    <Award className="h-5 w-5" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate">{achievement.title}</TableCell>
                                            <TableCell className="max-w-[400px] truncate text-muted-foreground">{achievement.description}</TableCell>
                                            <TableCell className="text-sm whitespace-nowrap">
                                                {new Date(achievement.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedAchievement(achievement);
                                                                setIsViewOpen(true);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/admin/key-achievements/edit/${achievement.id}`} className="cursor-pointer flex items-center w-full">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Achievement
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(achievement.id)}
                                                            className="text-destructive focus:text-destructive cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Achievement
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-muted/50 pt-6 px-1">
                        <span className="text-sm text-muted-foreground">
                            Showing {achievements.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, achievements.length)} of {achievements.length} entries
                        </span>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="h-9 gap-1.5 border-muted-foreground/20 hover:bg-background"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1.5 px-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`h-8 w-8 rounded-md text-xs font-semibold transition-all ${currentPage === i + 1
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "hover:bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-9 gap-1.5 border-muted-foreground/20 hover:bg-background"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
                                <Award className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">Achievement Details</DialogTitle>
                                <DialogDescription className="text-sm">Major milestone and its community impact</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <div className="p-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 w-fit px-4 py-2 rounded-full border border-primary/10">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Recorded {selectedAchievement && new Date(selectedAchievement.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </div>
                                <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground">{selectedAchievement?.title}</h2>
                                <div className="bg-muted/40 p-8 rounded-2xl border border-border/50 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                                    <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-muted-foreground font-medium">
                                        {selectedAchievement?.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsViewOpen(false)}>Close View</Button>
                        <Button className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110" asChild>
                            <Link to={`/admin/key-achievements/edit/${selectedAchievement?.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modify Achievement
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
