import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BriefModalProps {
  briefHtml: string | null;
  onClose: () => void;
}

export const BriefModal = ({ briefHtml, onClose }: BriefModalProps) => {
  if (!briefHtml) return null;

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-muted rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-6">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full bg-card shadow-md hover:scale-110"
        >
          <X className="w-6 h-6" />
        </Button>
        <div dangerouslySetInnerHTML={{ __html: briefHtml }} />
      </div>
    </div>
  );
};
