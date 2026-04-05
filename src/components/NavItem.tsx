import type { ReactNode } from "react";
import { NavLink, useMatch } from "react-router-dom"
import { type LucideIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type BaseProps = {
    to: string;
    label: string;
    end?: boolean;
    icon?: LucideIcon
}

type WithActionButton = BaseProps & {
    actionButton: true;
    actionIcon: LucideIcon;
    actionTo: string;
    actionTooltip: string;
}

type WithoutActionButton = BaseProps & {
    actionButton?: false;
    actionIcon?: never;
    actionTo?: never;
    actionTooltip?: never;
}

type NavItemProps = WithActionButton | WithoutActionButton;

export const NavItem = ({ to , label, end, icon, actionButton, actionIcon, actionTo, actionTooltip }: NavItemProps): ReactNode => {
    const baseClasses = "flex items-center px-3 py-2 rounded-md transition-all duration-300"
    const Icon = icon!;
    const ActionIcon = actionIcon!;
    const isActive = !!useMatch(end ? {path: to, end: true} : to);
    return (
        <div  className={cn(baseClasses, isActive ? 
                            ` bg-gray-700 text-white` : 
                            `text-gray-400 hover:bg-gray-700/50 hover:text-white hover:scale-105`)}>
                <NavLink
                className="flex-1"
                to={to}
                end={end}
                >
                <div className="flex items-center gap-2">
                    {icon && <Icon size={18} />}
                    {label}
                </div>
            </NavLink>
            {actionButton && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" type="button" size="icon" className='py-3 px-5 hover:cursor-pointer hover:bg-white/10 size-5'>
                                <NavLink to={actionTo}>
                                    <ActionIcon size={18} />
                                </NavLink>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" >
                            <p>{actionTooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

        </div>

    )

}