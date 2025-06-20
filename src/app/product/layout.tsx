import { Providers } from "../seller/provider";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full">
            <main className="h-full">
                <Providers>
                    {children}
                </Providers>
            </main>
        </div>
    );
}