import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {validateEmail, validatePassword} from "../utilities/validations";
import toast from "react-hot-toast";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import axiosConfig from "../utilities/axiosUtility";
import {LoaderCircle} from "lucide-react";

interface SignupType {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export default function Signup() {
    const [data, setData] = useState<SignupType>({email: "", firstName: "", lastName: "", password: ""});
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const emailValid = validateEmail(data.email);
    const passwordValid = validatePassword(data.password);
    const confirmPasswordValid = confirmPassword.length > 0 && data.password === confirmPassword;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password
            });
            if (response.status === 201) {
                toast.success("Account has been created successfully");
                navigate("/login");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Registration failed");
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
                <h1 className="text-5xl font-bold text-center mb-8 text-cyan-300">Register</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-9">
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
                        <label className="text-white" htmlFor="first-name">
                            First Name
                        </label>
                        <input
                            value={data.firstName}
                            id="first-name"
                            onChange={e => setData({...data, firstName: e.target.value})}
                            placeholder="First Name"
                            className="cyber-input"
                        />
                        <p className="mt-1 min-h-[1.25rem]" />
                    </div>
                    <div>
                        <label className="text-white" htmlFor="last-name">
                            Last Name
                        </label>
                        <input
                            value={data.lastName}
                            id="last-name"
                            onChange={e => setData({...data, lastName: e.target.value})}
                            placeholder="Last Name"
                            className="cyber-input"
                        />
                        <p className="mt-1 min-h-[1.25rem]" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-9">
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
                    <div>
                        <label className="text-white" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="cyber-input pr-24"
                            />

                            {confirmPassword && (
                                <span
                                    className={`absolute right-12 top-1/2 -translate-y-1/2 text-xl ${
                                        confirmPasswordValid ? "text-green-400" : "text-red-400"
                                    }`}
                                >
                                    {confirmPasswordValid ? "✓" : "✕"}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(p => !p)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                            >
                                {showConfirmPassword ? "🙉" : "🙈"}
                            </button>
                        </div>
                        <p className="mt-1 min-h-[1.25rem] text-sm text-red-500">
                            {confirmPassword && !confirmPasswordValid ? "Passwords do not match" : ""}
                        </p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={
                            isLoading ||
                            !emailValid ||
                            !data.firstName ||
                            !data.lastName ||
                            !passwordValid ||
                            !confirmPasswordValid
                        }
                        className="px-10 py-3 rounded-full bg-cyan-400 text-black font-bold tracking-widest hover:bg-cyan-300 hover:shadow-[0_0_20px_#22d3ee] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className="animate-spin w-5 h-5" />
                                Signing Up...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </div>
                <br />
                <div className="flex justify-center">
                    <p className="text-white">
                        Already have an account?
                        <Link className="font-bold text-cyan-400" to="/login">
                            Login
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
