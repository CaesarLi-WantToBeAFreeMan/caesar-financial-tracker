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
            <div onClick={() => setIsOpen(true)} className="flex cursor-pointer items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-400/30">
                    {icon ? (
                        <img src={icon} alt="icon" className="h-6 w-6" />
                    ) : (
                        <Image size={20} className="text-cyan-300" />
                    )}
                </div>
                <p className="text-cyan-300">{icon ? "Change icon" : "Pick icon"}</p>
            </div>

            {isOpen && (
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute -right-2 -top-2 z-10 rounded-full bg-black p-1"
                    >
                        <CircleX size={18} className="text-[#e06c75]" />
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
