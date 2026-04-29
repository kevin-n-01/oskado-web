import { Outlet } from "react-router-dom"
import { NavItem } from "./NavItem"
import { BanknoteArrowUp, BookImage, ChartNoAxesCombinedIcon, LayoutDashboard, Sheet, SquarePlus } from "lucide-react"
import { Show, SignInButton, SignOutButton, SignUpButton, UserAvatar, UserButton } from "@clerk/react"
import { Button } from "./ui/button"

export const AppLayout = () => {
    return (
        <div className="flex min-h-screen bg-auto">
            <div className="w-64 fixed h-screen overflow-hidden bg-sidebar">
                <h1 className="pt-1 text-center text-2xl font-bold bg-clip-text from-blue-400 to-purple-400 text-transparent bg-linear-to-r">Oskado</h1>
                <div className="flex flex-col p-1 m-2 gap-1">
                    <NavItem to="/" label="Dashboard" icon={LayoutDashboard} end />
                    <NavItem to="/catalog" label="Catalog" icon={BookImage} actionButton actionIcon={SquarePlus} actionTooltip="Add New Item" actionTo="/addItem" />
                    {/* <NavItem to="/addItem" label="Add Item" icon={SquarePlus} /> */}
                    <NavItem to="/transactions" label="Transactions" icon={BanknoteArrowUp} />
                    <NavItem to="/history" label="History" icon={Sheet} />
                    <NavItem to="/analytics" label="Analytics" icon={ChartNoAxesCombinedIcon} />
                </div>
            </div>
            <div className="ml-64 flex-1 bg-muted">
                <div className="sticky flex flex-row justify-end gap-4 items-center top-0 h-16 z-10 bg-sidebar p-3">
                    <Show when="signed-out">
                        <SignInButton>
                            <Button>Sign In</Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button variant="secondary">Sign Up</Button>
                        </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                        <SignOutButton>
                            <Button variant="secondary">Sign Out</Button>
                        </SignOutButton>
                        <UserButton />
                    </Show>
                </div>
                <div className='p-6'>
                    <Outlet />
                </div>
                    
            </div>
            
        </div>
    )
}