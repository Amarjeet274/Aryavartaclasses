import { motion } from 'motion/react';

export function RoadmapPage() {
  return (
    <div className="pt-24 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* ── Scalability Roadmap ── */}
      <section id="roadmap" className="py-12 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A2540] dark:text-white mb-4">Scalability Roadmap</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">From pilot to pan-India franchise</p>
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
                    <h3 className="text-3xl font-bold text-[#0A2540] dark:text-white mb-2">{item.title}</h3>
                    <div className="text-gray-400 dark:text-gray-500 mb-4 font-medium">{item.timeline}</div>
                    <p className="text-lg text-gray-700 dark:text-gray-300">{item.desc}</p>
                  </div>
                  <div className={`hidden lg:block ${idx % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'}`}>
                    <div className="w-16 h-16 bg-[#F5A623] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#F5A623]/30 dark:shadow-[#F5A623]/10">
                      <span className="text-2xl font-bold text-white">{idx + 1}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}