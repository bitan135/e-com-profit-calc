export function FAQ() {
    const faqs = [
        {
            question: "How do I calculate Amazon seller profit in India?",
            answer: "To calculate accurate profit, start with your Selling Price and subtract: Product Cost, Amazon Referral/Closing Fees, 18% GST on fees, Shipping/Weight Handling, Packaging, Advertising Cost (ACOS), and Expected Return Loss. What remains is your Net Profit."
        },
        {
            question: "What fees does Amazon charge sellers in India?",
            answer: "Amazon India charges three main fees: Referral Fee (percentage based on category), Closing Fee (fixed fee based on price range), and Weight Handling Fee (shipping cost). Additionally, you must pay 18% GST on these service fees."
        },
        {
            question: "How does RTO (Return to Origin) affect seller profit?",
            answer: "RTO impacts profit significantly. Even if you don't sell the item, you lose money on Forward Shipping (often non-refundable), Reverse Shipping, and Packaging. This calculator spreads that expected loss across your successful orders to show true profitability."
        },
        {
            question: "Is selling on Flipkart profitable?",
            answer: "Yes, selling on Flipkart is profitable if you manage your margins correctly. Key factors are sourcing products at low cost, keeping returns (RTO) under control, and monitoring ad spend. Use this tool to check if your selling price covers all Flipkart fees."
        },
        {
            question: "How do ads affect Amazon seller margin?",
            answer: "Advertising (Sponsored Products) is a direct cost. If your Net Margin is 15% and your ACOS (Advertising Cost of Sales) is 20%, you are making a loss. You must include ad spend in your per-unit cost calculation."
        },
        {
            question: "How to calculate break-even price on Amazon?",
            answer: "Break-even price is the selling price where your Net Profit is ₹0. It covers Product Cost + All Fees + GST + Shipping + Ads. Selling below this price results in a loss."
        },
        {
            question: "Does GST reduce seller profit?",
            answer: "Yes. While you collect GST from customers, you also pay 18% GST on Amazon/Flipkart service fees. This 'Input GST' on fees is an expense that reduces your cash in hand unless you have enough Output GST liability to offset it."
        },
        {
            question: "Is Meesho profitable for sellers?",
            answer: "Meesho charges 0% commission (referral fee) on many categories, which can make it more profitable than Amazon/Flipkart. However, fierce price competition often forces lower selling prices. Always calculate your net margin after shipping and returns."
        }
    ];

    return (
        <section className="mt-16 py-12 border-t border-gray-200">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                    <details key={index} className="group bg-white rounded-xl border border-gray-200 shadow-sm open:ring-1 open:ring-blue-100 transition-all duration-200">
                        <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-semibold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                            {faq.question}
                            <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 group-open:text-blue-600 transition-transform duration-200">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-accordion-down">
                            {faq.answer}
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
}
