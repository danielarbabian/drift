import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enableClockBounce: boolean;
  setEnableClockBounce: (enabled: boolean) => void;
  use24Hour: boolean;
  setUse24Hour: (use24Hour: boolean) => void;
  workDuration: number;
  setWorkDuration: (duration: number) => void;
  breakDuration: number;
  setBreakDuration: (duration: number) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  enableClockBounce,
  setEnableClockBounce,
  use24Hour,
  setUse24Hour,
  workDuration,
  setWorkDuration,
  breakDuration,
  setBreakDuration,
}: SettingsDialogProps) {
  const handleWorkDurationChange = (value: string) => {
    setWorkDuration(parseInt(value) * 60);
  };

  const handleBreakDurationChange = (value: string) => {
    setBreakDuration(parseInt(value) * 60);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-black/80 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white/90 font-medium">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-white/70 mb-3 text-sm uppercase tracking-wider">
              Clock Animation
            </h3>
            <div className="flex space-x-3">
              <Button
                variant={!enableClockBounce ? 'default' : 'outline'}
                onClick={() => setEnableClockBounce(false)}
                className={`${
                  !enableClockBounce
                    ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                    : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Static
              </Button>
              <Button
                variant={enableClockBounce ? 'default' : 'outline'}
                onClick={() => setEnableClockBounce(true)}
                className={`${
                  enableClockBounce
                    ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                    : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Floating
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-white/70 mb-3 text-sm uppercase tracking-wider">
              Time Format
            </h3>
            <div className="flex space-x-3">
              <Button
                variant={!use24Hour ? 'default' : 'outline'}
                onClick={() => setUse24Hour(false)}
                className={`${
                  !use24Hour
                    ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                    : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                12-Hour
              </Button>
              <Button
                variant={use24Hour ? 'default' : 'outline'}
                onClick={() => setUse24Hour(true)}
                className={`${
                  use24Hour
                    ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                    : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                24-Hour
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-white/70 mb-3 text-sm uppercase tracking-wider">
              Pomodoro Settings
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/60 text-sm block mb-1">
                  Work Duration
                </label>
                <Select
                  value={String(workDuration / 60)}
                  onValueChange={handleWorkDurationChange}
                >
                  <SelectTrigger className="bg-black/40 border-white/10 text-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 border-white/10">
                    <SelectItem
                      value="20"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white"
                    >
                      20 minutes
                    </SelectItem>
                    <SelectItem
                      value="25"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white"
                    >
                      25 minutes
                    </SelectItem>
                    <SelectItem
                      value="30"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white"
                    >
                      30 minutes
                    </SelectItem>
                    <SelectItem
                      value="45"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white"
                    >
                      45 minutes
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-white/60 text-sm block mb-1">
                  Break Duration
                </label>
                <Select
                  value={String(breakDuration / 60)}
                  onValueChange={handleBreakDurationChange}
                >
                  <SelectTrigger className="bg-black/40 border-white/10 text-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 border-white/10">
                    <SelectItem
                      value="5"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white"
                    >
                      5 minutes
                    </SelectItem>
                    <SelectItem
                      value="10"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white"
                    >
                      10 minutes
                    </SelectItem>
                    <SelectItem
                      value="15"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white"
                    >
                      15 minutes
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
