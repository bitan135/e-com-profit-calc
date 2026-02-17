import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calculator } from "@/components/Calculator";
import { FAQ } from "@/components/FAQ";

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "E-commerce Seller Profit Calculator India",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        },
        "description": "Calculate your actual profit per order on Amazon, Flipkart, and Meesho. Account for referral fees, shipping, GST, and returns.",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "120"
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <main className="flex-1 container max-w-4xl py-8 px-4 md:py-12 mx-auto">
                {/* 1. Header & Intro */}
                <section className="text-center mb-10 space-y-4">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 pb-2">
                        Amazon, Flipkart & Meesho Seller Profit Calculator (India) – Know Your Real Profit
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Stop guessing your profits. This free tool helps Indian e-commerce sellers calculate <strong>exact net margins</strong> by accounting for hidden costs like <strong>GST on fees, advertising spend, and return (RTO) losses</strong>.
                    </p>
                </section>

                {/* 2. The Calculator */}
                <Calculator />

                {/* 3. Results Explanation */}
                <section className="mt-16 prose prose-blue max-w-none bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900">Understanding "Net Profit per Order"</h2>
                    <div className="text-gray-600 space-y-4">
                        <p>
                            Many sellers typically look at <strong>(Selling Price - Purchase Cost)</strong> and think they are profitable. This is a mistake.
                            Real profit ("Net Margin") is what lands in your bank account after deducting:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Platform Fees:</strong> Referral fees, closing fees, and weight handling fees.</li>
                            <li><strong>GST Impact:</strong> You pay 18% GST on all platform services, which is an explicit cost.</li>
                            <li><strong>Advertising ACOS:</strong> Even a small ad spend can wipe out thin margins.</li>
                            <li><strong>Return Losses:</strong> You must account for the probability of returns (RTO/Customer Returns) in every single sale.</li>
                        </ul>
                    </div>
                </section>

                {/* 4. How It Works */}
                <section className="mt-8 prose prose-blue max-w-none bg-gray-50 p-8 rounded-2xl border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">How This Profit Calculation Works</h2>
                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800">1. Revenue & Direct Costs</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                We start with your <strong>Selling Price</strong> (inc. GST). We then subtract the <strong>Product Purchase Cost</strong> (COGS) and Packaging costs.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800">2. Platform Deductions</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                We deduct <strong>Referral Fees</strong> and <strong>Closing Fees</strong>. Crucially, we also calculate and subtract the <strong>18% GST</strong> charged on these fees.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800">3. Marketing Spend</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                If you run ads, we deduct the <strong>Ad Spend per Order</strong> (or convert CPC/ACOS to a per-order cost).
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800">4. Return Probability</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                We don't just ignore returns. We calculate an "Expected Loss" based on your <strong>Return %</strong> and <strong>Loss per Return</strong>, spreading this cost across all successful orders.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5. FAQ */}
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}
