import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const handleClockAnimationChange = (value: string) => {
    setEnableClockBounce(value === 'floating');
  };

  const handleTimeFormatChange = (value: string) => {
    setUse24Hour(value === '24hour');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-black/90 border-white/20 text-white rounded-2xl">
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
            <Tabs
              value={enableClockBounce ? 'floating' : 'static'}
              onValueChange={handleClockAnimationChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white/10 rounded-xl p-1">
                <TabsTrigger
                  value="static"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl data-[state=active]:shadow-none text-white/70"
                >
                  Static
                </TabsTrigger>
                <TabsTrigger
                  value="floating"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl data-[state=active]:shadow-none text-white/70"
                >
                  Floating
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <h3 className="text-white/70 mb-3 text-sm uppercase tracking-wider">
              Time Format
            </h3>
            <Tabs
              value={use24Hour ? '24hour' : '12hour'}
              onValueChange={handleTimeFormatChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white/10 rounded-xl p-1">
                <TabsTrigger
                  value="12hour"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl data-[state=active]:shadow-none text-white/70"
                >
                  12-Hour
                </TabsTrigger>
                <TabsTrigger
                  value="24hour"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl data-[state=active]:shadow-none text-white/70"
                >
                  24-Hour
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
                  <SelectTrigger className="bg-white/10 border-white/20 text-white/80 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20 rounded-xl">
                    <SelectItem
                      value="20"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white rounded-lg"
                    >
                      20 minutes
                    </SelectItem>
                    <SelectItem
                      value="25"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white rounded-lg"
                    >
                      25 minutes
                    </SelectItem>
                    <SelectItem
                      value="30"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white rounded-lg"
                    >
                      30 minutes
                    </SelectItem>
                    <SelectItem
                      value="45"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white rounded-lg"
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
                  <SelectTrigger className="bg-white/10 border-white/20 text-white/80 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20 rounded-xl">
                    <SelectItem
                      value="5"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white rounded-lg"
                    >
                      5 minutes
                    </SelectItem>
                    <SelectItem
                      value="10"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white rounded-lg"
                    >
                      10 minutes
                    </SelectItem>
                    <SelectItem
                      value="15"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white rounded-lg"
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
