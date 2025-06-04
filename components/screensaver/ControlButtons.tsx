import { Settings, Info, Maximize, Minimize, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ControlButtonsProps {
  showControls: boolean;
  isFullscreen: boolean;
  onSettingsClick: () => void;
  onInfoClick: () => void;
  onFullscreenToggle: () => void;
}

export function ControlButtons({
  showControls,
  isFullscreen,
  onSettingsClick,
  onInfoClick,
  onFullscreenToggle,
}: ControlButtonsProps) {
  const handleGitHubClick = () => {
    window.open('https://github.com/danielarbabian/drift', '_blank');
  };

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
        className={`absolute bottom-6 right-6 flex flex-col gap-3 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onFullscreenToggle}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
        >
          {isFullscreen ? (
            <Minimize size={18} className="text-white/70" />
          ) : (
            <Maximize size={18} className="text-white/70" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onInfoClick}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
        >
          <Info size={18} className="text-white/70" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGitHubClick}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
        >
          <Github size={18} className="text-white/70" />
        </Button>
      </div>
    </>
  );
}
