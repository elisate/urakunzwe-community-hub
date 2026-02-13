import { Plus, MoreVertical, Search, Filter, Eye, Edit, Trash2, Calendar, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Label } from "@/dashboard/ui/label";
import { Textarea } from "@/dashboard/ui/textarea";
import { ScrollArea } from "@/dashboard/ui/scroll-area";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Program {
  id: string;
  title: string;
  img: string;
  description: string;
  createdAt: string;
}

export default function DashProgram() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    description: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/program/getAllPrograms');
      setPrograms(Array.isArray(response.data) ? response.data : response.data.programs || []);
    } catch (error) {
      console.error("Failed to fetch programs", error);
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast("Are you sure you want to delete this program?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/program/deleteProgram/${id}`);
            toast.success("Program deleted successfully");
            fetchPrograms();
          } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete program");
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
    if (!selectedProgram) return;

    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);

      if (selectedFile) {
        formData.append('img', selectedFile);
      }

      await api.put(`/program/updateProgram/${selectedProgram.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Program updated successfully");
      setIsEditOpen(false);
      fetchPrograms();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update program");
    }
  };

  const openView = (program: Program) => {
    setSelectedProgram(program);
    setIsViewOpen(true);
  };

  const openEdit = (program: Program) => {
    setSelectedProgram(program);
    setEditForm({
      title: program.title,
      description: program.description
    });
    setSelectedFile(null); // Clear selected file when opening edit
    setIsEditOpen(true);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = programs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(programs.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Programs</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your community programs and initiatives.
          </p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground" asChild>
          <Link to="/admin/program/new">
            <Plus className="mr-2 h-4 w-4" />
            New Program
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>All Programs</CardTitle>
            <CardDescription>A list of all active programs.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search programs..."
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
                    <TableCell colSpan={5} className="text-center py-10">No programs found.</TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        <div className="h-10 w-10 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                          {program.img ? (
                            <img src={program.img} alt={program.title} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{program.title}</TableCell>
                      <TableCell className="max-w-[300px] truncate text-muted-foreground">{program.description}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {new Date(program.createdAt).toLocaleDateString()}
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
                            <DropdownMenuItem onClick={() => openView(program)} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(program)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Program
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(program.id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Program
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
              Showing {programs.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, programs.length)} of {programs.length} entries
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
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Program Details</DialogTitle>
                <DialogDescription className="text-sm">In-depth look at this community initiative</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-8">
              <div className="space-y-8">
                {selectedProgram?.img && (
                  <div className="aspect-video relative overflow-hidden rounded-2xl border border-muted-foreground/10 bg-muted/30 shadow-inner group">
                    <img
                      src={selectedProgram.img}
                      alt={selectedProgram.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 w-fit px-4 py-2 rounded-full border border-primary/10">
                    <Calendar className="h-3.5 w-3.5" />
                    Initiated {selectedProgram && new Date(selectedProgram.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                  <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground">{selectedProgram?.title}</h2>
                  <div className="bg-muted/40 p-8 rounded-2xl border border-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                    <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-muted-foreground font-medium">
                      {selectedProgram?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsViewOpen(false)}>Close View</Button>
            <Button className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110" onClick={() => {
              setIsViewOpen(false);
              if (selectedProgram) openEdit(selectedProgram);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Modify Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          <form onSubmit={handleUpdate} className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
              <DialogTitle className="text-2xl font-bold">Edit Program</DialogTitle>
              <DialogDescription className="text-sm">Update the program information and cover image.</DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-8">
                <div className="grid gap-8">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Program Title</Label>
                    <Input
                      id="title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Enter program title"
                      className="h-12 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none text-lg font-semibold"
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Cover Image</Label>
                    <div className="flex items-center gap-6 p-5 rounded-2xl border border-muted-foreground/10 bg-muted/20">
                      <div className="flex h-24 w-40 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-background overflow-hidden shadow-inner shrink-0">
                        {selectedFile ? (
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : selectedProgram?.img ? (
                          <img
                            src={selectedProgram.img}
                            alt="Current"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          id="img"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="h-10 py-1.5 px-3 text-sm bg-background border-muted-foreground/20 cursor-pointer shadow-none"
                        />
                        <p className="text-[10px] text-muted-foreground leading-tight italic">
                          Select a new image to replace the current one.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Program Description</Label>
                    <Textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Describe the program objectives and impact..."
                      className="min-h-[250px] bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none resize-none leading-relaxed text-[15px]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110">Update Program</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
