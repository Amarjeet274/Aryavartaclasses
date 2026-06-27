import { CheckCircle2, School, Building2, Shield, Users, GraduationCap, Target, Rocket, BarChart3, BookOpen, Award } from 'lucide-react';
import { motion } from 'motion/react';

export function ModelsPage() {
  return (
    <div className="pt-24 min-h-screen bg-white dark:bg-gray-900 transition-colors">
            {/* ── Operating Model ── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] dark:text-white mb-4">Operating Model</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Clear division of responsibilities</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-2xl font-bold text-[#0A2540] dark:text-white mb-6 flex items-center gap-3">
                <School className="w-8 h-8 text-[#F5A623]" />
                School Provides
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Building2, text: 'Classrooms & infrastructure (2–8 PM)' },
                  { icon: Shield, text: 'Brand credibility & trust' },
                  { icon: Users, text: 'Initial student outreach support' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <item.icon className="w-6 h-6 text-[#F5A623]" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-2xl font-bold text-[#0A2540] dark:text-white mb-6 flex items-center gap-3">
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
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <item.icon className="w-6 h-6 text-[#F5A623]" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-2xl font-bold text-[#0A2540] dark:text-white mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-[#F5A623]" />
                Students Receive
              </h3>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, text: 'Premium competitive coaching' },
                  { icon: Shield, text: 'Safe, known learning environment' },
                  { icon: Target, text: 'Personalized doubt solving' },
                  { icon: BarChart3, text: 'Performance tracking apps' },
                  { icon: Award, text: 'Scholarships and rewards' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <item.icon className="w-6 h-6 text-[#F5A623]" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solution Section – SIaaS Model ── */}
      <section id="model" className="py-12 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/30 rounded-full mb-4 text-sm font-semibold">
              Our Solution
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] dark:text-white mb-4">School Infrastructure as a Service</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">Revolutionary partnership model eliminating capex while maximizing trust and scale</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#0A2540] to-[#1a4070] dark:from-[#0A2540] dark:to-[#0A2540] p-10 rounded-2xl text-white">
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

            <div className="bg-gradient-to-br from-[#F5A623] to-[#e09512] dark:from-[#D48911] dark:to-[#B6730A] p-10 rounded-2xl text-white">
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

            <div className="bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] dark:from-[#1e3a8a] dark:to-[#1e3a8a] p-10 rounded-2xl text-white">
              <h3 className="text-3xl font-bold mb-6">For Students</h3>
              <ul className="space-y-4">
                {[
                  'Top-tier faculty in familiar environment',
                  'Zero travel time to coaching centers',
                  'Safe and secure school campus',
                  'Comprehensive study materials',
                  'Regular assessments and analytics',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#F5A623] flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* ── Revenue Sharing Tiers ── */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] dark:text-white mb-4">Revenue Sharing Tiers</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">No fixed rent • Higher profitability • Aligned incentives</p>
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
                    ? 'border-[#F5A623] bg-gradient-to-br from-[#0A2540] to-[#1a4070] text-white scale-105 shadow-2xl shadow-[#0A2540]/20 dark:from-[#0A2540] dark:to-[#153457]'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#F5A623]/40 hover:shadow-lg'
                }`}
              >
                {item.featured && (
                  <div className="text-center mb-2">
                    <span className="inline-block px-3 py-1 bg-[#F5A623] text-white text-xs font-bold rounded-full uppercase tracking-wide">Most Popular</span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="text-sm font-semibold text-[#F5A623] mb-2">{item.tier}</div>
                  <div className={`text-5xl font-bold mb-2 ${item.featured ? 'text-[#F5A623]' : 'text-[#0A2540] dark:text-white'}`}>{item.share}</div>
                  <div className={item.featured ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}>to School</div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className={`flex justify-between py-2 border-t ${item.featured ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <span className={item.featured ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}>Students</span>
                    <span className={`font-semibold ${item.featured ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>{item.students}</span>
                  </div>
                  <div className={`flex justify-between py-2 border-t ${item.featured ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <span className={item.featured ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}>Annual Revenue</span>
                    <span className={`font-semibold ${item.featured ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>{item.revenue}</span>
                  </div>
                  <div className={`pt-3 text-center ${item.featured ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}