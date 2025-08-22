"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment-timezone";

type TimeZoneOption = { value: string; label: string };

function getTimeZoneOptions(list?: string[]): TimeZoneOption[] {
  const zones = list && list.length > 0 ? list : moment.tz.names();
  return zones
    .map((tz) => ({
      value: tz,
      label: `(UTC${moment.tz(tz).format("Z")}) ${tz}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function TimeZoneSelect({
  value,
  onChange,
  placeholder = "Select Time Zone",
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [zones, setZones] = React.useState<TimeZoneOption[]>([]);

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/timezones", {
          signal: controller.signal,
        });
        const data: string[] = res.ok ? await res.json() : [];
        setZones(getTimeZoneOptions(data));
      } catch {
        setZones(getTimeZoneOptions());
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const selectedLabel = React.useMemo(() => {
    if (!value || zones.length === 0) return "";
    return zones.find((z) => z.value === value)?.label ?? value;
  }, [value, zones]);

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedLabel || placeholder}
          <div className="flex items-center gap-2">
            {value && (
              <X
                className="h-4 w-4 opacity-70 cursor-pointer"
                onClick={clearSelection}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[360px] p-0">
        <Command shouldFilter>
          <CommandInput placeholder="Search timezone..." />
          <CommandList>
            {loading ? (
              <div className="p-3 text-sm text-muted-foreground">
                Loading time zones…
              </div>
            ) : (
              <>
                <CommandEmpty>No time zone found.</CommandEmpty>
                <CommandGroup>
                  {zones.map((tz) => (
                    <CommandItem
                      key={tz.value}
                      value={tz.label}
                      onSelect={() => {
                        onChange(tz.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === tz.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tz.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
