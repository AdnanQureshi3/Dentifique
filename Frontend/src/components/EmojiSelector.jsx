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
        <div className="absolute bottom-full mb-2 left-0 z-1000 w-[300px] rounded-lg border bg-white shadow-lg">
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
