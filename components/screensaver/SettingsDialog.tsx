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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

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
  showSpotifyPlayer: boolean;
  setShowSpotifyPlayer: (show: boolean) => void;
  showPomodoroTimer: boolean;
  setShowPomodoroTimer: (show: boolean) => void;
  showTodoList: boolean;
  setShowTodoList: (show: boolean) => void;
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
  showSpotifyPlayer,
  setShowSpotifyPlayer,
  showPomodoroTimer,
  setShowPomodoroTimer,
  showTodoList,
  setShowTodoList,
}: SettingsDialogProps) {
  const [customWorkDuration, setCustomWorkDuration] = useState('');
  const [customBreakDuration, setCustomBreakDuration] = useState('');
  const [isCustomWorkSelected, setIsCustomWorkSelected] = useState(false);
  const [isCustomBreakSelected, setIsCustomBreakSelected] = useState(false);

  const presetWorkDurations = [20, 25, 30, 45];
  const presetBreakDurations = [5, 10, 15];

  const isCustomWorkDuration =
    isCustomWorkSelected || !presetWorkDurations.includes(workDuration / 60);
  const isCustomBreakDuration =
    isCustomBreakSelected || !presetBreakDurations.includes(breakDuration / 60);

  useEffect(() => {
    if (isCustomWorkDuration) {
      setCustomWorkDuration(String(workDuration / 60));
    }
  }, [workDuration, isCustomWorkDuration]);

  useEffect(() => {
    if (isCustomBreakDuration) {
      setCustomBreakDuration(String(breakDuration / 60));
    }
  }, [breakDuration, isCustomBreakDuration]);

  useEffect(() => {
    if (presetWorkDurations.includes(workDuration / 60)) {
      setIsCustomWorkSelected(false);
    }
  }, [workDuration]);

  useEffect(() => {
    if (presetBreakDurations.includes(breakDuration / 60)) {
      setIsCustomBreakSelected(false);
    }
  }, [breakDuration]);

  const validateAndSetWorkDuration = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 120) {
      setWorkDuration(num * 60);
    }
  };

  const validateAndSetBreakDuration = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 60) {
      setBreakDuration(num * 60);
    }
  };

  const handleWorkDurationChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomWorkSelected(true);
      setCustomWorkDuration(String(workDuration / 60));
    } else {
      setIsCustomWorkSelected(false);
      setWorkDuration(parseInt(value) * 60);
    }
  };

  const handleBreakDurationChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomBreakSelected(true);
      setCustomBreakDuration(String(breakDuration / 60));
    } else {
      setIsCustomBreakSelected(false);
      setBreakDuration(parseInt(value) * 60);
    }
  };

  const handleCustomWorkDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomWorkDuration(value);
    if (value) {
      validateAndSetWorkDuration(value);
    }
  };

  const handleCustomBreakDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomBreakDuration(value);
    if (value) {
      validateAndSetBreakDuration(value);
    }
  };

  const handleClockAnimationChange = (value: string) => {
    setEnableClockBounce(value === 'floating');
  };

  const handleTimeFormatChange = (value: string) => {
    setUse24Hour(value === '24hour');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-black/90 border-white/20 text-white !rounded-2xl p-4">
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
                  value={
                    isCustomWorkDuration ? 'custom' : String(workDuration / 60)
                  }
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
                    <SelectItem
                      value="custom"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white rounded-lg"
                    >
                      Custom
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isCustomWorkDuration && (
                  <div className="mt-2">
                    <Input
                      type="number"
                      min="1"
                      max="120"
                      value={customWorkDuration}
                      onChange={handleCustomWorkDurationChange}
                      placeholder="Minutes (1-120)"
                      className="bg-white/10 border-white/20 text-white/80 placeholder:text-white/40 rounded-xl"
                    />
                    <p className="text-white/40 text-xs mt-1">1-120 minutes</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-white/60 text-sm block mb-1">
                  Break Duration
                </label>
                <Select
                  value={
                    isCustomBreakDuration
                      ? 'custom'
                      : String(breakDuration / 60)
                  }
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
                    <SelectItem
                      value="custom"
                      className="text-white focus:bg-white/20 focus:text-white data-[highlighted]:bg-white/20 data-[highlighted]:text-white rounded-lg"
                    >
                      Custom
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isCustomBreakDuration && (
                  <div className="mt-2">
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={customBreakDuration}
                      onChange={handleCustomBreakDurationChange}
                      placeholder="Minutes (1-60)"
                      className="bg-white/10 border-white/20 text-white/80 placeholder:text-white/40 rounded-xl"
                    />
                    <p className="text-white/40 text-xs mt-1">1-60 minutes</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white/70 mb-3 text-sm uppercase tracking-wider">
              Floating Elements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="spotify-toggle"
                  className="text-white/80 text-sm"
                >
                  Spotify Player
                </Label>
                <Switch
                  id="spotify-toggle"
                  checked={showSpotifyPlayer}
                  onCheckedChange={setShowSpotifyPlayer}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="pomodoro-toggle"
                  className="text-white/80 text-sm"
                >
                  Pomodoro Timer
                </Label>
                <Switch
                  id="pomodoro-toggle"
                  checked={showPomodoroTimer}
                  onCheckedChange={setShowPomodoroTimer}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="todo-toggle" className="text-white/80 text-sm">
                  Todo List
                </Label>
                <Switch
                  id="todo-toggle"
                  checked={showTodoList}
                  onCheckedChange={setShowTodoList}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
