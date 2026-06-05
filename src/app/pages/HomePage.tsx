import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Building2, Users, TrendingUp, Shield, Rocket, BookOpen, Award, Target,
  ChevronRight, Menu, X, BarChart3, GraduationCap, School, Zap, Lock,
  Globe, CheckCircle2, ArrowRight, IndianRupee, Sparkles, LogIn,
} from 'lucide-react';
import { FloatingSchoolCube } from '../components/FloatingSchoolCube';

import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/Navbar';

// Brand colors
// Deep Blue: #0A2540
// Gold:      #F5A623

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Outlet />
    </div>
  );
}

/* ─────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="pt-16">

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 min-h-screen flex items-center">
        {/* Dot background */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #0A2540 1.5px, transparent 0)`,
          backgroundSize: '36px 36px',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left content */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/30 rounded-full mb-6 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  School Infrastructure as a Service
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0A2540] mb-6 leading-tight"
              >
                Transform Idle Schools into
                <span className="text-[#F5A623] block mt-2">Revenue Engines</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-500 mb-8 leading-relaxed max-w-lg"
              >
                Zero capex coaching centers powered by school infrastructure. Generate ₹30L+ annual revenue from unused classrooms.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <a
                  href="#partner"
                  className="px-8 py-4 bg-[#0A2540] text-white rounded-xl hover:bg-[#0d2e54] transition-all inline-flex items-center gap-2 justify-center shadow-lg hover:shadow-xl font-semibold"
                >
                  Partner with Us
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="#model"
                  className="px-8 py-4 bg-white text-[#0A2540] border-2 border-[#0A2540] rounded-xl hover:bg-[#0A2540]/5 transition-all inline-flex items-center gap-2 justify-center font-semibold"
                >
                  Explore Model
                  <ArrowRight className="w-5 h-5" />
                </a>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { value: '₹30L+', label: 'Revenue/Center', gold: true },
                  { value: 'Zero', label: 'Capex Required', gold: false },
                  { value: '120+', label: 'Students/Center', gold: true },
                  { value: '40%', label: 'Profit Share', gold: false },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`text-3xl font-bold mb-1 ${stat.gold ? 'text-[#F5A623]' : 'text-[#0A2540]'}`}>{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - 3D Floating Cube */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <FloatingSchoolCube />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-4">The Education Infrastructure Gap</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Three critical problems creating opportunity</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: School, title: 'Idle School Infrastructure', desc: 'School buildings sit empty 2–8 PM daily, representing massive underutilized assets' },
              { icon: Building2, title: 'Coaching Rent Burden', desc: 'Coaching institutes spend 30–40% revenue on prime location real estate costs' },
              { icon: Shield, title: 'Parent Trust Deficit', desc: 'Parents seek safe, credible learning environments with institutional backing' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-[#F5A623]/10 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-[#F5A623]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A2540] mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution Section – SIaaS Model ── */}
      <section id="model" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/30 rounded-full mb-4 text-sm font-semibold">
              Our Solution
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-4">School Infrastructure as a Service</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">Revolutionary partnership model eliminating capex while maximizing trust and scale</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#0A2540] to-[#1a4070] p-10 rounded-2xl text-white">
              <h3 className="text-3xl font-bold mb-6">For Schools</h3>
              <ul className="space-y-4">
                {[
                  'Zero capital investment required',
                  'Extra revenue from idle infrastructure',
                  'Enhanced brand value in community',
                  'No operational responsibility',
                  '20–40% revenue sharing tiers',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#F5A623] flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#F5A623] to-[#e09512] p-10 rounded-2xl text-white">
              <h3 className="text-3xl font-bold mb-6">For ARYAVARTA</h3>
              <ul className="space-y-4">
                {[
                  'Zero real estate capex',
                  'Instant credibility via school brand',
                  'Fast geographic expansion',
                  'Lower operational risk',
                  'High-trust parent acquisition',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Operating Model ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-4">Operating Model</h2>
            <p className="text-xl text-gray-500">Clear division of responsibilities</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-[#0A2540] mb-6 flex items-center gap-3">
                <School className="w-8 h-8 text-[#F5A623]" />
                School Provides
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Building2, text: 'Classrooms & infrastructure (2–8 PM)' },
                  { icon: Shield, text: 'Brand credibility & trust' },
                  { icon: Users, text: 'Initial student outreach support' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <item.icon className="w-6 h-6 text-[#F5A623]" />
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-[#0A2540] mb-6 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-[#F5A623]" />
                ARYAVARTA Provides
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Target, text: 'Complete academic curriculum' },
                  { icon: Users, text: 'Faculty recruitment & training' },
                  { icon: Rocket, text: 'Marketing & admissions' },
                  { icon: BarChart3, text: 'Operations & analytics' },
                  { icon: BookOpen, text: 'Study materials & technology' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <item.icon className="w-6 h-6 text-[#F5A623]" />
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Revenue Sharing Tiers ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-4">Revenue Sharing Tiers</h2>
            <p className="text-xl text-gray-500">No fixed rent • Higher profitability • Aligned incentives</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-end">
            {[
              { tier: 'Tier 1', share: '20%', students: '50–80', revenue: '₹10–15L', desc: 'Smaller schools, emerging areas', featured: false },
              { tier: 'Tier 2', share: '30%', students: '80–120', revenue: '₹20–30L', desc: 'Medium schools, suburban areas', featured: true },
              { tier: 'Tier 3', share: '40%', students: '120+', revenue: '₹30L+', desc: 'Premium schools, prime locations', featured: false },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-8 rounded-2xl border-2 transition-all ${
                  item.featured
                    ? 'border-[#F5A623] bg-gradient-to-br from-[#0A2540] to-[#1a4070] text-white scale-105 shadow-2xl shadow-[#0A2540]/20'
                    : 'border-gray-200 bg-white hover:border-[#F5A623]/40 hover:shadow-lg'
                }`}
              >
                {item.featured && (
                  <div className="text-center mb-2">
                    <span className="inline-block px-3 py-1 bg-[#F5A623] text-white text-xs font-bold rounded-full uppercase tracking-wide">Most Popular</span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="text-sm font-semibold text-[#F5A623] mb-2">{item.tier}</div>
                  <div className={`text-5xl font-bold mb-2 ${item.featured ? 'text-[#F5A623]' : 'text-[#0A2540]'}`}>{item.share}</div>
                  <div className={item.featured ? 'text-white/70' : 'text-gray-500'}>to School</div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className={`flex justify-between py-2 border-t ${item.featured ? 'border-white/20' : 'border-gray-200'}`}>
                    <span className={item.featured ? 'text-white/70' : 'text-gray-500'}>Students</span>
                    <span className={`font-semibold ${item.featured ? 'text-white' : 'text-gray-800'}`}>{item.students}</span>
                  </div>
                  <div className={`flex justify-between py-2 border-t ${item.featured ? 'border-white/20' : 'border-gray-200'}`}>
                    <span className={item.featured ? 'text-white/70' : 'text-gray-500'}>Annual Revenue</span>
                    <span className={`font-semibold ${item.featured ? 'text-white' : 'text-gray-800'}`}>{item.revenue}</span>
                  </div>
                  <div className={`pt-3 text-center ${item.featured ? 'text-white/60' : 'text-gray-400'}`}>{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Profit Example ── */}
      <section className="py-24 bg-gradient-to-br from-[#0A2540] to-[#1a4070]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Real Profit Example</h2>
            <p className="text-xl text-white/70">Tier 2 School – Medium Size Center</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-white/70 mb-2 text-sm">Total Students</div>
                <div className="text-4xl font-bold text-white">120</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-white/70 mb-2 text-sm">Fee per Student</div>
                <div className="text-4xl font-bold text-[#F5A623]">₹25,000</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-4 border-b border-white/20">
                <span className="text-white text-lg">Gross Revenue</span>
                <span className="text-2xl font-bold text-white">₹30,00,000</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/20">
                <span className="text-white/70">School Share (30%)</span>
                <span className="text-xl font-semibold text-[#F5A623]">₹9,00,000</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/20">
                <span className="text-white/70">Operating Costs</span>
                <span className="text-xl font-semibold text-white/90">₹12,00,000</span>
              </div>
              <div className="flex justify-between items-center py-6 bg-[#F5A623]/20 border border-[#F5A623]/40 rounded-xl px-6">
                <span className="text-white font-bold text-xl">Net Profit (ARYAVARTA)</span>
                <span className="text-3xl font-bold text-[#F5A623]">₹9,00,000</span>
              </div>
            </div>

            <div className="text-center text-white/60 text-sm">
              30% profit margin • Scalable model • Low overhead
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-4">Why Better Than Traditional Coaching</h2>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <table className="w-full">
              <thead className="bg-[#0A2540] text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">Factor</th>
                  <th className="py-4 px-6 text-left font-semibold">Traditional Coaching</th>
                  <th className="py-4 px-6 text-left font-semibold bg-[#F5A623]">ARYAVARTA Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { factor: 'Capex', traditional: '₹50L – ₹2Cr', aryavarta: 'Zero' },
                  { factor: 'Monthly Rent', traditional: '₹2–5L fixed', aryavarta: 'Revenue share only' },
                  { factor: 'Expansion Risk', traditional: 'Very High', aryavarta: 'Low' },
                  { factor: 'Trust Factor', traditional: 'Self-built', aryavarta: 'School brand leverage' },
                  { factor: 'Scale Speed', traditional: '2–3 centers/year', aryavarta: '10+ centers/year' },
                  { factor: 'Parent Confidence', traditional: 'Medium', aryavarta: 'High (school backing)' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-800">{row.factor}</td>
                    <td className="py-4 px-6 text-gray-500">{row.traditional}</td>
                    <td className="py-4 px-6 bg-[#F5A623]/5 font-semibold text-[#0A2540]">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                        {row.aryavarta}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Scalability Roadmap ── */}
      <section id="roadmap" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-4">Scalability Roadmap</h2>
            <p className="text-xl text-gray-500">From pilot to pan-India franchise</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#F5A623]/20 -translate-x-1/2 hidden lg:block" />

            <div className="space-y-12">
              {[
                { phase: 'Phase 1', title: 'Pilot', timeline: 'Month 1–6', desc: 'Launch 2–3 schools in one city, prove model economics, refine operations' },
                { phase: 'Phase 2', title: 'Replication', timeline: 'Month 7–18', desc: 'Scale to 15–20 schools, standardize playbook, build tech platform' },
                { phase: 'Phase 3', title: 'City Cluster', timeline: 'Year 2–3', desc: 'Expand to 5 cities, establish regional teams, centralize academics' },
                { phase: 'Phase 4', title: 'Franchise', timeline: 'Year 3+', desc: 'Launch franchise model, white-label offering, pan-India presence' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`lg:grid lg:grid-cols-2 gap-8 items-center`}
                >
                  <div className={idx % 2 === 0 ? 'lg:text-right' : 'lg:col-start-2'}>
                    <div className="inline-block px-4 py-2 bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/30 rounded-full mb-4 text-sm font-semibold">
                      {item.phase}
                    </div>
                    <h3 className="text-3xl font-bold text-[#0A2540] mb-2">{item.title}</h3>
                    <div className="text-gray-400 mb-4 font-medium">{item.timeline}</div>
                    <p className="text-lg text-gray-700">{item.desc}</p>
                  </div>
                  <div className={`hidden lg:block ${idx % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'}`}>
                    <div className="w-16 h-16 bg-[#F5A623] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#F5A623]/30">
                      <span className="text-2xl font-bold text-white">{idx + 1}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Competitive Moat ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-4">Competitive Moat</h2>
            <p className="text-xl text-gray-500">Defensible advantages at scale</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'Central Academic System', desc: 'Standardized curriculum, recorded lectures, quality consistency across centers' },
              { icon: Zap, title: 'Tech Platform', desc: 'Proprietary CRM, LMS, analytics dashboard for operational excellence' },
              { icon: Users, title: 'Faculty Network', desc: 'Shared teacher pool, training academy, reduced dependency on local hiring' },
              { icon: Award, title: 'Result Branding', desc: 'Aggregate student performance creates brand value exceeding individual schools' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 bg-[#F5A623]/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#F5A623]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Additional Revenue Streams ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-4">Additional Revenue Streams</h2>
            <p className="text-xl text-gray-500">Diversified income beyond regular batches</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Olympiad Batches', amount: '₹2–3L/center' },
              { icon: BookOpen, title: 'Test Series', amount: '₹1–2L/center' },
              { icon: Target, title: 'Scholarship Exams', amount: '₹3–4L/center' },
              { icon: Users, title: 'Teacher Training', amount: '₹5–8L annually' },
              { icon: Globe, title: 'White-label Coaching', amount: '₹10–15L per deal' },
              { icon: TrendingUp, title: 'EdTech Partnerships', amount: '₹5–10L annually' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-[#F5A623]/40 hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 bg-[#0A2540] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F5A623] transition-colors">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0A2540] mb-2">{item.title}</h3>
                <div className="text-2xl font-bold text-[#F5A623]">{item.amount}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Risk & Mitigation ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] mb-4">Risk & Mitigation</h2>
            <p className="text-xl text-gray-500">Proactive strategies for business continuity</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { risk: 'School Exit Risk', solution: '3–5 year contract lock-in, renewal incentives, diversified portfolio of 20+ schools' },
              { risk: 'Faculty Quality', solution: 'Recorded video lectures, central training academy, backup faculty pool' },
              { risk: 'Brand Dilution', solution: 'Strict quality standards, mystery audits, minimum performance thresholds' },
              { risk: 'Over-expansion', solution: 'Cluster-based growth strategy, city-level saturation before new markets' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-2">{item.risk}</h3>
                    <div className="flex items-start gap-3 mt-3">
                      <CheckCircle2 className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{item.solution}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="partner" className="scroll-mt-28 py-24 bg-gradient-to-br from-[#0A2540] to-[#1a4070]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Join the Future of Coaching</h2>
            <p className="text-xl text-white/70 mb-12">Transform education infrastructure into profitable business</p>

            <div className="grid sm:grid-cols-3 gap-6">
              <Link
                to="/school-partnership"
                className="bg-white p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-2 border-transparent hover:border-[#F5A623]/30"
              >
                <School className="w-12 h-12 text-[#F5A623] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0A2540] mb-2">Partner as School</h3>
                <p className="text-gray-500 mb-4 text-sm">Monetize idle infrastructure</p>
                <span className="text-[#F5A623] font-semibold group-hover:underline">Apply Now →</span>
              </Link>

              <Link
                to="/faculty-application"
                className="bg-white p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-2 border-transparent hover:border-[#F5A623]/30"
              >
                <Users className="w-12 h-12 text-[#F5A623] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0A2540] mb-2">Join as Faculty</h3>
                <p className="text-gray-500 mb-4 text-sm">Teach at premium centers</p>
                <span className="text-[#F5A623] font-semibold group-hover:underline">Apply Now →</span>
              </Link>

              <Link
                to="/student-enrollment"
                className="bg-white p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-2 border-transparent hover:border-[#F5A623]/30"
              >
                <GraduationCap className="w-12 h-12 text-[#F5A623] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0A2540] mb-2">Enroll as Student</h3>
                <p className="text-gray-500 mb-4 text-sm">Quality education, trusted environment</p>
                <span className="text-[#F5A623] font-semibold group-hover:underline">Enroll Now →</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0A2540] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-[#F5A623] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-wide">ARYAVARTA</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">Transforming education infrastructure into scalable business</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-[#F5A623] transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="hover:text-[#F5A623] transition-colors text-sm">Our Model</a></li>
                <li><a href="#" className="hover:text-[#F5A623] transition-colors text-sm">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Partners</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-[#F5A623] transition-colors text-sm">Schools</a></li>
                <li><a href="#" className="hover:text-[#F5A623] transition-colors text-sm">Faculty</a></li>
                <li><a href="#" className="hover:text-[#F5A623] transition-colors text-sm">Investors</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>info@aryavarta.edu</li>
                <li>+91 0000000000</li>
                <li>Uttar Pradesh, India</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
            © 2026 ARYAVARTA Coaching Chain. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────
   DASHBOARD VIEW
───────────────────────────────────────── */
export function DashboardView() {
  const features = [
    {
      title: "SIaaS Model",
      description: "Our revolutionary School Infrastructure as a Service partnership model that eliminates capex while maximizing trust.",
      icon: School,
      link: "/dashboard/models",
      linkText: "View Model Details",
      iconBg: "bg-[#F5A623]/10 dark:bg-[#F5A623]/20",
      iconColor: "text-[#F5A623]",
      hoverBg: "group-hover:bg-[#F5A623]",
    },
    {
      title: "Scalability Roadmap",
      description: "Explore our strategic expansion plan and the multi-phase roadmap designed to scale our operations globally.",
      icon: Rocket,
      link: "/dashboard/roadmap",
      linkText: "View Roadmap",
      iconBg: "bg-[#0A2540]/10 dark:bg-white/10",
      iconColor: "text-[#0A2540] dark:text-white",
      hoverBg: "group-hover:bg-[#0A2540] dark:group-hover:bg-white/20",
    },
    {
      title: "Complete Academic Curriculum",
      description: "End-to-end curriculum design, study materials, and academic planning tailored for competitive exams.",
      icon: Target,
      iconBg: "bg-purple-50 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Faculty Recruitment & Training",
      description: "Rigorous vetting and continuous development programs to ensure top-tier teaching quality across all centers.",
      icon: Users,
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Marketing & Admissions",
      description: "Data-driven marketing strategies and centralized admissions management for optimal enrollment.",
      icon: TrendingUp,
      iconBg: "bg-pink-50 dark:bg-pink-900/30",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "Operations & Analytics",
      description: "Real-time performance tracking, attendance monitoring, and comprehensive operational analytics.",
      icon: BarChart3,
      iconBg: "bg-green-50 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Study Materials & Tech",
      description: "State-of-the-art learning management systems and proprietary study materials for all students.",
      icon: BookOpen,
      iconBg: "bg-indigo-50 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Brand Credibility & Trust",
      description: "Leverage established school infrastructure for instant community trust and a secure learning environment.",
      icon: Shield,
      iconBg: "bg-orange-50 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#0A2540] dark:text-white mb-4">ARYAVARTA Platform Features</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Explore the core features and models that power our School Infrastructure as a Service.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const CardWrapper = feature.link ? Link : 'div';
            return (
              <CardWrapper
                key={idx}
                to={feature.link || ''}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-all group ${
                  feature.link ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${feature.iconBg} ${feature.hoverBg || ''}`}>
                  <feature.icon className={`w-6 h-6 transition-colors ${feature.iconColor} ${feature.link ? 'group-hover:text-white' : ''}`} />
                </div>
                <h2 className="text-xl font-bold text-[#0A2540] dark:text-white mb-2">{feature.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{feature.description}</p>
                
                {feature.link && (
                  <span className="text-[#F5A623] text-sm font-semibold flex items-center gap-1 mt-auto">
                    {feature.linkText} <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}
