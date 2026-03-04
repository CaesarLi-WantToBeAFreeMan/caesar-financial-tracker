import {useCallback, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {validateEmail, validatePassword} from "../utilities/validations";
import axiosConfig from "../utilities/AxiosUtility";
import {API_ENDPOINTS} from "../utilities/apiEndpoint";
import toast from "react-hot-toast";
import {LoaderCircle, Eye, EyeOff, ChevronDown} from "lucide-react";
import {useI18n, LOCALE_OPTIONS, type Locale} from "../context/I18nContext";
import logo from "../assets/images/logo.png";

export default function Signup() {
    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");
    const [showPw, setShowPw] = useState<boolean>(false);
    const [showCf, setShowCf] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showLang, setShowLang] = useState<boolean>(false);

    const navigate = useNavigate();
    const {locale, setLocale, translation} = useI18n();
    const currentLocale = useMemo(() => LOCALE_OPTIONS.find(option => option.value === locale)!, [locale]);

    const emailValidate = useMemo(() => validateEmail(email), [email]);
    const passwordValid = useMemo(() => validatePassword(password), [password]);
    const confirmValid = useMemo(() => confirm.length > 0 && password === confirm, [password, confirm]);
    const canSubmit = emailValidate && !!firstName && !!lastName && passwordValid && confirmValid;

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            try {
                const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password
                });
                if (response.status === 201) {
                    toast.success(translation.auth.signupSuccess);
                    navigate("/login");
                }
            } catch (e: any) {
                toast.error(e?.response?.data?.message || translation.auth.signupFailed);
            } finally {
                setLoading(false);
            }
        },
        [email, firstName, lastName, password, navigate, translation]
    );

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
            style={{background: "var(--bg-base)"}}
        >
            {/*top bar*/}
            <div className="w-full max-w-2xl flex items-center justify-between mb-8">
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

                <div className="relative">
                    <button
                        onClick={() => setShowLang(p => !p)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            color: "var(--text-accent)"
                        }}
                    >
                        <span>{currentLocale.flag}</span>
                        <span className="hidden sm:block">{currentLocale.label}</span>
                        <ChevronDown size={13} className={`transition-transform ${showLang ? "rotate-180" : ""}`} />
                    </button>
                    {showLang && (
                        <div
                            className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-xl z-50"
                            style={{background: "var(--bg-surface)", border: "1px solid var(--border)"}}
                        >
                            {LOCALE_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setLocale(opt.value as Locale);
                                        setShowLang(false);
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
            <div className="cyber-card w-full max-w-2xl p-8 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{color: "var(--text-accent)"}}>
                    {translation.auth.signupTitle}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/*names*/}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="cyber-label">{translation.auth.firstName}</label>
                            <input
                                value={firstName}
                                placeholder={translation.auth.firstName}
                                onChange={e => setFirstName(e.target.value)}
                                className="cyber-input"
                            />
                        </div>
                        <div>
                            <label className="cyber-label">{translation.auth.lastName}</label>
                            <input
                                value={lastName}
                                placeholder={translation.auth.lastName}
                                onChange={e => setLastName(e.target.value)}
                                className="cyber-input"
                            />
                        </div>
                    </div>

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
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${emailValidate ? "text-green-400" : "text-red-400"}`}
                                >
                                    {emailValidate ? "✓" : "✕"}
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-red-400 min-h-[1rem]">
                            {email && !emailValidate ? translation.auth.invalidEmail : ""}
                        </p>
                    </div>

                    {/*passwords*/}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <div>
                            <label className="cyber-label">{translation.auth.confirmPassword}</label>
                            <div className="relative">
                                <input
                                    type={showCf ? "text" : "password"}
                                    value={confirm}
                                    placeholder={translation.auth.confirmPassword}
                                    onChange={e => setConfirm(e.target.value)}
                                    className="cyber-input pr-20"
                                />
                                {confirm && (
                                    <span
                                        className={`absolute right-10 top-1/2 -translate-y-1/2 text-lg ${confirmValid ? "text-green-400" : "text-red-400"}`}
                                    >
                                        {confirmValid ? "✓" : "✕"}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowCf(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    style={{color: "var(--text-muted)"}}
                                >
                                    {showCf ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-red-400 min-h-[1rem]">
                                {confirm && !confirmValid ? translation.auth.passwordMismatch : ""}
                            </p>
                        </div>
                    </div>

                    <button type="submit" disabled={loading || !canSubmit} className="cyber-btn w-full mt-1">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoaderCircle size={17} className="animate-spin" />
                                {translation.auth.signingUp}
                            </span>
                        ) : (
                            translation.auth.signup
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm" style={{color: "var(--text-muted)"}}>
                    {translation.auth.hasAccount}{" "}
                    <Link to="/login" className="font-bold" style={{color: "var(--text-accent)"}}>
                        {translation.auth.login}
                    </Link>
                </p>
            </div>
        </div>
    );
}
