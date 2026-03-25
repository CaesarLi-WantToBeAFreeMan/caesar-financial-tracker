import {useCallback, useEffect, useMemo, useState} from "react";
import Dashboard from "../components/Dashboard";
import {useUser} from "../context/UserContext";
import {useI18n} from "../context/I18nContext";
import {validatePassword} from "../utilities/validations";
import {LoaderCircle, Eye, EyeOff, User} from "lucide-react";
import {FilePicker} from "../components/common/FilePicker";
import {profileApi} from "../utilities/api";

export default function Profile() {
    const {user, setUser} = useUser();
    const {translation} = useI18n();

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
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
        if (!user) return;
        setIsLoading(true);
        await profileApi.update({...user, firstName, lastName, email, profileImage}, password, setUser, {
            success: translation.profile.updateSuccess,
            failed: translation.profile.updateFailed
        });
        setPassword("");
        setIsLoading(false);
    }, [user, firstName, lastName, email, password, profileImage, setUser, translation]);

    const inputStyle =
        "bg-(--bg-input) border border-(--border) rounded-xl text-(--text-primart) p-3 w-full transtion duration-300 focus:border(--border-glow) focus:shadow-(--glow-cyan) disabled:opacity-30 disabled:cursor-not-allowed";

    return (
        <Dashboard activeRoute={translation.navigation.profile}>
            {/*greeting*/}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center border-2 border-(--border-glow)">
                    {profileImage ? (
                        <img src={profileImage} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User size={26} className="text-(--text-accent)" />
                    )}
                </div>
                <h2 className="text-2xl font-bold text-(--text-accent)">
                    {translation.profile.hello}, {user?.firstName} {user?.lastName}
                </h2>
            </div>

            <div className="cyber-card p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/*first name*/}
                    <div>
                        <label className="cyber-label">{translation.profile.firstName}</label>
                        <input
                            value={firstName}
                            placeholder={translation.profile.firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className={`${inputStyle}`}
                        />
                    </div>
                    {/*last name*/}
                    <div>
                        <label className="cyber-label">{translation.profile.lastName}</label>
                        <input
                            value={lastName}
                            placeholder={translation.profile.lastName}
                            onChange={e => setLastName(e.target.value)}
                            className={`${inputStyle}`}
                        />
                    </div>
                    {/*email*/}
                    <div>
                        <label className="cyber-label">{translation.profile.email}</label>
                        <input value={email} disabled className={`${inputStyle}`} />
                    </div>
                    {/*password*/}
                    <div>
                        <label className="cyber-label">{translation.profile.password}</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                placeholder={translation.profile.leavePasswordBlank}
                                onChange={e => setPassword(e.target.value)}
                                className={`${inputStyle}`}
                            />
                            {password && (
                                <span
                                    className={`absolute right-10 top-1/2 -translate-y-1/2 text-base ${passwordValid ? "text-(--text-correct)" : "text-(--text-wrong)"}`}
                                >
                                    {passwordValid ? "✓" : "✕"}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-(--text-primary) transition duration-300 hover:text-(--text-accent) active:text-(--text-accent)"
                            >
                                {showPassword ? (
                                    <EyeOff size={16} className="hover:scale-120 active:scale-120" />
                                ) : (
                                    <Eye size={16} className="hover:scale-120 active:scale-120" />
                                )}
                            </button>
                        </div>
                        {!password ? (
                            <p className="mt-1 text-xs min-h-4 text-(--text-warning)">
                                {translation.profile.leavePasswordBlank}
                            </p>
                        ) : !passwordValid ? (
                            <p className="mt-1 text-xs min-h-4 text-(--text-wrong)">
                                {translation.authentication.invalidPassword}
                            </p>
                        ) : (
                            <p className="mt-1 min-h-4" />
                        )}
                    </div>
                </div>

                {/*profile image*/}
                <div className="mt-5">
                    <label className="cyber-label">{translation.profile.profileImage}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 items-center">
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center border border-(--border)">
                            {profileImage ? (
                                <img src={profileImage} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <User size={36} className="text-(--text-muted)" />
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
                            onChange={(file: File | null) => {
                                if (file) handleUpload(file);
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
                                {translation.profile.updating}
                            </span>
                        ) : (
                            translation.profile.update
                        )}
                    </button>
                </div>
            </div>
        </Dashboard>
    );
}
