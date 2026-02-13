import { Plus, MoreVertical, Search, Filter, Mail, Phone, Eye, Edit, Trash2, Calendar, Image as ImageIcon, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/dashboard/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  email: string;
  phone: string;
  socialsMedia: string;
  profile: string;
  createdAt: string;
}

export default function DashTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    description: "",
    email: "",
    phone: "",
    socialsMedia: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/team/getAllMembers');
      setMembers(Array.isArray(response.data) ? response.data : response.data.members || []);
    } catch (error) {
      console.error("Failed to fetch members", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast("Are you sure you want to delete this member?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/team/deleteMember/${id}`);
            toast.success("Member deleted successfully");
            fetchMembers();
          } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete member");
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
    if (!selectedMember) return;

    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('role', editForm.role);
      formData.append('description', editForm.description);
      formData.append('email', editForm.email);
      formData.append('phone', editForm.phone);
      formData.append('socialsMedia', editForm.socialsMedia);

      if (selectedFile) {
        formData.append('profile', selectedFile);
      }

      await api.put(`/team/updateMember/${selectedMember.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Member updated successfully");
      setIsEditOpen(false);
      fetchMembers();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update member");
    }
  };

  const openView = (member: TeamMember) => {
    setSelectedMember(member);
    setIsViewOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setEditForm({
      name: member.name,
      role: member.role,
      description: member.description,
      email: member.email,
      phone: member.phone,
      socialsMedia: member.socialsMedia
    });
    setSelectedFile(null);
    setIsEditOpen(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = members.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Team Members</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your team and staff profiles.
          </p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground" asChild>
          <Link to="/admin/team/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>All Members</CardTitle>
            <CardDescription>A list of current team members.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
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
                  <TableHead className="w-[80px]">Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
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
                    <TableCell colSpan={5} className="text-center py-10">No members found.</TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10 border shadow-sm">
                          <AvatarImage src={member.profile} className="object-cover" />
                          <AvatarFallback className="gradient-primary text-primary-foreground text-xs">{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{member.role}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="font-normal">{member.role}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{member.phone || "N/A"}</span>
                          </div>
                        </div>
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
                            <DropdownMenuItem onClick={() => openView(member)} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(member)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(member.id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Member
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
              Showing {members.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, members.length)} of {members.length} entries
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
              <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
                <AvatarImage src={selectedMember?.profile} className="object-cover" />
                <AvatarFallback className="gradient-primary text-primary-foreground text-xl">{selectedMember && getInitials(selectedMember.name)}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-bold">{selectedMember?.name}</DialogTitle>
                <DialogDescription className="text-sm font-medium text-primary">{selectedMember?.role}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-8">
              <div className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80 flex items-center gap-2">
                      <Mail className="h-3 w-3" /> Contact & Comm
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/40">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Email</span>
                        <span className="text-sm font-medium">{selectedMember?.email}</span>
                      </div>
                      <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/40">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Phone</span>
                        <span className="text-sm font-medium">{selectedMember?.phone || "Not provided"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80 flex items-center gap-2">
                      <Share2 className="h-3 w-3" /> Social Presence
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/40">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Handle</span>
                        <span className="text-sm font-medium truncate">{selectedMember?.socialsMedia || "Not linked"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80">Professional Bio</h3>
                  <div className="bg-muted/40 p-6 rounded-xl border border-border/50 shadow-inner">
                    <p className="text-[14px] leading-relaxed text-muted-foreground whitespace-pre-wrap italic">
                      "{selectedMember?.description || "No bio available for this member."}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 pt-4 border-t border-muted">
                  <Calendar className="h-3 w-3" />
                  Joined {selectedMember && new Date(selectedMember.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsViewOpen(false)}>Close Profile</Button>
            <Button className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110" onClick={() => {
              setIsViewOpen(false);
              if (selectedMember) openEdit(selectedMember);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          <form onSubmit={handleUpdate} className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
              <DialogTitle className="text-2xl font-bold">Edit Member Profile</DialogTitle>
              <DialogDescription className="text-sm">Update professional details and contact information.</DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-8">
                <div className="grid gap-8">
                  <div className="flex gap-8 items-start">
                    <div className="grid gap-3 shrink-0">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80">Avatar</Label>
                      <div className="relative group cursor-pointer h-24 w-24">
                        <Avatar className="h-full w-full border-2 border-muted-foreground/20 group-hover:border-primary transition-all shadow-md">
                          <AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : selectedMember?.profile} className="object-cover" />
                          <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">{selectedMember && getInitials(selectedMember.name)}</AvatarFallback>
                        </Avatar>
                        <label htmlFor="profile-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-[2px]">
                          <ImageIcon className="h-6 w-6" />
                        </label>
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-5 flex-1 pt-6">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role" className="text-xs font-semibold">Job Title / Role</Label>
                        <Input
                          id="role"
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-xs font-semibold">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+250..."
                        className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="socialsMedia" className="text-xs font-semibold">Social Media / Website</Label>
                    <Input
                      id="socialsMedia"
                      value={editForm.socialsMedia}
                      onChange={(e) => setEditForm({ ...editForm, socialsMedia: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-xs font-semibold">Professional Biography</Label>
                    <Textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Summarize experience and impact..."
                      className="min-h-[140px] bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none resize-none leading-relaxed"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
