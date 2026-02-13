import { Button } from "@/dashboard/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/dashboard/ui/card";
import { Input } from "@/dashboard/ui/input";
import { Label } from "@/dashboard/ui/label";
import { Textarea } from "@/dashboard/ui/textarea";
import { ArrowLeft, Save, Heart, X, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ImpactForm() {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        actions_keypoints: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchImpact();
        }
    }, [id]);

    const fetchImpact = async () => {
        try {
            const response = await api.get('/impact/getAll');
            const list = Array.isArray(response.data) ? response.data : [];
            const impact = list.find((item: any) => item.id === id);

            if (impact) {
                setFormData({
                    title: impact.title || "",
                    description: impact.description || "",
                    actions_keypoints: Array.isArray(impact.actions_keypoints)
                        ? impact.actions_keypoints.join(", ")
                        : (typeof impact.actions_keypoints === 'string' ? impact.actions_keypoints : "")
                });
                setPreviewUrl(impact.img);
            } else {
                toast.error("Impact not found");
                navigate("/admin/impact");
            }
        } catch (error) {
            console.error("Failed to fetch impact", error);
            toast.error("Failed to load impact details");
            navigate("/admin/impact");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        setIsSubmitting(true);
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);

        // Handle actions_keypoints as individuals
        const keypoints = formData.actions_keypoints.split(',')
            .map(kp => kp.trim())
            .filter(kp => kp !== "");

        keypoints.forEach(kp => {
            data.append("actions_keypoints", kp);
        });

        if (imageFile) {
            data.append("img", imageFile);
        }

        try {
            if (isEditing) {
                await api.put(`/impact/update/${id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Impact updated successfully!");
            } else {
                await api.post("/impact/createImpact", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Impact created successfully!");
            }
            navigate("/admin/impact");
        } catch (error) {
            console.error("Operation failed", error);
            toast.error(isEditing ? "Failed to update impact" : "Failed to create impact");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground animate-pulse">Loading impact data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin/impact">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{isEditing ? "Edit Impact" : "New Impact"}</h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Update the details of this impact highlight." : "Add a new milestone highlight for the community."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                <Heart className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Impact Details</CardTitle>
                                <CardDescription>
                                    Define the success story and its key points.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-semibold">Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Clean Water Transforms Village"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Details about this impact story..."
                                className="min-h-[150px] leading-relaxed"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keypoints" className="text-sm font-semibold">Key Points (comma separated)</Label>
                            <Input
                                id="keypoints"
                                placeholder="Point 1, Point 2, Point 3"
                                value={formData.actions_keypoints}
                                onChange={(e) => setFormData({ ...formData, actions_keypoints: e.target.value })}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="img" className="text-sm font-semibold">Cover Image</Label>
                            <div className="flex flex-col items-center gap-4">
                                {previewUrl && (
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6"
                                            onClick={() => { setImageFile(null); setPreviewUrl(null); }}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                                <div className="w-full">
                                    <Input
                                        id="img"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1 gradient-primary border-0 text-primary-foreground h-11"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isEditing ? "Update Impact" : "Save Impact"}
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 px-6"
                                asChild
                            >
                                <Link to="/admin/impact">Cancel</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
