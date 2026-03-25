import {useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {validateEmail, validatePassword} from "../utilities/validations";
import {LoaderCircle, Eye, EyeOff, CheckCircle, CircleX} from "lucide-react";
import {useI18n} from "../context/I18nContext";
import {authentication} from "../utilities/api";
import PageHeader from "../components/PageHeader";

export default function Signup() {
    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const {translation} = useI18n();

    const emailValidate = useMemo(() => validateEmail(email), [email]);
    const passwordValid = useMemo(() => validatePassword(password), [password]);
    const confirmValid = useMemo(
        () => confirmPassword.length > 0 && password === confirmPassword,
        [password, confirmPassword]
    );
    const canSubmit = emailValidate && !!firstName && !!lastName && passwordValid && confirmValid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await authentication.register(
            firstName,
            lastName,
            email,
            password,
            {navigate},
            {success: translation.authentication.signupSuccess, failed: translation.authentication.signupFailed}
        );
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <PageHeader />

            <div className="flex-1 flex items-center justify-center px-4 py-10 bg-(--bg-base)">
                {/*card*/}
                <div className="cyber-card w-full max-w-xl p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl text-(--text-accent) font-bold text-center mb-8">
                        {translation.authentication.signupTitle}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/*names*/}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="cyber-label">{translation.authentication.firstName}</label>
                                <input
                                    value={firstName}
                                    placeholder={translation.authentication.firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="cyber-input"
                                />
                            </div>
                            <div>
                                <label className="cyber-label">{translation.authentication.lastName}</label>
                                <input
                                    value={lastName}
                                    placeholder={translation.authentication.lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="cyber-input"
                                />
                            </div>
                        </div>

                        {/*email*/}
                        <div>
                            <label className="cyber-label">{translation.authentication.email}</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    placeholder={translation.authentication.email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="cyber-input pr-10"
                                />
                                {email && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {emailValidate ? (
                                            <CheckCircle size={18} className="text-(--text-correct)" />
                                        ) : (
                                            <CircleX size={18} className="text-(--text-wrong)" />
                                        )}
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-(--text-wrong) min-h-4">
                                {email && !emailValidate ? translation.authentication.invalidEmail : ""}
                            </p>
                        </div>

                        {/*passwords*/}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="cyber-label">{translation.authentication.password}</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        placeholder={translation.authentication.password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="cyber-input pr-20"
                                    />
                                    {password && (
                                        <span className="absolute right-10 top-1/2 -translate-y-1/2">
                                            {passwordValid ? (
                                                <CheckCircle size={18} className="text-(--text-correct)" />
                                            ) : (
                                                <CircleX size={18} className="text-(--text-wrong)" />
                                            )}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-(--text-muted) transition duration-300 hover:scale-120 hover:text-(--text-accent) active:text-(--text-accent)"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={19} />}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-(--text-wrong) min-h-4">
                                    {password && !passwordValid ? translation.authentication.invalidPassword : ""}
                                </p>
                            </div>
                            <div>
                                <label className="cyber-label">{translation.authentication.confirmPassword}</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        placeholder={translation.authentication.confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="cyber-input pr-20"
                                    />
                                    {confirmPassword && (
                                        <span className="absolute right-10 top-1/2 -translate-y-1/2">
                                            {confirmValid ? (
                                                <CheckCircle size={18} className="text-(--text-correct)" />
                                            ) : (
                                                <CircleX size={18} className="text-(--text-wrong)" />
                                            )}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-(--text-muted) transition duration-300 hover:scale-120 hover:text-(--text-accent) active:text-(--text-accent)"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-(--text-wrong) min-h-4">
                                    {confirmPassword && !confirmValid
                                        ? translation.authentication.passwordMismatch
                                        : ""}
                                </p>
                            </div>
                        </div>

                        <button type="submit" disabled={loading || !canSubmit} className="cyber-btn w-full mt-1">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoaderCircle size={18} className="animate-spin" />
                                    {translation.authentication.signingUp}
                                </span>
                            ) : (
                                translation.authentication.signup
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-(--text-muted)">
                        {translation.authentication.hasAccount}{" "}
                        <Link to="/login" className="font-bold text-(--text-accent)">
                            {translation.authentication.login}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
