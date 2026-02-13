import { Plus, MoreVertical, Search, Filter, Image as ImageIcon, Eye, Edit, Trash2, Calendar, Tag, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/dashboard/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/dashboard/ui/label";
import { Textarea } from "@/dashboard/ui/textarea";
import { ScrollArea } from "@/dashboard/ui/scroll-area";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category?: string;
  images?: { url: string }[] | string[];
  createdAt: string;
}

export default function DashNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    category: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news/getAllNews');
      setNews(Array.isArray(response.data) ? response.data : response.data.news || []);
    } catch (error) {
      console.error("Failed to fetch news", error);
      toast.error("Failed to load news articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast("Are you sure you want to delete this post?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/news/deleteNews/${id}`);
            toast.success("Post deleted successfully");
            fetchNews();
          } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete post");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => { },
      },
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNews) return;

    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('content', editForm.content);
      formData.append('category', editForm.category);

      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append('images', selectedFiles[i]);
        }
      }

      await api.put(`/news/updateNews/${selectedNews.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Post updated successfully");
      setIsEditOpen(false);
      fetchNews();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update post");
    }
  };

  const openView = (item: NewsItem) => {
    setSelectedNews(item);
    setIsViewOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setSelectedNews(item);
    setEditForm({
      title: item.title,
      content: item.content || "",
      category: item.category || ""
    });
    setIsEditOpen(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const getFirstImage = (item: NewsItem) => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      const img = item.images[0];
      return typeof img === 'string' ? img : (img as any).url;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">News & Updates</h1>
          <p className="mt-1 text-muted-foreground">
            Manage news articles and announcements.
          </p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground" asChild>
          <Link to="/admin/news/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>All Posts</CardTitle>
            <CardDescription>Published articles and updates.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search news..."
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
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
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
                    <TableCell colSpan={5} className="text-center py-10">No news found.</TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((item) => {
                    const imgUrl = getFirstImage(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="h-10 w-16 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                            {imgUrl ? (
                              <img src={imgUrl} alt={item.title} className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">{item.category || "General"}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
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
                              <DropdownMenuItem onClick={() => openView(item)} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View Post
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEdit(item)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Post
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(item.id)}
                                className="text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-muted/50 pt-6 px-1">
            <span className="text-sm text-muted-foreground">
              Showing {news.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, news.length)} of {news.length} entries
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
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
                <Tag className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">News Preview</DialogTitle>
                <DialogDescription className="text-sm">Reviewing published article details</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-8">
              <div className="space-y-8">
                {Array.isArray(selectedNews?.images) && selectedNews.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(selectedNews.images as any[]).map((img, i) => (
                      <div key={i} className="aspect-video relative overflow-hidden rounded-xl border border-muted-foreground/10 bg-muted/30 shadow-inner group">
                        <img
                          src={typeof img === 'string' ? img : img.url}
                          alt={`Gallery ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider">
                      <Tag className="h-3 w-3" />
                      {selectedNews?.category || "General"}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      <Calendar className="h-4 w-4" />
                      {selectedNews && new Date(selectedNews.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground">{selectedNews?.title}</h2>

                  <div className="bg-muted/30 p-8 rounded-2xl border border-border/50 shadow-inner">
                    <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-muted-foreground">
                      {selectedNews?.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsViewOpen(false)}>Close Preview</Button>
            <Button className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110" onClick={() => {
              setIsViewOpen(false);
              if (selectedNews) openEdit(selectedNews);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          <form onSubmit={handleUpdate} className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
              <DialogTitle className="text-2xl font-bold">Edit News Article</DialogTitle>
              <DialogDescription className="text-sm">Modify the content and metadata of this post.</DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-8">
                <div className="grid gap-8">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Headline</Label>
                    <Input
                      id="title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Enter article headline"
                      className="h-12 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none text-lg font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Category</Label>
                      <Input
                        id="category"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        placeholder="e.g. Announcement, Event"
                        className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="images" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Add New Images</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setSelectedFiles(e.target.files)}
                          className="h-11 py-2 px-3 text-xs bg-muted/50 border-muted-foreground/20 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="content" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Article Content</Label>
                    <Textarea
                      id="content"
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      placeholder="Write the full story..."
                      className="min-h-[300px] bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none resize-none leading-relaxed text-[15px]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110">Update Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
