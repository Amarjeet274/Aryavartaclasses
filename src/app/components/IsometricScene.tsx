import { motion } from 'motion/react';
import { TrendingUp, Users, BarChart3, Award, CheckCircle2, Zap } from 'lucide-react';

export function IsometricScene() {
  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-white to-gray-50 overflow-hidden flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0A2540" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main 3D Scene Container */}
      <div className="relative" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
        <div style={{
          transform: 'rotateX(60deg) rotateZ(-45deg)',
          transformStyle: 'preserve-3d'
        }}>
          {/* School Building Base */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Left Side - Idle Classroom */}
            <div className="absolute left-[-250px] top-[0px]" style={{ transformStyle: 'preserve-3d' }}>
              {/* Classroom Box */}
              <div style={{ transformStyle: 'preserve-3d' }}>
                {/* Front Face */}
                <motion.div
                  className="absolute w-[200px] h-[150px] bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-gray-500 rounded-lg"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(0px)'
                  }}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                >
                  <div className="p-4 flex flex-col items-center justify-center h-full">
                    <div className="text-gray-600 text-sm mb-2 font-medium">Idle Infrastructure</div>
                    {/* Empty desks */}
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-gray-500/30 rounded" />
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">2-8 PM Unused</div>
                  </div>
                </motion.div>

                {/* Top Face */}
                <div
                  className="absolute w-[200px] h-[100px] bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-gray-600"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(90deg) translateZ(75px)',
                    transformOrigin: 'top'
                  }}
                />

                {/* Right Side Face */}
                <div
                  className="absolute w-[100px] h-[150px] bg-gradient-to-br from-gray-350 to-gray-450 border-2 border-gray-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'rotateY(90deg) translateZ(200px)',
                    transformOrigin: 'right'
                  }}
                />
              </div>

              {/* Dim Light Effect */}
              <motion.div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-900/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            {/* Center - Transformation Energy Beam */}
            <div className="absolute left-[-25px] top-[0px] z-20">
              <motion.div
                className="relative w-[50px] h-[150px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Energy Core */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-[#F5A623] via-[#F5A623]/60 to-transparent rounded-full blur-xl"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scaleY: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Digital Particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-[#F5A623] rounded-full"
                    style={{
                      left: '50%',
                      top: `${(i / 12) * 100}%`,
                    }}
                    animate={{
                      x: [0, Math.sin(i) * 30, 0],
                      y: [0, -20, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut'
                    }}
                  />
                ))}

                {/* ARYAVARTA Logo/Badge */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center border-2 border-[#F5A623] shadow-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 20px rgba(245, 166, 35, 0.3)',
                      '0 0 40px rgba(245, 166, 35, 0.6)',
                      '0 0 20px rgba(245, 166, 35, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-8 h-8 text-[#F5A623]" fill="#F5A623" />
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side - Active Classroom */}
            <div className="absolute left-[50px] top-[0px]" style={{ transformStyle: 'preserve-3d' }}>
              {/* Classroom Box */}
              <div style={{ transformStyle: 'preserve-3d' }}>
                {/* Front Face */}
                <motion.div
                  className="absolute w-[200px] h-[150px] bg-gradient-to-br from-[#0A2540] to-[#0A2540]/90 border-2 border-[#F5A623] rounded-lg"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(0px)',
                    boxShadow: '0 10px 40px rgba(245, 166, 35, 0.3)'
                  }}
                  animate={{
                    boxShadow: [
                      '0 10px 40px rgba(245, 166, 35, 0.3)',
                      '0 10px 60px rgba(245, 166, 35, 0.5)',
                      '0 10px 40px rgba(245, 166, 35, 0.3)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="p-4 flex flex-col items-center justify-center h-full relative overflow-hidden">
                    <div className="text-[#F5A623] text-sm mb-2 font-bold">Active Coaching</div>

                    {/* Active students - animated */}
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-6 h-6 bg-[#F5A623]/80 rounded"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>

                    {/* Teacher icon */}
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#0A2540]" />
                    </div>

                    <div className="mt-2 text-xs text-white/80">120+ Students</div>

                    {/* Energy particles inside */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-[#F5A623] rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Top Face */}
                <div
                  className="absolute w-[200px] h-[100px] bg-gradient-to-br from-[#0A2540] to-[#0A2540]/80 border-2 border-[#F5A623]/50"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(90deg) translateZ(75px)',
                    transformOrigin: 'top'
                  }}
                />

                {/* Right Side Face */}
                <div
                  className="absolute w-[100px] h-[150px] bg-gradient-to-br from-[#0A2540]/90 to-[#0A2540] border-2 border-[#F5A623]/50"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'rotateY(90deg) translateZ(200px)',
                    transformOrigin: 'right'
                  }}
                />
              </div>

              {/* Bright Light Effect */}
              <motion.div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#F5A623]/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            {/* Floating UI Elements - Right Side */}
            <FloatingDashboardElements />
          </motion.div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="text-gray-600 font-semibold mb-1">Problem</div>
          <div className="text-sm text-gray-500">Idle Infrastructure</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="text-[#F5A623] font-bold mb-1">ARYAVARTA</div>
          <div className="text-sm text-gray-600">Transformation</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <div className="text-[#0A2540] font-semibold mb-1">Solution</div>
          <div className="text-sm text-gray-600">Active Coaching</div>
        </motion.div>
      </div>
    </div>
  );
}

