import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const RatingRow = ({ label, value, onChange }: { label: string; value: number; onChange: (val: number) => void }) => {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <p className="text-[#7D7D7D] text-xs">{label}</p>
      <span className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={22} className="cursor-pointer transition-colors" color={star <= value ? "#FBBC04" : "#D1D5DB"} onClick={() => onChange(star)} />
        ))}
      </span>
    </div>
  );
};

const WriteReview = () => {
  const [open, setOpen] = useState(false);
  const [productQuality, setProductQuality] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    // TODO: Submit review data to API
    // Data to submit: { productQuality, feedback }
    setOpen(false); // close after submit
  };

  const handleSkip = () => {
    setOpen(false); // close on skip
  };

  return (
    <section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="text-[#569DD1] underline">write review</DialogTrigger>
        <DialogContent className="!max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-[#3A3A3A]">Rate your Order</DialogTitle>
            <DialogDescription className="text-[#9C9C9C]">Rating your experience helps us keep providing quality services for you.</DialogDescription>

            <div className="flex flex-col gap-4 mt-4">
              <RatingRow label="Product Quality" value={productQuality} onChange={setProductQuality} />

              <Textarea
                className="mt-4 min-h-[120px] focus:shadow-none focus:outline-none focus-visible:ring-0"
                name="add-feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback here..."
              />

              <Button onClick={handleSubmit} className="mt-5 text-white font-bold px-12 py-2 rounded-md">
                Submit
              </Button>
              <span onClick={handleSkip} className="mt-3 mx-auto text-sm underline text-[#3B3B3B] cursor-pointer">
                Skip
              </span>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WriteReview;
