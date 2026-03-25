import {Box, SearchX} from "lucide-react";
import {getFirstChar, isIconImage} from "../../utilities/icon";
import EmojiPickerPopup from "./EmojiPickerPopup";
import {useI18n} from "../../context/I18nContext";

interface Props {
    icon: string | null;
    name: string;
    onChange: (value: string) => void;
}

export default function IconPicker({icon, name, onChange}: Props) {
    const {translation} = useI18n();

    return (
        <div className="flex flex-col md:flex-row items-center mt-1 gap-3">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 p-2 flex items-center justify-center rounded-full bg-(--bg-card) border border-(--border)">
                    {icon ? (
                        isIconImage(icon) ? (
                            <img src={icon} alt={name} className="h-5 w-5 object-contain" />
                        ) : (
                            <span className="text-xl font-mono font-bold leading-none text-(--text-accent)">
                                {getFirstChar(icon)}
                            </span>
                        )
                    ) : (
                        <Box size={23} className="text-(--text-accent)" />
                    )}
                </div>
                <EmojiPickerPopup icon={icon!} onSelect={onChange} />
            </div>
            <div className="relative w-full md:flex-1">
                <input
                    placeholder={translation.common.iconPlaceholder}
                    className="w-full cyber-input py-3 pr-12"
                    value={icon!}
                    onChange={e => onChange(e.target.value)}
                />
                {icon! && (
                    <button
                        onClick={() => onChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-120 hover:text-(--text-wrong) active:scale-120 active:text-(--text-wrong) transition duration-300"
                    >
                        <SearchX size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
