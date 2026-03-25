import EmojiPicker, {Theme} from "emoji-picker-react";
import {CircleX} from "lucide-react";
import {useState} from "react";
import {useI18n} from "../../context/I18nContext";
import enData from "emoji-picker-react/dist/data/emojis-en";
import zhData from "emoji-picker-react/dist/data/emojis-zh";

interface Props {
    icon: string;
    onSelect: (icon: string) => void;
}

export default function EmojiPickerPopup({onSelect}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const {locale} = useI18n();

    return (
        <div className="flex items-start gap-4">
            <button onClick={() => setIsOpen(true)} className="cyber-btn-ghost">
                Emoji
            </button>

            {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 z-10">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-3 top-2 z-50 text-(--text-wrong) hover:text-(--text-accent) cursor-pointer hover:scale-120 active:scale-120 transition duration-300"
                    >
                        <CircleX size={18} />
                    </button>

                    <EmojiPicker
                        theme={Theme.DARK}
                        emojiData={locale.slice(0, 2) === "en" ? enData : zhData}
                        onEmojiClick={emoji => {
                            onSelect(emoji.imageUrl || "");
                            setIsOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
