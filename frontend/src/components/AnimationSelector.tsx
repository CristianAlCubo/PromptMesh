import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { ChevronDown, ListFilter } from "lucide-react";

interface Props {
    animationNames: string[];
    current: string;
    setCurrent: (name: string) => void;
}

export const AnimationSelector: React.FC<Props> = ({ animationNames, current, setCurrent }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (name: string) => {
        setCurrent(name);
        setOpen(false);
    };

    return (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="secondary" className="rounded-xl px-4 shadow-lg">
                        <ListFilter className="mr-2 h-4 w-4" />
                        {current ? (
                            <span className="capitalize">{current}</span>
                        ) : (
                            <span>Seleccionar animación</span>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 shadow-xl border border-gray-700/50 bg-background backdrop-blur-sm">
                    <div className="px-4 py-3 border-b border-border">
                        <h3 className="text-sm font-medium text-muted-foreground">Animaciones disponibles</h3>
                    </div>
                    <Command>
                        <CommandEmpty>No hay animaciones</CommandEmpty>
                        <CommandGroup>
                            {animationNames.map((name) => (
                                <CommandItem
                                    key={name}
                                    onSelect={() => handleSelect(name)}
                                    className="capitalize"
                                >
                                    {name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
