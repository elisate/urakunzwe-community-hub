import { Button } from "@/dashboard/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/dashboard/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function NewsForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));

            setImageFiles([...imageFiles, ...newFiles]);
            setPreviewUrls([...previewUrls, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setPreviewUrls(previewUrls.filter((_, i) => i !== index));
        setImageFiles(imageFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title || !content || !category) {
            toast({
                title: "Validation Error",
                description: "Title, Content and Category are required.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", category);

        // Append multiple images with the same key 'images' as expected by upload.array('images', 10)
        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

        try {
            await api.post("/news/createNews", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast({ title: "Success", description: "News published successfully!" });
            navigate("/admin/news");
        } catch (error) {
            console.error("Publishing failed", error);
            toast({ title: "Error", description: "Failed to publish news.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin/news">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Post News</h1>
                    <p className="text-muted-foreground">Create a new update or article.</p>
                </div>
            </div>

            <div className="grid gap-6 max-w-4xl">
                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Article Content</CardTitle>
                                <CardDescription>
                                    The main content of your news post.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Annual Community Gathering Success"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Write your article content here..."
                                        className="min-h-[300px]"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publishing Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="community">Community</SelectItem>
                                            <SelectItem value="events">Events</SelectItem>
                                            <SelectItem value="fundraising">Fundraising</SelectItem>
                                            <SelectItem value="updates">Updates</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="pt-4">
                                    <Button className="w-full gradient-primary border-0 text-primary-foreground" onClick={handleSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            "Publishing..."
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Publish Post
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Images</CardTitle>
                                <CardDescription>Upload images for the gallery.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {previewUrls.map((img, i) => (
                                        <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                                            <img src={img} alt="Upload" className="object-cover w-full h-full" />
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className="flex flex-col items-center justify-center aspect-square rounded-md border border-dashed hover:bg-muted/50 transition-colors"
                                    >
                                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                        <span className="text-xs text-muted-foreground">Add Image</span>
                                    </button>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
