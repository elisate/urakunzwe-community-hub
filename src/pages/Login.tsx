import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/dashboard/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/dashboard/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Heart, Loader2 } from "lucide-react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const from = location.state?.from?.pathname || "/admin/dashboard";

    // 1. Initialize React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Handle Form Submission
    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setServerError("");

        try {
            const response = await api.post("/auth/login", data);
            const { token, user } = response.data;

            login(token, user);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error("Login error:", err);
            setServerError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                            <Heart className="h-5 w-5 text-white" fill="currentColor" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to access the admin dashboard.
                    </CardDescription>
                </CardHeader>

                {/* 3. Wrap in handleSubmit */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {/* Backend/Server Error Display */}
                        {serverError && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                                {serverError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                // 4. Register field with validation rules
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className={errors.email ? "border-destructive" : ""}
                            />
                            {/* 5. Display Validation Errors */}
                            {errors.email && (
                                <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                })}
                                className={errors.password ? "border-destructive" : ""}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button className="w-full gradient-primary" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}