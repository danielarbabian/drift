import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InfoDialog({ open, onOpenChange }: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-black/80 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white/90 font-medium">
            About This App
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-white/70">
          <p>
            This is an OLED-friendly screensaver designed to prevent screen
            burn-in while providing useful productivity tools.
          </p>
          <h3 className="text-white/90 font-medium mt-4">Features:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Dynamic background that constantly shifts to prevent pixel burn-in
            </li>
            <li>Floating Pomodoro timer that moves across the screen</li>
            <li>Digital clock with customizable time format</li>
            <li>
              Black background for OLED screens (black pixels are turned off)
            </li>
            <li>
              All elements shift position over time to prevent static content
            </li>
          </ul>
          <p className="mt-4">
            Move your mouse to reveal controls. The app will automatically enter
            fullscreen mode for the best experience.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
