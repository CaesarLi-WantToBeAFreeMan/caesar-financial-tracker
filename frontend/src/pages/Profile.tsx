import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../hooks/useUser";
import {UserContext} from "../context/UserContext";
import {useI18n} from "../context/I18nContext";
import {validatePassword} from "../utilities/validations";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import {LoaderCircle, Eye, EyeOff, User} from "lucide-react";
import {FilePicker} from "../components/common/FilePicker";

export default function Profile() {
    useUser();

    const context = useContext(UserContext);
    if (!context) return null;
    const {user, setUser} = context;
    const {translation: t} = useI18n();

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showPw, setShowPw] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName ?? "");
            setLastName(user.lastName ?? "");
            setEmail(user.email ?? "");
            setProfileImage(user.profileImage ?? null);
            setPassword("");
        }
    }, [user]);

    const passwordValid = useMemo(() => validatePassword(password), [password]);

    const fileToBase64 = useCallback(
        (file: File): Promise<string> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
            }),
        []
    );

    const handleUpload = useCallback(
        async (file: File) => {
            setFile(file);
            const content = await fileToBase64(file);
            setProfileImage(content);
        },
        [fileToBase64]
    );

    const updateProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_PROFILE, {
                first_name: firstName,
                last_name: lastName,
                email,
                password: password || undefined,
                profile_image: profileImage
            });
            toast.success(t.profile.updateSuccess);
            setUser(prev => (prev ? {...prev, firstName, lastName, email, profileImage: profileImage ?? null} : prev));
            setPassword("");
        } catch (e: any) {
            toast.error(e?.response?.data?.message || t.profile.updateFailed);
        } finally {
            setIsLoading(false);
        }
    }, [firstName, lastName, email, password, profileImage, setUser, t]);

    const inputStyle = {
        background: "var(--input-bg)",
        border: "1px solid var(--border)",
        borderRadius: "0.5rem",
        color: "var(--text-primary)",
        padding: "6px 12px",
        width: "100%",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s"
    };

    return (
        <Dashboard activeRoute={t.nav.profile}>
            {/*greeting*/}
            <div className="flex items-center gap-4 mb-6">
                <div
                    className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center"
                    style={{border: "2px solid var(--border-glow)"}}
                >
                    {profileImage ? (
                        <img src={profileImage} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User size={26} style={{color: "var(--text-accent)"}} />
                    )}
                </div>
                <h2 className="text-2xl font-bold" style={{color: "var(--text-accent)"}}>
                    {t.profile.hello}, {user?.firstName} {user?.lastName}
                </h2>
            </div>

            <div className="cyber-card p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/*first name*/}
                    <div>
                        <label className="cyber-label">{t.profile.firstName}</label>
                        <input
                            value={firstName}
                            placeholder={t.profile.firstName}
                            onChange={e => setFirstName(e.target.value)}
                            style={inputStyle}
                            onFocus={e => {
                                e.currentTarget.style.borderColor = "var(--border-glow)";
                                e.currentTarget.style.boxShadow = "var(--glow-cyan)";
                            }}
                            onBlur={e => {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        />
                    </div>
                    {/*last name*/}
                    <div>
                        <label className="cyber-label">{t.profile.lastName}</label>
                        <input
                            value={lastName}
                            placeholder={t.profile.lastName}
                            onChange={e => setLastName(e.target.value)}
                            style={inputStyle}
                            onFocus={e => {
                                e.currentTarget.style.borderColor = "var(--border-glow)";
                                e.currentTarget.style.boxShadow = "var(--glow-cyan)";
                            }}
                            onBlur={e => {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        />
                    </div>
                    {/*email*/}
                    <div>
                        <label className="cyber-label">{t.profile.email}</label>
                        <input value={email} disabled style={{...inputStyle, opacity: 0.5, cursor: "not-allowed"}} />
                    </div>
                    {/*password*/}
                    <div>
                        <label className="cyber-label">{t.profile.password}</label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                value={password}
                                placeholder={t.profile.leavePasswordBlank}
                                onChange={e => setPassword(e.target.value)}
                                style={{...inputStyle, paddingRight: "5rem"}}
                                onFocus={e => {
                                    e.currentTarget.style.borderColor = "var(--border-glow)";
                                    e.currentTarget.style.boxShadow = "var(--glow-cyan)";
                                }}
                                onBlur={e => {
                                    e.currentTarget.style.borderColor = "var(--border)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            />
                            {password && (
                                <span
                                    className={`absolute right-10 top-1/2 -translate-y-1/2 text-base ${passwordValid ? "text-green-400" : "text-red-400"}`}
                                >
                                    {passwordValid ? "✓" : "✕"}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPw(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                style={{color: "var(--text-muted)"}}
                            >
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs min-h-[1rem]" style={{color: "var(--text-muted)"}}>
                            {t.profile.leavePasswordBlank}
                        </p>
                    </div>
                </div>

                {/*profile image*/}
                <div className="mt-5">
                    <label className="cyber-label">{t.profile.profileImage}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 items-center">
                        <div
                            className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center"
                            style={{border: "1px solid var(--border)"}}
                        >
                            {profileImage ? (
                                <img src={profileImage} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <User size={36} style={{color: "var(--text-muted)"}} />
                            )}
                        </div>
                        <input
                            value={profileImage ?? ""}
                            placeholder="URL or base64"
                            onChange={e => setProfileImage(e.target.value || null)}
                            className="cyber-input col-span-1"
                        />
                        <FilePicker
                            file={file}
                            onChange={f => {
                                if (f) handleUpload(f);
                            }}
                            onClear={e => {
                                e.stopPropagation();
                                setFile(null);
                                setProfileImage(null);
                            }}
                        />
                    </div>
                </div>

                {/*save button*/}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={updateProfile}
                        disabled={isLoading || (!!password && !passwordValid)}
                        className="cyber-btn px-10"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <LoaderCircle size={16} className="animate-spin" />
                                {t.profile.updating}
                            </span>
                        ) : (
                            t.profile.update
                        )}
                    </button>
                </div>
            </div>
        </Dashboard>
    );
}
