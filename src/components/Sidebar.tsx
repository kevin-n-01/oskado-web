import { Outlet } from "react-router-dom"
import { NavItem } from "./NavItem"
import { BanknoteArrowUp, BookImage, ChartNoAxesCombinedIcon, LayoutDashboard, Sheet, SquarePlus } from "lucide-react"

export const Sidebar = () => {
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
            <div className="ml-64 flex-1 p-6 bg-muted">
                <Outlet />
            </div>
        </div>
    )
}