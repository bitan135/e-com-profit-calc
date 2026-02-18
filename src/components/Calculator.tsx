"use client";

import { useState, useEffect } from "react";
import { Calculator as CalculatorIcon, Info, ChevronDown, ChevronUp } from "lucide-react";

type Platform = "amazon" | "flipkart" | "meesho";
type AdType = "amount" | "cpc";

// Helper for Input fields
const InputGroup = ({ label, value, onChange, prefix, suffix, type = "number", helpText }: any) => (
    <div className="space-y-1">
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            {helpText && (
                <div className="group relative cursor-help">
                    <Info className="h-3 w-3 text-gray-400" />
                    <span className="pointer-events-none absolute bottom-full right-0 mb-2 w-48 rounded bg-gray-900 p-2 text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100 z-50">
                        {helpText}
                    </span>
                </div>
            )}
        </div>
        <div className="relative rounded-md shadow-sm">
            {prefix && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">{prefix}</span>
                </div>
            )}
            <input
                type={type}
                value={value === 0 ? "" : value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={`block w-full rounded-md border border-gray-300 py-2.5 bg-gray-50 text-gray-900 dark:bg-zinc-800/50 dark:border-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'}`}
                placeholder="0"
            />
            {suffix && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">{suffix}</span>
                </div>
            )}
        </div>
    </div>
);

