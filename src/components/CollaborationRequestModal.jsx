import React, { useState } from "react";
import { collaborationAPI, authAPI } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

const CollaborationRequestModal = ({ entrepreneur }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      const currentUser = authAPI.getCurrentUser();

      if (!currentUser) {
        alert("Please log in to send collaboration requests");
        return;
      }

      const requestData = {
        investorId: currentUser.id,
        entrepreneurId: entrepreneur.id,
        investorName: currentUser.name,
        entrepreneurName: entrepreneur.name,
        status: "pending",
        message:
          message ||
          "I'm interested in learning more about your startup and potential collaboration opportunities.",
        requestDate: new Date().toISOString(),
        investor: {
          name: currentUser.name,
          company: currentUser.company || "Independent Investor",
          profileSnippet:
            currentUser.profileSnippet || "Investment professional",
          avatar:
            currentUser.avatar ||
            currentUser.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") ||
            "??",
          investmentRange: currentUser.investmentRange || "$100K - $1M",
          specialties: currentUser.specialties || ["General Investment"],
          portfolioSize: currentUser.portfolioSize || 0,
          successfulExits: currentUser.successfulExits || 0,
        },
      };

      await collaborationAPI.create(requestData);

      setOpen(false);
      setMessage("");
      alert(
        "Collaboration request sent successfully! The entrepreneur will be notified."
      );
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send collaboration request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">
          <Send className="h-4 w-4 mr-2" />
          Send Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Collaboration Request</DialogTitle>
          <DialogDescription>
            Send a collaboration request to <strong>{entrepreneur.name}</strong>{" "}
            from{" "}
            <strong>{entrepreneur.startupName || entrepreneur.company}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain your interest in their startup..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This message will be sent to the entrepreneur along with your
              profile information.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSendRequest} disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationRequestModal;
