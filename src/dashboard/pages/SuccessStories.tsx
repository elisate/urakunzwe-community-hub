import { Plus, Search, Filter, Download, User, Calendar, MoreVertical, Eye, Edit, Trash2, ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/dashboard/ui/button";
import { Input } from "@/dashboard/ui/input";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/dashboard/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/dashboard/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/dashboard/ui/dialog";
import { Label } from "@/dashboard/ui/label";
import { Textarea } from "@/dashboard/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/dashboard/ui/dropdown-menu";
import { ScrollArea } from "@/dashboard/ui/scroll-area";
import { toast } from "sonner";

interface SuccessStory {
    id: string;
    title: string;
    description: string;
    img?: string;
}

export default function SuccessStories() {
    const [stories, setStories] = useState<SuccessStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Form state
    const [newStory, setNewStory] = useState({
        title: "",
        description: "",
    });
    const [editStory, setEditStory] = useState({
        title: "",
        description: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchStories = async () => {
        setLoading(true);
        try {
            const response = await api.get("/success_story/getAllStories");
            setStories(response.data);
            setError(null);
        } catch (error) {
            console.error("Failed to fetch stories:", error);
            setError("Failed to fetch stories");
            toast.error("Failed to load success stories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newStory.title);
            formData.append('description', newStory.description);
            if (selectedFile) {
                formData.append('img', selectedFile);
            }

            await api.post("/success_story/createSuccessStory", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsCreateOpen(false);
            setNewStory({ title: "", description: "" });
            setSelectedFile(null);
            fetchStories();
            toast.success("Story created successfully");
        } catch (error) {
            console.error("Failed to create story:", error);
            toast.error("Failed to create story");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStory) return;

        try {
            const formData = new FormData();
            formData.append('title', editStory.title);
            formData.append('description', editStory.description);
            if (selectedFile) {
                formData.append('img', selectedFile);
            }

            await api.patch(`/success_story/updateStory/${selectedStory.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsEditOpen(false);
            setSelectedStory(null);
            setSelectedFile(null);
            fetchStories();
            toast.success("Story updated successfully");
        } catch (error) {
            console.error("Failed to update story:", error);
            toast.error("Failed to update story");
        }
    };

    const handleDelete = async (id: string) => {
        toast("Are you sure you want to delete this story?", {
            description: "This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await api.delete(`/success_story/deleteStory/${id}`);
                        fetchStories();
                        toast.success("Story deleted successfully");
                    } catch (error) {
                        console.error("Failed to delete story:", error);
                        toast.error("Failed to delete story");
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
        });
    };

    const openEdit = (story: SuccessStory) => {
        setSelectedStory(story);
        setEditStory({
            title: story.title,
            description: story.description,
        });
        setIsEditOpen(true);
    };

    const openView = (story: SuccessStory) => {
        setSelectedStory(story);
        setIsViewOpen(true);
    };

    // Pagination logic
    const totalPages = Math.ceil(stories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStories = stories.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Success Stories</h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage and share impact stories from the community.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gradient-primary border-0 text-primary-foreground">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Story
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
                            <form onSubmit={handleCreate} className="flex flex-col h-full overflow-hidden">
                                <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
                                    <DialogTitle className="text-2xl font-bold">Add Success Story</DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Share a new story of impact. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 min-h-0 overflow-y-auto">
                                    <div className="p-8">
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Title</Label>
                                                <Input
                                                    id="title"
                                                    value={newStory.title}
                                                    onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                                                    placeholder="Enter story title"
                                                    className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none"
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="img" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Story Image</Label>
                                                <div className="flex items-center gap-6 p-4 rounded-xl border border-muted-foreground/10 bg-muted/20">
                                                    <div className="relative flex h-24 w-32 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-background overflow-hidden group">
                                                        {selectedFile ? (
                                                            <img
                                                                src={URL.createObjectURL(selectedFile)}
                                                                alt="Preview"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="h-8 w-8 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <Input
                                                            id="img"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                            className="h-10 py-1.5 px-3 text-sm bg-background/50 border-muted-foreground/20 cursor-pointer"
                                                        />
                                                        <p className="text-[10px] text-muted-foreground leading-tight">
                                                            Best as 3:2 aspect ratio. Jpeg or Png, max 5MB.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={newStory.description}
                                                    onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                                                    placeholder="Write the success story details..."
                                                    className="min-h-[200px] bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none resize-none leading-relaxed"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
                                    <Button type="button" variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsCreateOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110">Save Story</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle>Stories List</CardTitle>
                        <CardDescription>
                            Showing {stories.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, stories.length)} of {stories.length} stories.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead className="w-[250px]">Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">Loading stories...</TableCell>
                                    </TableRow>
                                ) : stories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">No stories found.</TableCell>
                                    </TableRow>
                                ) : (
                                    currentStories.map((story) => (
                                        <TableRow key={story.id}>
                                            <TableCell>
                                                <div className="h-12 w-20 overflow-hidden rounded-md border bg-muted">
                                                    {story.img ? (
                                                        <img
                                                            src={story.img}
                                                            alt={story.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium align-top">{story.title}</TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {story.description}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right align-top">
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
                                                            onClick={() => openView(story)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => openEdit(story)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Story
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(story.id)}
                                                            className="text-destructive focus:text-destructive cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Story
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
                            Showing {stories.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, stories.length)} of {stories.length} entries
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
                <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-lg">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">Success Story Details</DialogTitle>
                                <DialogDescription className="text-sm">Detailed view of this impact narrative.</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <div className="p-8">
                            <div className="space-y-8">
                                {selectedStory?.img && (
                                    <div className="aspect-[3/2] w-full overflow-hidden rounded-xl border border-muted-foreground/10 bg-muted/30 shadow-inner">
                                        <img
                                            src={selectedStory.img}
                                            alt={selectedStory.title}
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary">
                                        <Calendar className="h-3 w-3" /> Event Narrative
                                    </div>
                                    <h3 className="text-2xl font-bold leading-tight">{selectedStory?.title}</h3>
                                    <div className="bg-muted/30 p-6 rounded-xl border border-border/50 relative group">
                                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground italic">
                                            "{selectedStory?.description}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsViewOpen(false)}>Close</Button>
                        <Button className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110" onClick={() => {
                            setIsViewOpen(false);
                            if (selectedStory) openEdit(selectedStory);
                        }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Instead
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <form onSubmit={handleUpdate} className="flex flex-col h-full overflow-hidden">
                        <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
                            <DialogTitle className="text-2xl font-bold">Edit Success Story</DialogTitle>
                            <DialogDescription className="text-sm">
                                Update the details of this story. All changes are saved instantly.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <div className="p-8">
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Title</Label>
                                        <Input
                                            id="edit-title"
                                            value={editStory.title}
                                            onChange={(e) => setEditStory({ ...editStory, title: e.target.value })}
                                            placeholder="Enter story title"
                                            className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-img" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Story Image</Label>
                                        <div className="flex items-center gap-6 p-4 rounded-xl border border-muted-foreground/10 bg-muted/20">
                                            <div className="relative flex h-24 w-32 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-background overflow-hidden group">
                                                {selectedFile ? (
                                                    <img
                                                        src={URL.createObjectURL(selectedFile)}
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : selectedStory?.img ? (
                                                    <img
                                                        src={selectedStory.img}
                                                        alt="Current"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    id="edit-img"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                    className="h-10 py-1.5 px-3 text-sm bg-background/50 border-muted-foreground/20 cursor-pointer"
                                                />
                                                <p className="text-[10px] text-muted-foreground leading-tight">
                                                    Leave empty to keep current image.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Description</Label>
                                        <Textarea
                                            id="edit-description"
                                            value={editStory.description}
                                            onChange={(e) => setEditStory({ ...editStory, description: e.target.value })}
                                            placeholder="Write the success story details..."
                                            className="min-h-[200px] bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none resize-none leading-relaxed"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
                            <Button type="button" variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110">Update Story</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
