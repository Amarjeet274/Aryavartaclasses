import { motion } from 'motion/react';
import { BarChart3, Users, TrendingUp, Award, Clock, Target } from 'lucide-react';
import { useState } from 'react';

export function FloatingSchoolCube() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Main 3D Cube Container */}
      <motion.div
        className="relative"
        style={{ perspective: '1200px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Cube */}
        <motion.div
          className="relative w-64 h-64"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateY: isHovered ? 45 : 0,
            rotateX: isHovered ? -15 : -10,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
        >
          <motion.div
            style={{
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateY: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {/* Front Face - School Building Facade */}
            <div
              className="absolute w-64 h-64 bg-gradient-to-br from-[#0A2540] to-[#0A2540]/80 border-2 border-accent/30 rounded-lg overflow-hidden"
              style={{
                transform: 'translateZ(132px)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="text-accent text-sm font-bold mb-4">ARYAVARTA</div>

                {/* Window Grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-8 bg-accent/20 border border-accent/40 rounded"
                      animate={{
                        backgroundColor: isHovered
                          ? ['rgba(245, 166, 35, 0.2)', 'rgba(245, 166, 35, 0.4)', 'rgba(245, 166, 35, 0.2)']
                          : 'rgba(245, 166, 35, 0.2)'
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="h-12 bg-accent/30 rounded-lg flex items-center justify-center border border-accent/50">
                    <span className="text-white text-xs font-semibold">School Building</span>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-accent/10 pointer-events-none"
                animate={{
                  opacity: isHovered ? 0.3 : 0
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Back Face */}
            <div
              className="absolute w-64 h-64 bg-gradient-to-br from-[#0A2540]/90 to-[#0A2540]/70 border-2 border-accent/20 rounded-lg"
              style={{
                transform: 'translateZ(-132px) rotateY(180deg)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-accent mx-auto mb-3" />
                  <div className="text-white font-semibold">Revenue Growth</div>
                </div>
              </div>
            </div>

            {/* Right Face - Classroom Interior */}
            <div
              className="absolute w-64 h-64 bg-gradient-to-br from-white to-gray-100 border-2 border-accent/30 rounded-lg overflow-hidden"
              style={{
                transform: 'rotateY(90deg) translateZ(132px)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="p-6 h-full">
                <div className="text-[#0A2540] text-sm font-bold mb-4">Classroom</div>

                {/* Classroom Layout */}
                <div className="mb-4">
                  {/* Blackboard */}
                  <div className="h-16 bg-[#0A2540] rounded mb-4 flex items-center justify-center">
                    <div className="text-accent text-xs font-semibold">Mathematics</div>
                  </div>

                  {/* Student Desks */}
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-10 bg-accent/60 rounded border border-accent"
                        animate={{
                          scale: isHovered ? [1, 1.05, 1] : 1
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center text-[#0A2540] text-xs mt-4">
                  <Users className="w-5 h-5 inline-block mr-1" />
                  120+ Students
                </div>
              </div>
            </div>

            {/* Left Face */}
            <div
              className="absolute w-64 h-64 bg-gradient-to-br from-[#0A2540]/80 to-[#0A2540]/60 border-2 border-accent/20 rounded-lg"
              style={{
                transform: 'rotateY(-90deg) translateZ(132px)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-16 h-16 text-accent mx-auto mb-3" />
                  <div className="text-white font-semibold">Excellence</div>
                </div>
              </div>
            </div>

            {/* Top Face */}
            <div
              className="absolute w-64 h-64 bg-gradient-to-br from-[#0A2540] to-[#0A2540]/70 border-2 border-accent/30 rounded-lg"
              style={{
                transform: 'rotateX(90deg) translateZ(132px)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="p-6 h-full flex items-center justify-center">
                <div className="text-accent text-4xl font-bold">A</div>
              </div>
            </div>

            {/* Bottom Face */}
            <div
              className="absolute w-64 h-64 bg-gradient-to-br from-[#0A2540]/60 to-[#0A2540]/40 border-2 border-accent/20 rounded-lg"
              style={{
                transform: 'rotateX(-90deg) translateZ(132px)',
                backfaceVisibility: 'hidden'
              }}
            />
          </motion.div>
        </motion.div>

        {/* Floating Holographic UI Elements */}
        <HolographicElements isHovered={isHovered} />

        {/* Glow Base */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none -z-10"
          animate={{
            scale: isHovered ? 1.3 : 1,
            opacity: isHovered ? 0.4 : 0.2
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </div>
  );
}

function HolographicElements({ isHovered }: { isHovered: boolean }) {
  const elements = [
    {
      icon: BarChart3,
      label: '₹30L',
      position: { x: -200, y: -80 },
      delay: 0
    },
    {
      icon: Users,
      label: '120',
      position: { x: 200, y: -100 },
      delay: 0.2
    },
    {
      icon: TrendingUp,
      label: '+40%',
      position: { x: -220, y: 80 },
      delay: 0.4
    },
    {
      icon: Clock,
      label: '6 Hrs',
      position: { x: 220, y: 100 },
      delay: 0.6
    },
    {
      icon: Target,
      label: '92%',
      position: { x: -180, y: 0 },
      delay: 0.8
    },
    {
      icon: Award,
      label: 'Top',
      position: { x: 200, y: 0 },
      delay: 1
    }
  ];

  return (
    <>
      {elements.map((element, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: element.position.x,
            marginTop: element.position.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0.7,
            scale: isHovered ? 1.1 : 1,
            y: [0, -15, 0]
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: element.delay
            }
          }}
        >
          <div className="relative">
            {/* Holographic Card */}
            <motion.div
              className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 border-2 border-accent/30 shadow-2xl"
              animate={{
                boxShadow: isHovered
                  ? '0 20px 60px rgba(245, 166, 35, 0.4)'
                  : '0 10px 40px rgba(245, 166, 35, 0.2)'
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                  <element.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0A2540]">{element.label}</div>
                </div>
              </div>

              {/* Connection Line to Cube */}
              <motion.div
                className="absolute w-px bg-gradient-to-b from-accent/60 to-transparent"
                style={{
                  height: '40px',
                  left: '50%',
                  top: '100%',
                  transformOrigin: 'top'
                }}
                animate={{
                  opacity: isHovered ? 0.6 : 0.3,
                  scaleY: isHovered ? 1.2 : 1
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-accent/20 rounded-xl blur-xl -z-10"
              animate={{
                opacity: isHovered ? 0.6 : 0.3,
                scale: isHovered ? 1.2 : 1
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Floating Particles */}
            {isHovered && [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-accent rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 40],
                  y: [0, (Math.random() - 0.5) * 40],
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
        </motion.div>
      ))}

      {/* Mini Chart Card */}
      <motion.div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: -60,
          marginTop: -180,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0.8,
          scale: isHovered ? 1.1 : 1,
          y: [0, -10, 0]
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
          y: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 border-2 border-accent/30 shadow-2xl w-32">
          <div className="text-xs text-[#0A2540] font-semibold mb-2">Growth</div>
          <div className="flex items-end justify-between h-12 gap-1">
            {[60, 75, 65, 85, 95].map((height, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-accent rounded-t"
                style={{ height: `${height}%` }}
                animate={{
                  scaleY: isHovered ? [1, 1.1, 1] : 1
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
