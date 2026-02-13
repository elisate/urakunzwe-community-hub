import { User, Bell, Shield, Key, Plus, Trash2, Edit, MoreVertical, Power, Mail, Calendar, MessageSquare, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/dashboard/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/dashboard/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/dashboard/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface UserType {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "USER";
    avatar?: string;
    isActive?: boolean;
}

export default function Settings() {
    const { user: currentUser, login } = useAuth();
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { toast } = useToast();

    // Profile Form State
    const [profileFirstName, setProfileFirstName] = useState(currentUser?.firstName || "");
    const [profileLastName, setProfileLastName] = useState(currentUser?.lastName || "");
    const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // New User Form State
    const [newUserOpen, setNewUserOpen] = useState(false);
    const [newFirst, setNewFirst] = useState("");
    const [newLast, setNewLast] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState("USER");
    const [newPassword, setNewPassword] = useState("");
    const [isAddingUser, setIsAddingUser] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Update profile inputs when currentUser changes
    useEffect(() => {
        if (currentUser) {
            setProfileFirstName(currentUser.firstName);
            setProfileLastName(currentUser.lastName);
            setProfileEmail(currentUser.email);
        }
    }, [currentUser]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/users');
            setUsers(Array.isArray(response.data) ? response.data : response.data.users || []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateProfile = async () => {
        setIsUpdatingProfile(true);
        try {
            const formData = new FormData();
            if (currentUser?.id) {
                formData.append("id", currentUser.id);
            }
            formData.append("firstName", profileFirstName);
            formData.append("lastName", profileLastName);
            formData.append("email", profileEmail);
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const response = await api.put('/auth/update-profile/', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Update context with new user data
            // Assuming response returns updated user object
            // We need key to keep session valid if token isn't rotated, otherwise might need relogin
            // Here we just update the user object in context if the API returns it
            const updatedUser = response.data.user || response.data;

            // Preserving the token from localStorage since we don't have it here explicitly unless we get it from context
            const currentToken = localStorage.getItem("token");
            if (currentToken) login(currentToken, updatedUser);

            toast({ title: "Success", description: "Profile updated successfully." });
        } catch (error) {
            console.error("Profile update failed", error);
            toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        } finally {
            setIsUpdatingProfile(false);
        }
    }

    const handleAddUser = async () => {
        setIsAddingUser(true);
        try {
            await api.post('/auth/register', {
                firstName: newFirst,
                lastName: newLast,
                email: newEmail,
                password: newPassword,
                role: newRole
            });
            toast({ title: "Success", description: "User created successfully." });
            setNewUserOpen(false);
            fetchUsers();
            // Reset form
            setNewFirst(""); setNewLast(""); setNewEmail(""); setNewPassword("");
        } catch (error) {
            console.error("Add user failed", error);
            toast({ title: "Error", description: "Failed to create user.", variant: "destructive" });
        } finally {
            setIsAddingUser(false);
        }
    }

    const handleToggleStatus = async (id: string) => {
        try {
            await api.patch(`/auth/users/status/${id}`);
            toast({ title: "Success", description: "User status updated." });
            fetchUsers();
        } catch (error) {
            console.error("Toggle status failed", error);
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    }

    const getInitials = (first: string, last: string) => {
        return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
    }

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Settings</h1>
                <p className="mt-1 text-muted-foreground">
                    Manage your account and organization users.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="space-y-6">
                    <div className="space-y-6">
                        {/* Profile Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <CardTitle>Profile Information</CardTitle>
                                </div>
                                <CardDescription>Update your personal details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" value={profileFirstName} onChange={e => setProfileFirstName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" value={profileLastName} onChange={e => setProfileLastName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="avatar">Profile Picture</Label>
                                        <Input id="avatar" type="file" onChange={e => setAvatarFile(e.target.files?.[0] || null)} />
                                    </div>
                                </div>
                                <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="gradient-primary border-0 text-primary-foreground">
                                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Notifications Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-primary" />
                                    <CardTitle>Notifications</CardTitle>
                                </div>
                                <CardDescription>Configure how you receive alerts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive emails about new donations.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* USERS TAB */}
                <TabsContent value="users" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium">Team Members</h3>
                            <p className="text-sm text-muted-foreground">Manage who has access to the dashboard.</p>
                        </div>

                        <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
                            <DialogTrigger asChild>
                                <Button className="gradient-primary border-0 text-primary-foreground">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl">
                                <DialogHeader className="p-8 pb-6 bg-muted/20 border-b border-muted">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-2xl font-bold">Add Team Member</DialogTitle>
                                            <DialogDescription className="text-sm">Provision a new account for your organization.</DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="flex-1 min-h-0 overflow-y-auto">
                                    <div className="p-8">
                                        <div className="grid gap-8">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-first" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">First Name</Label>
                                                    <Input id="new-first" value={newFirst} onChange={e => setNewFirst(e.target.value)} placeholder="Jane" className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-last" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Last Name</Label>
                                                    <Input id="new-last" value={newLast} onChange={e => setNewLast(e.target.value)} placeholder="Doe" className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Email Address</Label>
                                                <Input id="new-email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="jane.doe@example.com" className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-role" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Access Level</Label>
                                                <Select onValueChange={setNewRole} defaultValue="USER">
                                                    <SelectTrigger className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="USER">Standard User</SelectItem>
                                                        <SelectItem value="ADMIN">Administrator</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Initial Password</Label>
                                                <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-all shadow-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="p-8 pt-4 border-t bg-muted/20 flex flex-col sm:flex-row gap-3">
                                    <Button variant="outline" className="h-11 px-6 bg-background border-muted-foreground/20 shadow-none hover:bg-muted" onClick={() => setNewUserOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddUser} disabled={isAddingUser} className="h-11 px-8 shadow-lg shadow-primary/20 brightness-110">
                                        {isAddingUser ? "Processing..." : "Create Account"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <div className="rounded-md border overflow-hidden overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="text-right">Active</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow><TableCell colSpan={5} className="text-center py-8">Loading users...</TableCell></TableRow>
                                        ) : users.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="text-center py-8">No users found.</TableCell></TableRow>
                                        ) : (
                                            currentItems.map((u) => (
                                                <TableRow key={u.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9">
                                                                <AvatarImage src={u.avatar || ""} />
                                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{getInitials(u.firstName, u.lastName)}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium text-sm">{u.firstName} {u.lastName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px]">
                                                            {u.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Switch
                                                            checked={u.isActive !== false} // Assuming default true if undefined
                                                            onCheckedChange={() => handleToggleStatus(u.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-muted/50 pt-6 px-1">
                                <span className="text-sm text-muted-foreground">
                                    Showing {users.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, users.length)} of {users.length} entries
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
                </TabsContent>
            </Tabs>
        </div>
    );
}
