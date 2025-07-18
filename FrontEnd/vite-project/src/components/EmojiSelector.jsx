import { useState } from "react"
import EmojiPicker from "emoji-picker-react"
import { Smile } from "lucide-react"

export default function EmojiSelector({ onSelect }) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <Smile className="w-5 h-5" />
      </button>

      {showPicker && (
        <div className="absolute z-50 bottom-full mb-2 right-0">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onSelect(emojiData.emoji)
              setShowPicker(false)
            }}
            height={350}
            width={300}
          />
        </div>
      )}
    </div>
  )
}
