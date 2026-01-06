import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center">
                    <div className="mr-4 hidden md:flex">
                        <Link to="/" className="mr-6 flex items-center space-x-2">
                            <span className="hidden font-bold sm:inline-block">
                                OMS
                            </span>
                        </Link>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <Link to="/">
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Dashboard
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link to="/products">
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Products
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link to="/orders">
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Orders
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <div className="container mx-auto py-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
