import { Heart, Activity, Users, Globe, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2, MoreVertical, Search, Filter, Image as ImageIcon, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/dashboard/ui/card";
import { Button } from "@/dashboard/ui/button";
import { Input } from "@/dashboard/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/dashboard/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/dashboard/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/dashboard/ui/dialog";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/dashboard/ui/scroll-area";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import StatsCard from "@/dashboard/ui/StatsCard";

interface Impact {
  id: string;
  title: string;
  description: string;
  img: string;
  actions_keypoints: string | string[];
  createdAt: string;
  updatedAt: string;
}

const parseActionKeypoints = (keypoints: string | string[]): string[] => {
  if (!keypoints) return [];

  let rawPoints: string[] = [];

  if (Array.isArray(keypoints)) {
    // If it's an array with one element that contains many points stringified
    if (keypoints.length === 1 && (keypoints[0].includes('","') || keypoints[0].includes('\",\"'))) {
      const inner = keypoints[0];
      // Split by comma with optional escaped or normal quotes
      rawPoints = inner.split(/["'],["']|\\",\\"/g);
    } else {
      rawPoints = keypoints;
    }
  } else if (typeof keypoints === 'string') {
    if (keypoints.includes('","') || keypoints.includes('\",\"')) {
      rawPoints = keypoints.split(/["'],["']|\\",\\"/g);
    } else {
      rawPoints = keypoints.split(',').map(p => p.trim());
    }
  }

  return rawPoints
    .map(p => p.trim()
      .replace(/^["']|["']$/g, '') // Remove start/end quotes
      .replace(/^\\"|\\"$/g, '')   // Remove escaped start/end quotes
      .replace(/^\\"/, '').replace(/\\"$/, '') // Double check escaped quotes
      .replace(/^"/, '').replace(/"$/, '')   // Double check normal quotes
      .trim()
    )
    .filter(p => p && p !== "" && p !== "\\\"");
};

export default function DashImpact() {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // View & Delete State
  const [selectedImpact, setSelectedImpact] = useState<Impact | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [impactToDelete, setImpactToDelete] = useState<Impact | null>(null);

  useEffect(() => {
    fetchImpacts();
  }, []);

  const fetchImpacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/impact/getAll');
      // Ensure we handle both direct array and { data: [...] } formats
      const data = response.data;
      const impactsList = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
      setImpacts(impactsList);
    } catch (error) {
      console.error("Failed to fetch impacts", error);
      toast.error("Failed to load impact data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!impactToDelete) return;

    try {
      await api.delete(`/impact/delete/${impactToDelete.id}`);
      toast.success("Impact deleted successfully");
      setIsDeleteOpen(false);
      setImpactToDelete(null);
      fetchImpacts();
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete impact");
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = impacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(impacts.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Impact Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage the impact stories and key points displayed on the website.
          </p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground" asChild>
          <Link to="/admin/impact/new">
            <Plus className="mr-2 h-4 w-4" />
            New Impact
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Impact Highlights</CardTitle>
            <CardDescription>A track record of our community success stories.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[150px] pl-9 sm:w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title & Overview</TableHead>
                  <TableHead className="hidden lg:table-cell">Full Description</TableHead>
                  <TableHead className="hidden md:table-cell">Key Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">Loading...</TableCell>
                  </TableRow>
                ) : currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">No impacts found.</TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((impact) => (
                    <TableRow key={impact.id}>
                      <TableCell>
                        <div className="h-10 w-14 overflow-hidden rounded border bg-muted flex items-center justify-center">
                          {impact.img ? (
                            <img src={impact.img} alt={impact.title} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          <span className="font-medium truncate">{impact.title}</span>
                          <span className="text-xs text-muted-foreground truncate italic md:hidden">
                            {impact.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <p className="text-xs text-muted-foreground line-clamp-2 max-w-[300px] leading-relaxed">
                          {impact.description}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-primary/60" />
                          <span>{parseActionKeypoints(impact.actions_keypoints).length} points</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedImpact(impact); setIsViewOpen(true); }} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/impact/edit/${impact.id}`} className="cursor-pointer flex items-center w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Impact
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setImpactToDelete(impact); setIsDeleteOpen(true); }} className="text-destructive focus:text-destructive cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Impact
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

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-muted/50 pt-6 px-1">
            <span className="text-sm text-muted-foreground">
              Showing {impacts.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, impacts.length)} of {impacts.length} entries
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="flex flex-col max-h-[85vh] sm:max-w-3xl p-0 overflow-hidden border-none shadow-2xl bg-background">
          <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
                <Heart className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold truncate">{selectedImpact?.title}</DialogTitle>
                <DialogDescription className="text-sm">Detailed impact overview and community benefits</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-8 space-y-8">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {selectedImpact?.createdAt ? new Date(selectedImpact.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold border border-border">
                  <Activity className="h-3.5 w-3.5" />
                  Impact Highlight
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    <Calendar className="h-3 w-3" />
                    Creation Date
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedImpact?.createdAt ? new Date(selectedImpact.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    <Activity className="h-3 w-3" />
                    Last Updated
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedImpact?.updatedAt ? new Date(selectedImpact.updatedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  <Users className="h-3 w-3" />
                  Audit Trace (ID)
                </div>
                <p className="text-[11px] font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded break-all">
                  {selectedImpact?.id}
                </p>
              </div>

              {selectedImpact?.img && (
                <div className="aspect-video rounded-xl overflow-hidden border shadow-sm group relative">
                  <img src={selectedImpact.img} alt={selectedImpact.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground">Mission Overview</h3>
                <div className="bg-muted/40 p-6 rounded-2xl border border-border/50 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground font-medium">
                    {selectedImpact?.description}
                  </p>
                </div>
              </div>

              {parseActionKeypoints(selectedImpact?.actions_keypoints || '').length > 0 && (
                <div className="space-y-4 pt-6 border-t border-muted">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Key Strategic Actions & Impact Points
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-1">
                    {parseActionKeypoints(selectedImpact?.actions_keypoints || '').map((point, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all group hover:shadow-md hover:-translate-y-0.5">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                          {idx + 1}
                        </div>
                        <span className="text-[15px] font-semibold text-foreground/80 leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsViewOpen(false)}>Close View</Button>
            <Button className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110" asChild>
              <Link to={`/admin/impact/edit/${selectedImpact?.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8 pb-0">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Delete Impact Highlight</DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{impactToDelete?.title}"</span>? This action cannot be undone and will remove all associated key points.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 pt-10 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="h-11 px-6 border-muted-foreground/20 hover:bg-muted"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="h-11 px-6 shadow-lg shadow-destructive/20"
              onClick={handleDelete}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}