export function Calculator() {
    // --- STATE ---
    const [platform, setPlatform] = useState<Platform>("amazon");
    const [sellingPrice, setSellingPrice] = useState<number>(0);
    const [purchaseCost, setPurchaseCost] = useState<number>(0);
    const [packagingCost, setPackagingCost] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0); // Optional fulfillment/shipping

    // Platform Fees
    const [referralFeePercent, setReferralFeePercent] = useState<number>(0);
    const [fixedFee, setFixedFee] = useState<number>(0);

    // Advertising
    const [adType, setAdType] = useState<AdType>("amount");
    const [adCostAmount, setAdCostAmount] = useState<number>(0);
    const [cpc, setCpc] = useState<number>(0);
    const [clicksPerOrder, setClicksPerOrder] = useState<number>(0);

    // Returns
    const [returnRate, setReturnRate] = useState<number>(0);
    const [returnLoss, setReturnLoss] = useState<number>(0);

    // Taxes
    const [gstEnabled, setGstEnabled] = useState<boolean>(true);
    const [gstRate, setGstRate] = useState<number>(18);

    // Monthly Projection
    const [showMonthly, setShowMonthly] = useState<boolean>(false);
    const [ordersPerMonth, setOrdersPerMonth] = useState<number>(30); // Default 1 order a day

    // --- CALCULATIONS ---
    const [results, setResults] = useState({
        netProfit: 0,
        margin: 0,
        roi: 0,
        totalDeductions: 0,
        isLoss: false,
    });

    useEffect(() => {
        // 1. Revenue
        const revenue = sellingPrice;

        // 2. Platform Fees
        const referralFeeAmount = (sellingPrice * referralFeePercent) / 100;
        const totalPlatformFees = referralFeeAmount + fixedFee;

        // 3. GST (on fees)
        // Usually GST is charged on platform fees (18%). 
        // If "Include GST in calculation" means "Is GST applicable on services?", then yes.
        // Ideally, sellers pay GST on fees. 
        // And they collect GST from customers (included in Selling Price).
        // The Input says "GST Rate (%)" and "Include GST in calculation".
        // Usually this means: "Deduct the GST component from the selling price (Output GST) and subtract Input GST?"
        // Or just simple: "What is my take home after paying GST on fees and forwarding GST on product?"

        // Simplified Indian E-commerce Profit Logic:
        // Profit = (Selling Price - GST on Product) - (Purchase Cost) - (Platform Fees + GST on Fees) - (Shipping + GST) - Packaging - Ads - Return Loss

        let gstOnProduct = 0;
        let gstOnFees = 0;
        let gstOnShipping = 0; // Assuming shipping cost input excludes GST or we verify later.
        // Let's assume user inputs "Shipping Cost" as what they pay logistics partner.

        if (gstEnabled) {
            // GST included in Selling Price? 
            // Selling Price usually includes GST. So Base Price = SP / (1 + GST/100)
            // GST Amount to Govt = SP - Base Price.
            gstOnProduct = sellingPrice - (sellingPrice / (1 + gstRate / 100));

            // GST on Service Fees (Always 18% in India for these services)
            // But user inputs might just be the raw fees.
            // Let's assume standard 18% GST on Platform Fees.
            gstOnFees = totalPlatformFees * 0.18;

            // GST on Shipping (18%)
            // Assuming 'Shipping Cost' entered is pre-tax. If post-tax, we should adjust. 
            // Let's keep it simple: assume standard logistics 18% GST added to cost.
            gstOnShipping = shippingCost * 0.18;
        }

        // 4. Advertising
        let adSpend = 0;
        if (adType === "amount") {
            adSpend = adCostAmount;
        } else {
            adSpend = cpc * clicksPerOrder;
        }

        // 5. Returns
        // Weighted Average Loss = (Profit from Success Order * Success%) - (Loss from Return Order * Return%)
        // But to keep per-order simplistic logic:
        // We deduct "Expected Loss per Order due to Returns"
        // Expected Loss = (Loss per Return * Return Rate / 100)
        const expectedReturnLoss = (returnLoss * returnRate) / 100;

        // TOTAL COSTS per order
        const totalCosts =
            purchaseCost +
            packagingCost +
            shippingCost +
            totalPlatformFees +
            gstOnProduct +
            gstOnFees +
            gstOnShipping +
            adSpend +
            expectedReturnLoss;

        const netProfit = revenue - totalCosts;
        const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
        const roi = purchaseCost > 0 ? (netProfit / purchaseCost) * 100 : 0;

        setResults({
            netProfit,
            margin,
            roi,
            totalDeductions: totalCosts,
            isLoss: netProfit < 0
        });

    }, [sellingPrice, purchaseCost, packagingCost, shippingCost, referralFeePercent, fixedFee, adType, adCostAmount, cpc, clicksPerOrder, returnRate, returnLoss, gstEnabled, gstRate]);


    // --- UI COMPONENTS ---
    // --- UI COMPONENTS ---
    // InputGroup moved outside


    return (
        <div className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-3">
            {/* LEFT COLUMN: INPUTS */}
            <div className="lg:col-span-2 space-y-8">

                {/* 1. Platform Selector */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Platform
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        {(["amazon", "flipkart", "meesho"] as Platform[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPlatform(p)}
                                className={`py-3 px-4 rounded-lg border text-sm font-medium capitalize transition-all ${platform === p
                                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-gray-400"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Product & Pricing */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Product Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup
                            label="Selling Price (inc. GST)"
                            value={sellingPrice}
                            onChange={setSellingPrice}
                            prefix="₹"
                        />
                        <InputGroup
                            label="Product Purchase Cost"
                            value={purchaseCost}
                            onChange={setPurchaseCost}
                            prefix="₹"
                            helpText="Cost of Goods Sold (including manufacturing/procurement)"
                        />
                    </div>
                </div>

                {/* 3. Fees & Logistics */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                        Fees & Logistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup
                            label={`Referral Fee (${platform})`}
                            value={referralFeePercent}
                            onChange={setReferralFeePercent}
                            suffix="%"
                            helpText="Check platform rate card for your category"
                        />
                        <InputGroup
                            label="Fixed/Closing Fee"
                            value={fixedFee}
                            onChange={setFixedFee}
                            prefix="₹"
                        />
                        <InputGroup
                            label="Shipping / Fulfilment"
                            value={shippingCost}
                            onChange={setShippingCost}
                            prefix="₹"
                        />
                        <InputGroup
                            label="Packaging Cost"
                            value={packagingCost}
                            onChange={setPackagingCost}
                            prefix="₹"
                        />
                    </div>
                </div>

                {/* 4. Marketing & Returns (Collapsible/Advanced) */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                        Marketing & Returns
                    </h2>

                    {/* Ads Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Advertising Cost</label>
                            <div className="flex rounded-md shadow-sm">
                                <button
                                    onClick={() => setAdType("amount")}
                                    className={`px-3 py-1 text-xs font-medium rounded-l-md border ${adType === "amount" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-600 border-gray-300"
                                        }`}
                                >
                                    Fixed Amount
                                </button>
                                <button
                                    onClick={() => setAdType("cpc")}
                                    className={`px-3 py-1 text-xs font-medium rounded-r-md border-t border-b border-r ${adType === "cpc" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-600 border-gray-300"
                                        }`}
                                >
                                    CPC
                                </button>
                            </div>
                        </div>
                        {adType === "amount" ? (
                            <InputGroup
                                label="Ad Cost per Order"
                                value={adCostAmount}
                                onChange={setAdCostAmount}
                                prefix="₹"
                            />
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup
                                    label="Avg CPC"
                                    value={cpc}
                                    onChange={setCpc}
                                    prefix="₹"
                                />
                                <InputGroup
                                    label="Clicks/Order"
                                    value={clicksPerOrder}
                                    onChange={setClicksPerOrder}
                                />
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup
                            label="Return/RTO Rate"
                            value={returnRate}
                            onChange={setReturnRate}
                            suffix="%"
                            helpText="Average percentage of orders returned"
                        />
                        <InputGroup
                            label="Loss per Return"
                            value={returnLoss}
                            onChange={setReturnLoss}
                            prefix="₹"
                            helpText="Reverse shipping + packaging damage + forward shipping loss"
                        />
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GST Settings</label>
                            <button
                                onClick={() => setGstEnabled(!gstEnabled)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${gstEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${gstEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        {gstEnabled && (
                            <InputGroup
                                label="Product GST Rate"
                                value={gstRate}
                                onChange={setGstRate}
                                suffix="%"
                            />
                        )}
                    </div>

                </div>
            </div>

            {/* RIGHT COLUMN: RESULTS (Sticky) */}
            <div className="lg:col-span-1">
                <div className="sticky top-20 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className={`p-6 text-center text-white ${results.isLoss ? 'bg-red-500' : 'bg-emerald-500'}`}>
                        <p className="text-sm font-medium opacity-90 mb-1">Net Profit / Order</p>
                        <div className="text-4xl font-bold">
                            {results.netProfit < 0 ? "-" : ""}₹{Math.abs(results.netProfit).toFixed(2)}
                        </div>
                        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
                            Margin: {results.margin.toFixed(2)}%
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Key Insights */}
                        <div className="space-y-3">
                            {results.netProfit < 0 && (
                                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100 flex items-start gap-2">
                                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                    You are losing money on every order. Increase selling price or reduce costs.
                                </div>
                            )}
                            {results.margin > 0 && results.margin < 10 && (
                                <div className="p-3 bg-yellow-50 text-yellow-700 text-sm rounded-md border border-yellow-100 flex items-start gap-2">
                                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                    Low margin. Any small ad spend increase could lead to loss.
                                </div>
                            )}
                            {returnRate > 10 && (
                                <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-100 flex items-start gap-2">
                                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                    High return rate is significantly eating into your profits.
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Revenue</span>
                                <span className="font-medium">₹{sellingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Deductions</span>
                                <span className="font-medium text-red-600">-₹{results.totalDeductions.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">ROI</span>
                                <span className="font-medium text-blue-600">{results.roi.toFixed(1)}%</span>
                            </div>
                        </div>

                        {/* Breakdown Button (Optional) */}
                        {/* <button className="w-full py-2 text-sm text-center text-gray-500 hover:text-gray-900">
               View Cost Breakdown
             </button> */}

                        {/* Monthly Projection */}
                        <div className="pt-6 border-t">
                            <div className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors" onClick={() => setShowMonthly(!showMonthly)}>
                                {showMonthly ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                                <span className="text-sm font-medium">Monthly Projection</span>
                            </div>

                            {showMonthly && (
                                <div className="mt-4 space-y-3 animation-fade-in">
                                    <InputGroup
                                        label="Est. Orders / Month"
                                        value={ordersPerMonth}
                                        onChange={setOrdersPerMonth}
                                    />
                                    <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Monthly Revenue</span>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">₹{(sellingPrice * ordersPerMonth).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Monthly Profit</span>
                                            <span className={`font-bold ${results.netProfit < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {results.netProfit < 0 ? "-" : ""}₹{Math.abs(results.netProfit * ordersPerMonth).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
