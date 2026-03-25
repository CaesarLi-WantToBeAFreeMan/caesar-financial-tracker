/*
 * advertisement banner placeholder
 * replace the inner content with a real Google AdSense script when ready
 */
import {useI18n} from "../context/I18nContext";

export default function AdBanner() {
    const {translation} = useI18n();
    return (
        <div className="flex items-center justify-center min-h-15 w-full mt-6 py-2 px-3 rounded-xl text-center font-mono cyber-card text-(--text-muted)">
            {translation.common.adArea}
        </div>
    );
}
