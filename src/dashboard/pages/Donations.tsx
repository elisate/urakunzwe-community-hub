import { Plus, Search, Filter, Download, DollarSign, Calendar, User, MoreVertical, Eye, Trash2, CheckCircle2, Clock, AlertCircle, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/dashboard/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { ScrollArea } from "@/dashboard/ui/scroll-area";
import { toast } from "sonner";

interface Donation {
    id: string;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    amount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
}

export default function Donations() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    // Pagination logic
    const totalPages = Math.ceil(donations.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDonations = donations.slice(indexOfFirstItem, indexOfLastItem);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const response = await api.get("/donation/getDonations");
            setDonations(response.data);
            setError(null);
        } catch (error) {
            console.error("Failed to fetch donations:", error);
            setError("Failed to fetch donations");
            toast.error("Failed to load donations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const handleDelete = async (id: string) => {
        toast("Are you sure you want to delete this donation record?", {
            description: "This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await api.delete(`/donation/deleteDonation/${id}`);
                        fetchDonations();
                        toast.success("Donation record deleted");
                    } catch (error) {
                        console.error("Failed to delete donation:", error);
                        toast.error("Failed to delete donation");
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
        });
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/donation/updateDonationStatus/${id}`, { status: newStatus });
            fetchDonations();
            setIsStatusOpen(false);
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        }
    };

    const openView = (donation: Donation) => {
        setSelectedDonation(donation);
        setIsViewOpen(true);
    };

    const openStatusUpdate = (donation: Donation) => {
        setSelectedDonation(donation);
        setIsStatusOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Donations</h1>
                    <p className="mt-1 text-muted-foreground">
                        Track and manage incoming donations and donor information.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button className="gradient-primary border-0 text-primary-foreground">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Donation
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>A list of recent donations including details.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search donors..."
                                className="w-[200px] pl-9 sm:w-[300px]"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Donor</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead className="hidden md:table-cell">Method</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">Loading donations...</TableCell>
                                    </TableRow>
                                ) : donations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">No donations found.</TableCell>
                                    </TableRow>
                                ) : (
                                    currentDonations.map((donation) => (
                                        <TableRow key={donation.id}>
                                            <TableCell className="font-medium text-xs text-muted-foreground truncate max-w-[100px]">{donation.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{donation.donorName}</span>
                                                        <span className="text-[10px] text-muted-foreground">{donation.donorEmail}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(donation.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        donation.status.toLowerCase() === "completed"
                                                            ? "default"
                                                            : donation.status.toLowerCase() === "pending"
                                                                ? "secondary"
                                                                : "destructive"
                                                    }
                                                    className="uppercase"
                                                >
                                                    {donation.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span className="text-sm">
                                                        {new Date(donation.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{donation.paymentMethod}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => openView(donation)} className="cursor-pointer">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openStatusUpdate(donation)} className="cursor-pointer">
                                                            <Clock className="mr-2 h-4 w-4" />
                                                            Update Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(donation.id)}
                                                            className="text-destructive focus:text-destructive cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Record
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
                            Showing {donations.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, donations.length)} of {donations.length} entries
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

            {/* View Modal */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-lg p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">Donation Insights</DialogTitle>
                                <DialogDescription className="text-sm">Comprehensive view of this contribution</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <div className="p-8">
                            <div className="grid gap-8">
                                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 shadow-inner">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Amount Donated</p>
                                        <p className="text-3xl font-extrabold tracking-tight">{selectedDonation && new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedDonation.amount)}</p>
                                    </div>
                                    <Badge
                                        variant={
                                            selectedDonation?.status.toLowerCase() === "completed"
                                                ? "default"
                                                : selectedDonation?.status.toLowerCase() === "pending"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
                                    >
                                        {selectedDonation?.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Contributor</p>
                                        <p className="font-bold text-foreground flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            {selectedDonation?.donorName}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Payment Method</p>
                                        <p className="font-bold text-foreground flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-primary" />
                                            {selectedDonation?.paymentMethod}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Communication</p>
                                        <p className="text-sm font-medium text-foreground truncate">{selectedDonation?.donorEmail}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone Line</p>
                                        <p className="text-sm font-medium text-foreground">{selectedDonation?.donorPhone || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Timestamp</p>
                                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            {selectedDonation && new Date(selectedDonation.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Audit Trace</p>
                                        <p className="text-[10px] font-mono font-bold bg-muted/50 px-2 py-1 rounded border border-border/50 break-all">{selectedDonation?.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setIsViewOpen(false)}>Close Insights</Button>
                        <Button className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110" onClick={() => {
                            setIsViewOpen(false);
                            if (selectedDonation) openStatusUpdate(selectedDonation);
                        }}>
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Status Modal */}
            <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Donation Status</DialogTitle>
                        <DialogDescription>
                            Change the status for transaction: <span className="font-mono text-xs">{selectedDonation?.id}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Button
                            variant="outline"
                            className="justify-start gap-3 h-12"
                            onClick={() => selectedDonation && handleUpdateStatus(selectedDonation.id, "completed")}
                        >
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <div className="text-left">
                                <p className="text-sm font-semibold">Mark as Completed</p>
                                <p className="text-[10px] text-muted-foreground">Payment has been verified and received</p>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-start gap-3 h-12"
                            onClick={() => selectedDonation && handleUpdateStatus(selectedDonation.id, "pending")}
                        >
                            <Clock className="h-5 w-5 text-secondary-foreground" />
                            <div className="text-left">
                                <p className="text-sm font-semibold">Keep as Pending</p>
                                <p className="text-[10px] text-muted-foreground">Waiting for payment verification</p>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-start gap-3 h-12"
                            onClick={() => selectedDonation && handleUpdateStatus(selectedDonation.id, "failed")}
                        >
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <div className="text-left">
                                <p className="text-sm font-semibold">Mark as Failed</p>
                                <p className="text-[10px] text-muted-foreground">Payment was cancelled or rejected</p>
                            </div>
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsStatusOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
