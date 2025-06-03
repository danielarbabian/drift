import { Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ControlButtonsProps {
  showControls: boolean;
  onSettingsClick: () => void;
  onInfoClick: () => void;
}

export function ControlButtons({
  showControls,
  onSettingsClick,
  onInfoClick,
}: ControlButtonsProps) {
  return (
    <>
      <div
        className={`absolute top-6 right-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
        >
          <Settings size={18} className="text-white/70" />
        </Button>
      </div>

      <div
        className={`absolute bottom-6 right-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onInfoClick}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
        >
          <Info size={18} className="text-white/70" />
        </Button>
      </div>
    </>
  );
}
