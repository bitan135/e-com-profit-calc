export function Footer() {
    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:px-6 px-4">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left text-gray-500">
                    Built for Indian E-commerce Sellers. Free forever.
                </p>
                <p className="text-xs text-gray-400 text-center md:text-right max-w-md">
                    Disclaimer: This tool provides estimates only. Actual platform fees and payouts may vary by category and policy. Always verify with official platform dashboards.
                </p>
            </div>
        </footer>
    );
}
