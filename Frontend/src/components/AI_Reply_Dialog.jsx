import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

function AiReplyDialog({ open, setOpen, AiReplyHandler }) {
  const [tone, setTone] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false) // loader state

  const handleGenerateReply = async () => {
    if (!description || !tone) return
    setLoading(true)
    try {
      await AiReplyHandler(tone, description)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md bg-white rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            AI Message Replier
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description Box */}
          <div className="space-y-2">
            <Label htmlFor="description">What kind of reply?</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type the kind of reply you want..."
              className="resize-none"
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <Label htmlFor="tone">Select tone</Label>
            <Select onValueChange={(value) => setTone(value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Choose a tone" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="informal">Informal</SelectItem>
                <SelectItem value="supportive">Supportive</SelectItem>
                <SelectItem value="opposing">Opposing</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Disclaimer Section */}
          <div className="text-xs text-gray-500 leading-relaxed border-t pt-3">
            ⚠️ Please review your reply before sending.
            <br />
            🔒 Your privacy is our priority — your messages will not be shared with anyone.
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setOpen(false)
                setDescription("")
                setTone("")
              }}
            >
              Cancel
            </Button>

            <Button
              disabled={description.length === 0 || tone.length === 0 || loading}
              onClick={handleGenerateReply}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Generating..." : "Generate Reply"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AiReplyDialog
