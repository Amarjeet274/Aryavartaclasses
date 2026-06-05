import { motion } from 'motion/react';
import { Shield, BookOpen, Target, GraduationCap } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="pt-24 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0A2540] dark:text-white mb-6">About ARYAVARTA</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Transforming the education landscape by turning idle school infrastructure into vibrant hubs of competitive learning.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="w-14 h-14 bg-[#F5A623]/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-[#F5A623]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A2540] dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To democratize access to high-quality competitive coaching by partnering with established schools, eliminating capital expenditure, and passing the benefits directly to students through affordable excellence.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="w-14 h-14 bg-[#0A2540]/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-[#0A2540] dark:text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A2540] dark:text-white mb-4">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To build India&apos;s most trusted and widespread coaching network, recognized for academic rigor, uncompromised safety, and an innovative School Infrastructure as a Service (SIaaS) model.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] dark:text-white mb-4">The ARYAVARTA Advantage</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Unmatched Trust', desc: 'Operating within established school premises provides peace of mind for parents.' },
              { icon: GraduationCap, title: 'Academic Excellence', desc: 'Expert faculty and comprehensive study materials ensure top-tier preparation.' },
              { icon: BookOpen, title: 'Innovative Model', desc: 'Our unique SIaaS approach removes high rent costs from the education equation.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto bg-[#F5A623]/10 rounded-full flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-[#F5A623]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}