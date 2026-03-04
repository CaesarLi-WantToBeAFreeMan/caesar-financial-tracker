import {useCallback, useContext, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {validateEmail, validatePassword} from "../utilities/validations";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import {LoaderCircle, Eye, EyeOff, ChevronDown} from "lucide-react";
import {UserContext} from "../context/UserContext";
import {useI18n, LOCALE_OPTIONS, type Locale} from "../context/I18nContext";
import logo from "../assets/images/logo.png";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPw, setShowPw] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

    const navigate = useNavigate();
    const context = useContext(UserContext);
    if (!context) throw new Error("Login must be used within UserContextProvider");
    const {setUser} = context;

    const {locale, setLocale, translation} = useI18n();
    const currentLocale = useMemo(() => LOCALE_OPTIONS.find(option => option.value === locale)!, [locale]);

    const emailValid = useMemo(() => validateEmail(email), [email]);
    const passwordValid = useMemo(() => validatePassword(password), [password]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            try {
                const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {email, password});
                toast.success(translation.auth.loginSuccess);
                const {token, ...userData} = response.data;
                if (token && userData.id) {
                    localStorage.setItem("token", token);
                    setUser({
                        id: userData.id,
                        firstName: userData.first_name,
                        lastName: userData.last_name,
                        email: userData.email,
                        profileImage: userData.profile_image || null
                    });
                    navigate("/profile");
                }
            } catch (e: any) {
                toast.error(e?.response?.data?.message || translation.auth.loginFailed);
            } finally {
                setLoading(false);
            }
        },
        [email, password, navigate, setUser, translation]
    );

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
            style={{background: "var(--bg-base)"}}
        >
            {/*top bar*/}
            <div className="w-full max-w-lg flex items-center justify-between mb-8">
                <Link to="/home" className="flex items-center gap-2 group">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-10 w-10 rounded-xl group-hover:scale-110 transition"
                        style={{border: "1px solid var(--border)"}}
                    />
                    <span className="font-mono font-bold text-sm hidden sm:block" style={{color: "var(--text-accent)"}}>
                        {translation.nav.appShort}
                    </span>
                </Link>

                {/*language picker*/}
                <div className="relative">
                    <button
                        onClick={() => setShowLangMenu(p => !p)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            color: "var(--text-accent)"
                        }}
                    >
                        <span>{currentLocale.flag}</span>
                        <span className="hidden sm:block">{currentLocale.label}</span>
                        <ChevronDown size={13} className={`transition-transform ${showLangMenu ? "rotate-180" : ""}`} />
                    </button>
                    {showLangMenu && (
                        <div
                            className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-xl z-50"
                            style={{background: "var(--bg-surface)", border: "1px solid var(--border)"}}
                        >
                            {LOCALE_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setLocale(opt.value as Locale);
                                        setShowLangMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition"
                                    style={{
                                        color: locale === opt.value ? "var(--text-accent)" : "var(--text-dim)",
                                        background: locale === opt.value ? "var(--bg-hover)" : "transparent"
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                                    onMouseLeave={e =>
                                        (e.currentTarget.style.background =
                                            locale === opt.value ? "var(--bg-hover)" : "transparent")
                                    }
                                >
                                    <span>{opt.flag}</span>
                                    <span>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/*card*/}
            <div className="cyber-card w-full max-w-lg p-8 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{color: "var(--text-accent)"}}>
                    {translation.auth.loginTitle}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/*email*/}
                    <div>
                        <label className="cyber-label">{translation.auth.email}</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                placeholder={translation.auth.email}
                                onChange={e => setEmail(e.target.value)}
                                className="cyber-input pr-10"
                            />
                            {email && (
                                <span
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${emailValid ? "text-green-400" : "text-red-400"}`}
                                >
                                    {emailValid ? "✓" : "✕"}
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-red-400 min-h-[1rem]">
                            {email && !emailValid ? translation.auth.invalidEmail : ""}
                        </p>
                    </div>

                    {/*password*/}
                    <div>
                        <label className="cyber-label">{translation.auth.password}</label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                value={password}
                                placeholder={translation.auth.password}
                                onChange={e => setPassword(e.target.value)}
                                className="cyber-input pr-20"
                            />
                            {password && (
                                <span
                                    className={`absolute right-10 top-1/2 -translate-y-1/2 text-lg ${passwordValid ? "text-green-400" : "text-red-400"}`}
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
                                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-red-400 min-h-[1rem]">
                            {password && !passwordValid ? translation.auth.invalidPassword : ""}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !emailValid || !passwordValid}
                        className="cyber-btn w-full mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoaderCircle size={17} className="animate-spin" />
                                {translation.auth.loggingIn}
                            </span>
                        ) : (
                            translation.auth.login
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm" style={{color: "var(--text-muted)"}}>
                    {translation.auth.noAccount}{" "}
                    <Link to="/signup" className="font-bold" style={{color: "var(--text-accent)"}}>
                        {translation.auth.signup}
                    </Link>
                </p>
            </div>
        </div>
    );
}
