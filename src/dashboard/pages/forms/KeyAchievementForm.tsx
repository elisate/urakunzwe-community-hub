import { Button } from "@/dashboard/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/dashboard/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Award } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function KeyAchievementForm() {
    const { id } = useParams();
    const isEditing = !!id;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditing);
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditing) {
            fetchAchievement();
        }
    }, [id]);

    const fetchAchievement = async () => {
        try {
            const response = await api.get(`/achievement/getAchievementById/${id}`);
            const data = response.data;
            setTitle(data.title || "");
            setDescription(data.description || "");
        } catch (error) {
            console.error("Failed to fetch achievement", error);
            toast.error("Failed to load achievement details");
            navigate("/admin/key-achievements");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        setIsSubmitting(true);
        const payload = { title, description };

        try {
            if (isEditing) {
                await api.put(`/achievement/updateAchievement/${id}`, payload);
                toast.success("Achievement updated successfully!");
            } else {
                await api.post("/achievement/createAchievement", payload);
                toast.success("Achievement created successfully!");
            }
            navigate("/admin/key-achievements");
        } catch (error) {
            console.error("Operation failed", error);
            toast.error(isEditing ? "Failed to update achievement" : "Failed to create achievement");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground animate-pulse">Loading achievement data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin/key-achievements">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{isEditing ? "Edit Achievement" : "New Achievement"}</h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Update the details of this achievement." : "Shout about a new milestone or impact."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Achievement Details</CardTitle>
                                <CardDescription>
                                    Define what was achieved and why it matters.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-0">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-semibold">Achievement Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. 1000+ Students Mentored"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold">Description / Impact</Label>
                            <Textarea
                                id="description"
                                placeholder="Details about this achievement and the impact it had on the community..."
                                className="min-h-[180px] leading-relaxed"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
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
                                        {isEditing ? "Update Achievement" : "Save Achievement"}
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 px-6"
                                asChild
                            >
                                <Link to="/admin/key-achievements">Cancel</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
