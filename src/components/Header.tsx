import { Calculator } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
                <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-gray-900">
                    <Calculator className="h-6 w-6 text-blue-600" />
                    <span>Seller Profit Calc</span>
                </div>
                <nav className="ml-auto flex items-center gap-4 text-sm font-medium">
                    {/* Future navigation items could go here */}
                </nav>
            </div>
        </header>
    );
}
