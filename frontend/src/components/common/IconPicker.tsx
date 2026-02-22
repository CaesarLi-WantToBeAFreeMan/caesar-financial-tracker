import {Box} from "lucide-react";
import {getFirstChar, isIconImage} from "../../utilities/icon";
import EmojiPickerPopup from "./EmojiPickerPopup";

interface Props {
    icon: string | null;
    name: string;
    onChange: (value: string) => void;
}

export default function IconPicker({icon, name, onChange}: Props) {
    return (
        <div className="flex items-center mt-1 gap-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-400/30">
                {icon ? (
                    isIconImage(icon) ? (
                        <img src={icon} alt={name} className="h-5 w-5 object-contain" />
                    ) : (
                        <span className="text-lg font-semibold leading-none">{getFirstChar(icon)}</span>
                    )
                ) : (
                    <Box size={23} />
                )}
            </div>
            <EmojiPickerPopup icon={icon!} onSelect={onChange} />
            <input
                placeholder="Emoji, text or URL"
                className="w-full rounded-lg bg-black/40 border border-cyan-400/20 p-1 text-cyan-100"
                value={icon!}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
