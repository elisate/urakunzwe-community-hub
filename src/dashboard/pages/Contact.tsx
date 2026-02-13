import { MoreVertical, Search, Filter, Mail, Eye, Trash2, Calendar, User, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/dashboard/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/dashboard/ui/dialog";
import { ScrollArea } from "@/dashboard/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function DashContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contact/getAllContacts');
      setContacts(Array.isArray(response.data) ? response.data : response.data.contacts || []);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast("Are you sure you want to delete this message?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/contact/deleteContact/${id}`);
            toast.success("Message deleted successfully");
            fetchContacts();
          } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete message");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => { },
      },
    });
  };

  const openView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewOpen(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Inbox</h1>
        <p className="text-muted-foreground">
          View and manage contact form submissions from your website.
        </p>
      </div>

      <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">Messages</CardTitle>
            <CardDescription>
              Check your latest inquiries ({contacts.length} total)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search inbox..."
                className="w-[200px] pl-10 sm:w-[300px] h-10 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 border-muted-foreground/20 hover:bg-background">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-muted-foreground/10 overflow-hidden bg-background/30 px-1">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-muted-foreground/10">
                  <TableHead className="font-semibold text-foreground py-4">Sender</TableHead>
                  <TableHead className="font-semibold text-foreground hidden sm:table-cell">Subject</TableHead>
                  <TableHead className="font-semibold text-foreground">Message Preview</TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">Received</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span className="animate-pulse">Loading inbox...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-muted-foreground italic">
                      No messages in your inbox.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((contact) => (
                    <TableRow key={contact.id} className="group hover:bg-muted/30 transition-colors border-muted-foreground/5 py-4">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {contact.firstName} {contact.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-4">
                        <Badge variant="outline" className="font-normal bg-background/50 border-muted-foreground/10">
                          {contact.subject}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px] lg:max-w-[300px] py-4">
                        <p className="text-sm text-muted-foreground truncate group-hover:text-foreground/80 transition-colors">
                          {contact.message}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap hidden md:table-cell py-4">
                        {new Date(contact.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/80 shadow-none border-none">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px] p-1.5 shadow-xl border-muted-foreground/10">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 pb-2">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-muted-foreground/5" />
                            <DropdownMenuItem onClick={() => openView(contact)} className="cursor-pointer gap-2 py-2 text-sm">
                              <Eye className="h-4 w-4 text-primary" />
                              View Message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2 py-2 text-sm" asChild>
                              <a href={`mailto:${contact.email}`}>
                                <Mail className="h-4 w-4 text-blue-500" />
                                Reply via Email
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-muted-foreground/5" />
                            <DropdownMenuItem
                              onClick={() => handleDelete(contact.id)}
                              className="text-destructive focus:text-destructive cursor-pointer gap-2 py-2 text-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Thread
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
              Showing {contacts.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, contacts.length)} of {contacts.length} entries
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

      {/* View Message Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Message Inspection</DialogTitle>
                <DialogDescription className="text-sm">Reviewing communication from {selectedContact?.firstName} {selectedContact?.lastName}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-8">
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80 flex items-center gap-2">
                      <User className="h-3 w-3" /> Sender Identity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Full Name</span>
                        <span className="text-sm font-bold text-foreground">{selectedContact?.firstName} {selectedContact?.lastName}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Return Email</span>
                        <span className="text-sm font-bold text-primary truncate hover:underline cursor-pointer">{selectedContact?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80 flex items-center gap-2">
                      <Calendar className="h-3 w-3" /> Dispatch Info
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Received At</span>
                        <span className="text-sm font-bold text-foreground">
                          {selectedContact?.createdAt && new Date(selectedContact.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Origin Category</span>
                        <span className="text-sm font-bold text-foreground">Inquiry</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80 flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" /> Subject & Commentary
                  </h3>
                  <div className="bg-muted/40 p-8 rounded-2xl border border-border/50 shadow-inner relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                    <h4 className="text-lg font-extrabold text-foreground mb-4 leading-tight">{selectedContact?.subject}</h4>
                    <p className="text-[15px] leading-relaxed text-muted-foreground whitespace-pre-wrap italic">
                      "{selectedContact?.message}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
            <Button
              variant="destructive"
              className="sm:mr-auto h-11 px-6 shadow-sm bg-destructive/90 hover:bg-destructive transition-all"
              onClick={() => {
                if (selectedContact) {
                  setIsViewOpen(false);
                  handleDelete(selectedContact.id);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Message
            </Button>
            <Button variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110" asChild>
              <a href={`mailto:${selectedContact?.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Reply Now
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
