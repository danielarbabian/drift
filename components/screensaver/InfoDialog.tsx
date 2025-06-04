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
      <DialogContent className="max-w-lg bg-black/80 border-white/10 text-white !rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl text-white/90 font-medium">
            drift
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-white/70 text-sm">
          <p>
            An elegant OLED-friendly screensaver with integrated productivity
            tools, designed to prevent screen burn-in while keeping you
            productive.
          </p>

          <div>
            <h3 className="text-white/90 font-medium mb-2">✨ Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Dynamic floating clock with character-level animations</li>
              <li>
                Spotify integration with playlist browsing and playback controls
              </li>
              <li>Interactive todo list with persistent localStorage</li>
              <li>Pomodoro timer with customizable work/break durations</li>
              <li>Orbital animations that prevent static content burn-in</li>
              <li>Customizable settings for all floating elements</li>
              <li>12/24-hour time format support</li>
              <li>Premium and non-premium Spotify account support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white/90 font-medium mb-2">🎛️ Controls</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Move mouse to reveal control buttons</li>
              <li>Settings: Configure all preferences and toggle elements</li>
              <li>Fullscreen: Toggle fullscreen mode manually</li>
              <li>
                All floating elements can be enabled/disabled individually
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white/90 font-medium mb-2">
              🖥️ OLED Optimized
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Pure black background (OLED pixels completely off)</li>
              <li>Constant movement prevents pixel burn-in</li>
              <li>Minimal bright elements to preserve battery</li>
              <li>Smooth orbital animations distribute pixel usage</li>
            </ul>
          </div>

          <p className="text-center text-white/50 text-xs mt-4 pt-3 border-t border-white/10">
            Built with Next.js, Tailwind CSS, and shadcn/ui
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
