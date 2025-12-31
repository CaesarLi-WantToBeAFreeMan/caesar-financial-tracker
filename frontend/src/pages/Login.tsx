import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {validateEmail, validatePassword} from "../utilities/validations";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import {LoaderCircle} from "lucide-react";
import {UserContext} from "../context/UserContext";

interface LoginType {
    email: string;
    password: string;
}
export default function Login() {
    const [data, setData] = useState<LoginType>({email: "", password: ""});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const emailValid = validateEmail(data.email);
    const passwordValid = validatePassword(data.password);
    const navigate = useNavigate();
    const context = useContext(UserContext);
    if (!context) throw new Error("Login must be used within UserContextProvider");
    const {setUser} = context;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {email: data.email, password: data.password});
            toast.success("Login successfully");
            const {token, ...userData} = response.data;
            if (token && userData.id) {
                localStorage.setItem("token", token);
                setUser({
                    id: userData.id,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    email: userData.email,
                    profileImage: userData.profile_image || null,
                    createdAt: userData.created_at,
                    updatedAt: userData.updated_at
                });
                navigate("/dashboard");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070f34] px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl border border-cyan-400 rounded-[30px] p-10 bg-[#070f34] shadow-[0_0_40px_rgba(0,255,255,0.25)] text-cyan-300 p-12"
            >
                <h1 className="text-5xl font-bold text-center mb-8 text-cyan-300">Welcome Back</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-9">
                    <div>
                        <label className="text-white" htmlFor="email">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={e => setData({...data, email: e.target.value})}
                                placeholder="Email"
                                className="cyber-input pr-16"
                            />
                            {data.email && (
                                <span
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-xl ${emailValid ? "text-green-400" : "text-red-400"}`}
                                >
                                    {emailValid ? "✓" : "✕"}
                                </span>
                            )}
                        </div>
                        <p className="mt-1 min-h-[1.25rem] text-sm text-red-500">
                            {data.email && !emailValid ? "Invalid email format (e.g. text@example.com)" : ""}
                        </p>
                    </div>
                    <div>
                        <label className="text-white" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={data.password}
                                onChange={e => setData({...data, password: e.target.value})}
                                placeholder="Password"
                                className="cyber-input pr-24"
                            />
                            {data.password && (
                                <span
                                    className={`absolute right-12 top-1/2 -translate-y-1/2 text-xl ${
                                        passwordValid ? "text-green-400" : "text-red-400"
                                    }`}
                                >
                                    {passwordValid ? "✓" : "✕"}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                            >
                                {showPassword ? "🙉" : "🙈"}
                            </button>
                        </div>
                        <p className="mt-1 min-h-[1.25rem] text-sm text-red-500">
                            {data.password && !passwordValid
                                ? "At least 9 chars, 1 uppercase, 1 lowercase, 1 digit and 1 symbol"
                                : ""}
                        </p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isLoading || !emailValid || !passwordValid}
                        className="px-10 py-3 rounded-full bg-cyan-400 text-black font-bold tracking-widest hover:bg-cyan-300 hover:shadow-[0_0_20px_#22d3ee] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className="animate-spin w-5 h-5" />
                                Logging in
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </div>
                <br />
                <div className="flex justify-center">
                    <p className="text-white">
                        Don't have an account?
                        <Link className="font-bold text-cyan-400" to="/signup">
                            Signup
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
