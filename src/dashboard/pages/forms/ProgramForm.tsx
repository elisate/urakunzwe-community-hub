import { Button } from "@/dashboard/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/dashboard/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function ProgramForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !imageFile) {
            toast({
                title: "Validation Error",
                description: "Please fill all fields and upload an image.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("img", imageFile); // backend expects 'img'

        try {
            await api.post("/program/createProgram", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast({ title: "Success", description: "Program created successfully!" });
            navigate("/admin/program");
        } catch (error) {
            console.error("Creation failed", error);
            toast({ title: "Error", description: "Failed to create program.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin/program">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">New Program</h1>
                    <p className="text-muted-foreground">Create a new community program or initiative.</p>
                </div>
            </div>

            <div className="grid gap-6 max-w-4xl">
                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Program Details</CardTitle>
                                <CardDescription>
                                    Information about the program.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Program Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Youth Mentorship 2024"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the program goals and activities..."
                                        className="min-h-[150px]"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Program Image</CardTitle>
                                <CardDescription>Upload a cover image.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                    {previewUrl ? (
                                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                                            <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                                <Upload className="h-5 w-5 text-primary" />
                                            </div>
                                            <p className="text-sm font-medium text-center">Click to upload image</p>
                                            <p className="text-xs text-muted-foreground text-center mt-1">SVG, PNG, JPG or GIF</p>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Button className="w-full gradient-primary border-0 text-primary-foreground" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                "Creating..."
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Program
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
