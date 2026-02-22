import EmojiPicker, {Theme} from "emoji-picker-react";
import {CircleX, Image} from "lucide-react";
import {useState} from "react";

interface Props {
    icon: string;
    onSelect: (icon: string) => void;
}

export default function EmojiPickerPopup({icon, onSelect}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex items-start gap-4">
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:cursor-pointer"
            >
                <p className="text-cyan-300">Emoji</p>
            </button>

            {isOpen && (
                <div className="absolute right-10 bottom-5 z-10">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-0 top-0 z-50 rounded-lg bg-black p-1 hover:bg-cyan-200 hover:cursor-pointer transition"
                    >
                        <CircleX size={18} className="text-red-500" />
                    </button>

                    <EmojiPicker
                        theme={Theme.DARK}
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
