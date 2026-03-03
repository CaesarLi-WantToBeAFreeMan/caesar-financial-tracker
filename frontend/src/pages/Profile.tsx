import {useContext, useEffect, useState} from "react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import {UserContext} from "../context/UserContext";
import {validatePassword} from "../utilities/validations";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import {LoaderCircle} from "lucide-react";
import {RenderIcon} from "../utilities/icon";
import {FilePicker} from "../components/common/FilePicker";
import {useNavigate} from "react-router-dom";

interface UserType {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profileImage: string | null;
}

export default function Profile() {
    useUser();

    const navigate = useNavigate();
    const context = useContext(UserContext);
    if (!context) return null;
    const {user} = context;

    const [profile, setProfile] = useState<UserType>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        profileImage: null
    });

    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                email: user.email ?? "",
                password: "",
                profileImage: user.profileImage ?? null
            });
        }
    }, [user]);

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const passwordValid = validatePassword(profile.password);
    const [file, setFile] = useState<File | null>(null);

    const updateProfile = async () => {
        setIsLoading(true);
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_PROFILE, {
                first_name: profile.firstName,
                last_name: profile.lastName,
                email: profile.email,
                password: profile.password,
                profile_image: profile.profileImage
            });
            toast.success("Changed successfully");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Changed failed");
        } finally {
            setIsLoading(false);
            navigate("/login");
        }
    };

    const handleUpload = async (file: File) => {
        setFile(file);
        if (!file) {
            setProfile(p => ({...p, profileImage: null}));
            return;
        }
        const content = await fileToBase64(file);
        setProfile(p => ({...p, profileImage: content}));
    };

    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    return (
        <Dashboard activeRoute="Profile">
            <div className="flex items-center justify-center">
                <h2 className="text-2xl font-semibold text-cyan-300">
                    Hello {user?.firstName} {user?.lastName}
                </h2>
            </div>
            <div className="bg-black/30 my-3 mx-1 p-5 rounded-xl border border-cyan-400/30 transition hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 m-3">
                    <div className="w-full flex items-center gap-3">
                        <label className="text-cyan-400 whitespace-nowrap">First Name:</label>
                        <input
                            value={profile.firstName}
                            placeholder="first name"
                            onChange={e => setProfile({...profile, firstName: e.target.value})}
                            className="text-cyan-200 font-medium w-full truncate rounded-lg border border-cayn-400/30 bg-black/40 px-3 py-1 transition hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                        />
                    </div>
                    <div className="w-full flex items-center gap-3">
                        <label className="text-cyan-400 whitespace-nowrap">Last Name:</label>
                        <input
                            value={profile.lastName}
                            placeholder="last name"
                            onChange={e => setProfile({...profile, lastName: e.target.value})}
                            className="text-cyan-200 font-medium w-full truncate rounded-lg border border-cayn-400/30 bg-black/40 px-3 py-1 transition hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                        />
                    </div>
                    <div className="w-full flex items-center gap-3">
                        <label className="text-cyan-400 whitespace-nowrap">Email:</label>
                        <input
                            value={profile.email}
                            placeholder="email"
                            disabled
                            className="text-cyan-200 font-medium w-full truncate rounded-lg border border-cayn-400/30 bg-black/40 px-3 py-1 transition hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-10"
                        />
                    </div>
                    <div className="w-full flex items-center gap-3">
                        <label className="text-cyan-400 whitespace-nowrap">Password:</label>
                        <div className="w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={profile.password}
                                placeholder="password"
                                onChange={e => setProfile({...profile, password: e.target.value})}
                                className="text-cyan-200 font-medium w-full truncate rounded-lg border border-cayn-400/30 bg-black/40 px-3 py-1 transition hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                            />
                            {profile.password && (
                                <span
                                    className={`absolute right-12 top-1/2 -translate-y-1/2 text-xl ${passwordValid ? "text-green-400" : "text-red-400"}`}
                                >
                                    {passwordValid ? "✓" : "✕"}
                                </span>
                            )}
                            <button
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                            >
                                {showPassword ? "🙉" : "🙈"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-3 space-y-3">
                    <label className="text-cyan-400 whitespace-nowrap">Profile Image:</label>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                        <RenderIcon
                            icon={profile.profileImage}
                            name="profile image"
                            imageSize="w-full rounded-xl"
                            boxSize={39}
                        />
                        <input
                            placeholder="profile image"
                            className="w-full rounded-lg bg-black/40 border border-cyan-400/20 p-1 text-cyan-100"
                            value={profile.profileImage!}
                            onChange={e => setProfile({...profile, profileImage: e.target.value})}
                        />
                        <FilePicker
                            file={file}
                            onChange={(file: File | null) => {
                                if (!file) return;
                                handleUpload(file);
                            }}
                            onClear={e => {
                                e.stopPropagation();
                                setFile(null);
                                setProfile(p => ({...p, profileImage: null}));
                            }}
                        />
                    </div>
                </div>

                <div className="mt-5 mb-3 flex items center justify-center">
                    <button
                        onClick={updateProfile}
                        disabled={isLoading || (!!profile.password && !passwordValid)}
                        className="px-10 py-3 rounded-full bg-cyan-400 text-black font-bold tracking-widest hover:bg-cyan-300 hover:shadow-[0_0_20px_#22d3ee] disabled:opacity-10 disabled:cursor-not-allowed transition hover:cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className="animate-spin w-5 h-5" />
                                Updating
                            </>
                        ) : (
                            "Update"
                        )}
                    </button>
                </div>
            </div>
        </Dashboard>
    );
}
