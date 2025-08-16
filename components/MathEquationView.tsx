import React from 'react';

// A helper for variables with subscripts
const Var = ({ name, sub, overline }: { name: string; sub?: string; overline?: boolean }) => (
    <span className="font-mono italic text-fuchsia-300 dark:text-fuchsia-300">
        {overline ? <span className="border-t-2 border-current">{name}</span> : name}
        {sub && <sub className="text-teal-400 dark:text-teal-300 not-italic ml-0.5">{sub}</sub>}
    </span>
);

// A helper for operators and constants
const Op = ({ children }: { children: React.ReactNode }) => <span className="mx-2 text-cyan-400 dark:text-cyan-300 font-sans">{children}</span>;

// A helper for fractions
const Frac = ({ num, den }: { num: React.ReactNode; den: React.ReactNode }) => (
    <span className="inline-flex flex-col items-center mx-2 font-mono italic text-fuchsia-300 dark:text-fuchsia-300">
        <span className="px-1">{num}</span>
        <span className="w-full border-t-2 border-cyan-400 dark:border-cyan-300"></span>
        <span className="px-1">{den}</span>
    </span>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-6 border-b border-gray-700 last:border-b-0">
        <h3 className="text-xl font-bold text-gray-100 mb-4">{title}</h3>
        {children}
    </div>
);

export const MathEquationView: React.FC = () => {
    return (
        <div className="bg-gray-800 text-gray-200 rounded-xl shadow-2xl p-6 sm:p-10 animate-fade-in-fast border border-gray-700 font-sans">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-6">
                AI-Generated Post Performance Model
            </h2>

            <Section title="1. Core Metrics for AI-Generated Post">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                    <p><Var name="V" /> <Op>=</Op> Total Views</p>
                    <p><Var name="Rch" /> <Op>=</Op> Reach</p>
                    <p><Var name="E" /> <Op>=</Op> Earnings</p>
                    <p><Var name="Eng" /> <Op>=</Op> Engagement</p>
                    <p><Var name="T" sub="avg" /> <Op>=</Op> Avg. Watch Time</p>
                    <p><Var name="V" sub="3s" /> <Op>=</Op> 3-sec Views</p>
                    <p><Var name="V" sub="1m" /> <Op>=</Op> 1-min Views</p>
                    <p><Var name="V" sub="pp" overline /> <Op>=</Op> Avg. Views/Viewer</p>
                    <p>Δ<Var name="V" /> <Op>=</Op> View Growth</p>
                    <p><Var name="Q" sub="ai" /> <Op>=</Op> Content Quality</p>
                </div>
            </Section>

            <Section title="2. Unified Performance Function">
                <div className="text-lg flex flex-wrap items-center justify-center bg-black/20 p-4 rounded-lg">
                    <Var name="P" sub="AI" /> <Op>=</Op>
                    <span className="text-yellow-300">α</span><Op>·</Op><Frac num={<Var name="V"/>} den={<Var name="Rch" />} /> <Op>+</Op>
                    <span className="text-yellow-300">β</span><Op>·</Op><Frac num={<Var name="Eng"/>} den={<Var name="V" />} /> <Op>+</Op>
                    <span className="text-yellow-300">γ</span><Op>·</Op><Frac num={<Var name="T" sub="avg"/>} den={<Var name="T" sub="max" />} /> <Op>+</Op>
                    <span className="text-yellow-300">δ</span><Op>·</Op>Δ<Var name="V" /> <Op>+</Op>
                    <span className="text-yellow-300">ε</span><Op>·</Op><Var name="Q" sub="ai" />
                </div>
                <p className="text-xs text-center mt-2 text-gray-400">Where α, β, γ, δ, ε are tunable weight coefficients.</p>
            </Section>

            <Section title="3. Expanded Component Equations">
                <div className="space-y-4">
                    <div className="flex items-center justify-center"><Frac num={<Var name="Eng"/>} den={<Var name="V" />} /> <Op>=</Op> Engagement per View</div>
                    <div className="flex items-center justify-center"><Var name="D" sub="attn" /> <Op>=</Op> <Frac num={<Var name="V" sub="1m" />} den={<Var name="V" sub="3s" />} /> <Op>=</Op> Attention Depth</div>
                    <div className="flex items-center justify-center"><Var name="R" sub="f" /> <Op>=</Op> <Var name="V" sub="pp" overline /> <Op>-</Op> 1 <Op>=</Op> Replay Factor</div>
                    <div className="flex flex-wrap items-center justify-center">
                        <Var name="Q" sub="ai" /> <Op>=</Op>
                        <span className="text-yellow-300">η</span><sub>1</sub><Var name="C" sub="oh"/> <Op>+</Op>
                        <span className="text-yellow-300">η</span><sub>2</sub><Var name="C" sub="re"/> <Op>+</Op>
                        <span className="text-yellow-300">η</span><sub>3</sub><Var name="E" sub="th"/>
                    </div>
                </div>
            </Section>
            
            <Section title="4. Final Injected Master Equation">
                 <div className="text-lg flex flex-wrap items-center justify-center bg-black/20 p-4 rounded-lg">
                    <Var name="P" sub="AI" /> <Op>=</Op>
                    <span className="text-yellow-300">α</span><Frac num={<Var name="V"/>} den={<Var name="Rch" />} /> <Op>+</Op>
                    <span className="text-yellow-300">β</span><Frac num={<Var name="Eng"/>} den={<Var name="V" />} /> <Op>+</Op>
                    <span className="text-yellow-300">γ</span><Frac num={<Var name="T" sub="avg"/>} den={<Var name="T" sub="max" />} /> <Op>+</Op>
                    <span className="text-yellow-300">δ</span>Δ<Var name="V" /> <Op>+</Op>
                    <span className="text-yellow-300">ε</span>(<span className="text-yellow-300">η</span><sub>1</sub><Var name="C" sub="oh"/> <Op>+</Op> <span className="text-yellow-300">η</span><sub>2</sub><Var name="C" sub="re"/> <Op>+</Op> <span className="text-yellow-300">η</span><sub>3</sub><Var name="E" sub="th"/>) <Op>+</Op>
                    <span className="text-yellow-300">ζ</span><Var name="D" sub="attn" /> <Op>+</Op>
                    <span className="text-yellow-300">θ</span><Var name="R" sub="f" />
                </div>
            </Section>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                <p className="text-green-300">
                    <span className="font-bold">✅ This transforms the raw social dashboard into a scientific symbolic AI-post performance equation with an injected AI quality factor.</span>
                </p>
                <p className="text-sm text-green-400/80 mt-2">
                    This model provides a framework for optimizing AI-generated content by quantifying its quality and impact on key performance indicators.
                </p>
            </div>
        </div>
    );
};