function FloatingDashboardElements() {
  const elements = [
    {
      icon: TrendingUp,
      label: 'Revenue ₹30L+',
      delay: 1,
      position: { x: 320, y: -40 }
    },
    {
      icon: Users,
      label: '120 Students',
      delay: 1.2,
      position: { x: 340, y: 40 }
    },
    {
      icon: BarChart3,
      label: '92% Attendance',
      delay: 1.4,
      position: { x: 300, y: 120 }
    },
    {
      icon: Award,
      label: '85% Avg Score',
      delay: 1.6,
      position: { x: 340, y: 180 }
    }
  ];

  return (
    <>
      {elements.map((element, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-xl border border-[#F5A623]/20"
          style={{
            left: element.position.x,
            top: element.position.y,
            transform: 'rotateX(-60deg) rotateZ(45deg)'
          }}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0]
          }}
          transition={{
            opacity: { delay: element.delay, duration: 0.5 },
            scale: { delay: element.delay, duration: 0.5 },
            y: {
              delay: element.delay + 0.5,
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        >
          <div className="flex items-center gap-2">
            <element.icon className="w-4 h-4 text-[#F5A623]" />
            <span className="text-xs font-semibold text-[#0A2540] whitespace-nowrap">
              {element.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Performance Chart Card */}
      <motion.div
        className="absolute bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-xl border border-[#F5A623]/20"
        style={{
          left: 280,
          top: -100,
          transform: 'rotateX(-60deg) rotateZ(45deg)',
          width: 120
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -8, 0]
        }}
        transition={{
          opacity: { delay: 1.8, duration: 0.5 },
          scale: { delay: 1.8, duration: 0.5 },
          y: {
            delay: 2.3,
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
      >
        <div className="text-xs font-semibold text-[#0A2540] mb-2">Growth</div>
        <div className="flex items-end justify-between h-8 gap-1">
          {[40, 55, 48, 70, 85].map((height, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-[#F5A623] rounded-t"
              style={{ height: `${height}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 2 + i * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Checkmark Success Badge */}
      <motion.div
        className="absolute bg-gradient-to-br from-green-500 to-green-600 rounded-full p-2 shadow-xl"
        style={{
          left: 380,
          top: 80,
          transform: 'rotateX(-60deg) rotateZ(45deg)'
        }}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0
        }}
        transition={{ delay: 2, duration: 0.6, type: 'spring' }}
      >
        <CheckCircle2 className="w-5 h-5 text-white" />
      </motion.div>
    </>
  );
}
