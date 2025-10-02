import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";

import axios from 'axios';
import { toast } from 'sonner';

const reasons = [
  'Spam',
  'Harassment',
  'False Information',
  'Hate Speech',
  'Other',
];

function ReportHandler({ post, user, onClose, type  }) {
  const [open, setOpen] = useState(true);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const reportPost = async () => {
    try {
      console.log(post);
      const postId = post._id;
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast.success("Thank you for reporting");
          setOpen(false);
      if (onClose) onClose();

        
      }, 2*1000);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/${postId}/report`,
        {
          type: type,
          author:post.author.username,
          user: user.username,
          reason: selectedReason,
          description,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        console.log("Reported successfully");
      
      }

    } catch (err) {
      console.error('Error reporting post:', err);

    }
    finally {
      setLoading(false);
      

    }
  };

  return (
    <Dialog  open={open} onOpenChange={(val) => { setOpen(val); if (!val && onClose) onClose(); }}>
      <DialogContent
        className="bg-white p-6 rounded-xl shadow-2xl w-full z-2000 max-w-md"
        onInteractOutside={() => setOpen(false)}
      >
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <div className="text-xl font-semibold mb-4">Report Post</div>

          <div className="space-y-3">
            {reasons.map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={r}
                  checked={selectedReason === r}
                  onChange={() => setSelectedReason(r)}
                />
                {r}
              </label>
            ))}

            <textarea
              placeholder="Describe the issue (optional)"
              className="w-full border rounded-md p-2 resize-none h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={reportPost}
              disabled={loading || !selectedReason}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
            >
              {loading ? 'Reporting...' : 'Report'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReportHandler;
