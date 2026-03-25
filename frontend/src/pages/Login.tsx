import {useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {validateEmail, validatePassword} from "../utilities/validations";
import {LoaderCircle, Eye, EyeOff, CheckCircle, CircleX} from "lucide-react";
import {useI18n} from "../context/I18nContext";
import {authentication} from "../utilities/api";
import {useUser} from "../context/UserContext";
import PageHeader from "../components/PageHeader";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const emailValid = useMemo(() => validateEmail(email), [email]);
    const passwordValid = useMemo(() => validatePassword(password), [password]);

    const navigate = useNavigate();
    const {setUser} = useUser();
    const {translation} = useI18n();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await authentication.login(
            email,
            password,
            {navigate, setUser},
            {success: translation.authentication.loginSuccess, failed: translation.authentication.loginFailed}
        );
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <PageHeader />

            <div className="flex-1 flex items-center justify-center px-4 py-10 bg-(--bg-base)">
                {/*card*/}
                <div className="cyber-card w-full max-w-lg p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl text-(--text-accent) font-bold text-center mb-8">
                        {translation.authentication.loginTitle}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                        {emailValid ? (
                                            <CheckCircle size={18} className="text-(--text-correct)" />
                                        ) : (
                                            <CircleX size={18} className="text-(--text-wrong)" />
                                        )}
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-(--text-wrong) min-h-4">
                                {email && !emailValid ? translation.authentication.invalidEmail : ""}
                            </p>
                        </div>

                        {/*password*/}
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
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-(--text-wrong) min-h-4">
                                {password && !passwordValid ? translation.authentication.invalidPassword : ""}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !emailValid || !passwordValid}
                            className="cyber-btn w-full mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoaderCircle size={18} className="animate-spin" />
                                    {translation.authentication.loggingIn}
                                </span>
                            ) : (
                                translation.authentication.login
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-(--text-muted)">
                        {translation.authentication.noAccount}{" "}
                        <Link to="/signup" className="font-bold text-(--text-accent)">
                            {translation.authentication.signup}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
