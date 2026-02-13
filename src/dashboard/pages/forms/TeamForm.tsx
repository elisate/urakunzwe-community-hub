import { Button } from "@/dashboard/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/dashboard/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload, User, Mail, Phone, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function TeamForm() {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [socialsMedia, setSocialsMedia] = useState("");
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!name || !role || !profileFile) {
            toast({
                title: "Validation Error",
                description: "Name, Role and Profile Image are required.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("role", role);
        formData.append("description", description);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("socialsMedia", socialsMedia);
        formData.append("profile", profileFile);

        try {
            await api.post("/team/createMember", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast({ title: "Success", description: "Team member added successfully!" });
            navigate("/admin/team");
        } catch (error) {
            console.error("Creation failed", error);
            toast({ title: "Error", description: "Failed to add member.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin/team">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Add Team Member</h1>
                    <p className="text-muted-foreground">Add a new staff member or volunteer to the team.</p>
                </div>
            </div>

            <div className="grid gap-6 max-w-4xl">
                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Basic details about the team member.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role / Title</Label>
                                        <Input id="role" placeholder="Program Director" value={role} onChange={e => setRole(e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Short Bio</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Brief description of their role and background..."
                                        className="min-h-[100px]"
                                        value={description} onChange={e => setDescription(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contact & Socials</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="email" type="email" className="pl-9" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="phone" className="pl-9" placeholder="+123..." value={phone} onChange={e => setPhone(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="socials">Social Media Links</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="socials" className="pl-9" placeholder="LinkedIn, Twitter URL..." value={socialsMedia} onChange={e => setSocialsMedia(e.target.value)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                                <CardDescription>Upload a professional photo.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-muted mb-4 group">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                                <User className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={handleImageChange}
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Click image to upload</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Button className="w-full gradient-primary border-0 text-primary-foreground" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Member
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
