/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  ShieldAlert, 
  Package, 
  ShieldCheck, 
  Star, 
  Sun, 
  XCircle, 
  MessageCircle, 
  Clock, 
  Zap, 
  TrendingUp, 
  Search, 
  Share2, 
  RotateCcw, 
  Skull,
  User,
  Activity,
  Heart,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  Trophy,
  Gamepad2,
  Backpack,
  ScrollText,
  Flame,
  ZapOff,
  Coins,
  History,
  Users
} from 'lucide-react';

// --- Types ---

interface GameMetric {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

interface LogEntry {
  id: string;
  time: string;
  content: string;
  type: 'positive' | 'negative' | 'neutral';
}

interface InteractionProp {
  id: string;
  name: string;
  score: number;
  type: 'buff' | 'debuff';
  icon: string | React.ReactNode;
  anim: string;
  desc: string;
  log: string;
}

// --- Constants ---

const BUFF_PROPS: InteractionProp[] = [
  { id: 'tea', name: '请团队喝奶茶', score: 5, type: 'buff', icon: '🧋', anim: 'happy', desc: '+5 营养', log: '阿翘获得情绪价值补给' },
  { id: 'coffee', name: '请喝咖啡', score: 3, type: 'buff', icon: '☕', anim: 'happy', desc: '+3 活力', log: '团队满意度提升' },
  { id: 'shield', name: '阻拦老板开周会', score: 15, type: 'buff', icon: '🛡️', anim: 'hero', desc: '+15 功德', log: '功德+10' },
  { id: 'resource', name: '帮团队争资源', score: 12, type: 'buff', icon: '🎁', anim: 'power', desc: '+12 资源', log: '资源包到账' },
  { id: 'scapegoat', name: '主动背锅', score: 20, type: 'buff', icon: '⭐', anim: 'hero', desc: '+20 安全感', log: '团队安全感+20' },
  { id: 'early', name: '提前下班', score: 8, type: 'buff', icon: '🌇', anim: 'sunset', desc: '+8 幸福', log: '职场幸福感上升' },
  { id: 'praise', name: '当众夸团队', score: 6, type: 'buff', icon: '👏', anim: 'glow', desc: '+6 信心', log: '阿翘获得情绪价值补给' },
  { id: 'raise', name: '帮成员争涨薪', score: 25, type: 'buff', icon: '💰', anim: 'power', desc: '+25 忠诚', log: '团队满意度提升' },
];

const DEBUFF_PROPS: InteractionProp[] = [
  { id: 'late_msg', name: '深夜发消息', score: -8, type: 'debuff', icon: '📱', anim: 'sweat', desc: '-8 睡眠', log: '压力+10' },
  { id: 'late_demand', name: '临下班加需求', score: -15, type: 'debuff', icon: '📋', anim: 'pushup', desc: '-15 血压', log: '团队血压上涨' },
  { id: 'cake', name: '画饼不给资源', score: -12, type: 'debuff', icon: '🍰', anim: 'faint', desc: '-12 信任', log: '向上管理失败' },
  { id: 'long_meeting', name: '周会超过2小时', score: -10, type: 'debuff', icon: '🕘', anim: 'faint', desc: '-10 时间', log: '团队血压上涨' },
  { id: 'redo', name: '需求反复修改', score: -8, type: 'debuff', icon: '🤦', anim: 'angry', desc: '-8 耐心', log: '压力+10' },
  { id: 'no_dinner', name: '没陪上级吃饭', score: -5, type: 'debuff', icon: '🥲', anim: 'sad', desc: '-5 能量', log: '向上管理失败' },
  { id: 'steal', name: '抢下属功劳', score: -20, type: 'debuff', icon: '🔥', anim: 'angry', desc: '-20 追随', log: '团伙凝聚力受挫' },
  { id: 'changes', name: '想法太多变需求', score: -15, type: 'debuff', icon: '🧠', anim: 'sweat', desc: '-15 稳定', log: '团队血压上涨' },
];

// --- Components ---

const Character = ({ state, metrics, level }: { state: string; metrics: any; level: number }) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const isTired = metrics.pressure > 80;
  const isHealthy = metrics.nutrition > 90;
  
  // Dynamic parts based on state
  const eyes = useMemo(() => {
    if (state === 'angry') return "M 30,45 Q 40,40 50,45 M 70,45 Q 80,40 90,45";
    if (state === 'sad' || state === 'squat') return "M 32,50 Q 40,55 48,50 M 72,50 Q 80,55 88,50";
    if (state === 'happy' || isHealthy) return "M 32,52 Q 40,42 48,52 M 72,52 Q 80,42 88,52";
    if (isTired) return "M 32,55 Q 40,53 48,55 M 72,55 Q 80,53 88,55";
    return blink ? "M 32,55 L 48,55 M 72,55 L 88,55" : "M 40,55 A 4,4 0 1,1 40,54.9 M 80,55 A 4,4 0 1,1 80,54.9";
  }, [state, blink, isTired, isHealthy]);

  const mouth = useMemo(() => {
    if (state === 'happy' || isHealthy) return "M 45,75 Q 60,85 75,75";
    if (state === 'angry' || state === 'sad' || state === 'squat') return "M 45,80 Q 60,70 75,80";
    if (state === 'faint') return "M 55,75 A 5,5 0 1,1 65,75";
    if (isTired) return "M 50,78 L 70,78";
    return "M 50,75 Q 60,78 70,75";
  }, [state, isTired, isHealthy]);

  return (
    <motion.div 
      className="relative w-80 h-80 flex items-center justify-center"
      animate={
        state === 'pushup' ? { rotate: [0, -45, 0], y: [0, 100, 0] } :
        state === 'squat' ? { scaleY: 0.7, y: 50 } :
        { y: [0, -10, 0] }
      }
      transition={{ repeat: state === 'pushup' ? Infinity : 0, duration: 0.5 }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
        {/* Shadow */}
        <ellipse cx="60" cy="115" rx="40" ry="5" fill="rgba(0,0,0,0.05)" />
        
        {/* Body */}
        <motion.path 
          d="M 30,110 Q 60,115 90,110 L 85,70 Q 60,65 35,70 Z" 
          fill={isHealthy ? "#60A5FA" : "#94A3B8"} 
          animate={state === 'power' ? { fill: ["#94A3B8", "#60A5FA", "#94A3B8"] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        
        {/* Head */}
        <motion.g animate={state === 'idle' ? { y: [0, 2, 0] } : {}}>
          <circle cx="60" cy="50" r="35" fill="#FFE4E1" stroke="#FDBA74" strokeWidth="0.5" />
          
          {/* Hair */}
          <path d="M 25,45 Q 25,15 60,10 Q 95,15 95,45 Q 85,25 60,25 Q 35,25 25,45" fill="#1F2937" />
          
          {/* Dark Circles under eyes */}
          {isTired && (
            <>
              <path d="M 32,58 Q 40,62 48,58" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
              <path d="M 72,58 Q 80,62 88,58" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
            </>
          )}

          {/* Eyes */}
          <motion.path 
            d={eyes} 
            fill="none" 
            stroke="#1F2937" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          
          {/* Mouth */}
          <motion.path 
            d={mouth} 
            fill="none" 
            stroke="#1F2937" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />

          {/* Blush */}
          {(state === 'happy' || isHealthy) && (
            <>
              <circle cx="40" cy="65" r="5" fill="rgba(255,182,193,0.4)" />
              <circle cx="80" cy="65" r="5" fill="rgba(255,182,193,0.4)" />
            </>
          )}
        </motion.g>

        {/* Level Up Text */}
        <AnimatePresence>
          {state === 'glow' && (
            <motion.text
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0 }}
              x="60" y="0" textAnchor="middle" 
              className="text-[10px] font-black fill-blue-500"
            >
              LEVEL UP!
            </motion.text>
          )}
        </AnimatePresence>
      </svg>

      {/* Particle Effects */}
      <AnimatePresence>
        {(state === 'glow' || state === 'power' || isHealthy) && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                animate={{
                  y: [0, -100],
                  x: [0, (i - 2.5) * 40],
                  opacity: [1, 0],
                  scale: [1, 0]
                }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                style={{ left: '50%', bottom: '50%' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProgressBar = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
      <span className="flex items-center gap-1 opacity-70">{icon}{label}</span>
      <span className="text-gray-600">{Math.round(value)}</span>
    </div>
    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`h-full ${color} shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] transition-all`}
      />
    </div>
  </div>
);

const GameCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-8 ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [metrics, setMetrics] = useState({
    score: 85,
    nutrition: 72,
    pressure: 38,
    follower: 90
  });
  const [level, setLevel] = useState(6);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [animState, setAnimState] = useState<'idle' | 'happy' | 'sad' | 'sweat' | 'faint' | 'angry' | 'pushup' | 'hero' | 'power' | 'glow' | 'sunset' | 'squat'>('idle');
  const [consecutiveDebuffs, setConsecutiveDebuffs] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Level Logic
  useEffect(() => {
    const newLv = Math.floor(metrics.score / 15) + 1;
    if (newLv !== level) {
      setLevel(newLv);
      setAnimState('glow');
      setFeedback('🎉 级 别 提 升 ！');
      setTimeout(() => {
        setAnimState('idle');
        setFeedback('');
      }, 2500);
    }
  }, [metrics.score, level]);

  const addLog = (content: string, type: 'positive' | 'negative' | 'neutral') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 11),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleInteract = (prop: InteractionProp) => {
    if (prop.type === 'debuff') {
      setConsecutiveDebuffs(prev => prev + 1);
    } else {
      setConsecutiveDebuffs(0);
    }

    // Determine target state
    let targetState = prop.anim as any;
    if (prop.type === 'debuff' && consecutiveDebuffs >= 1) {
      targetState = 'squat';
    }

    setAnimState(targetState);
    setFeedback(prop.log);
    
    setMetrics(prev => ({
      score: Math.min(100, Math.max(0, prev.score + prop.score)),
      nutrition: Math.min(100, Math.max(0, prev.nutrition + (prop.type === 'buff' ? 10 : -5))),
      pressure: Math.min(100, Math.max(0, prev.pressure + (prop.type === 'debuff' ? 15 : -10))),
      follower: Math.min(100, Math.max(0, prev.follower + (prop.type === 'buff' ? 5 : -10))),
    }));

    addLog(prop.log, prop.type === 'buff' ? 'positive' : 'negative');
    
    setTimeout(() => {
      setAnimState('idle');
      setFeedback('');
    }, 2500);
  };

  const currentTitle = useMemo(() => {
    if (metrics.score > 90) return "战略级领航者";
    if (metrics.score > 80) return "资源推进者";
    if (metrics.score > 60) return "稳健执行官";
    return "低电量模式";
  }, [metrics.score]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1D1D1F] p-4 md:p-12 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        
        {/* --- Top Header --- */}
        <header className="lg:col-span-12 flex flex-col md:flex-row justify-between items-end bg-white/50 backdrop-blur-xl border border-white rounded-[3rem] p-10 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter font-display">
              阿翘生存模拟器
            </h1>
            <p className="text-gray-400 font-medium text-sm">
              今天，你决定让领导变强，还是增加他的压力值？
            </p>
          </div>
          <div className="flex items-center gap-8 mt-8 md:mt-0">
             <div className="bg-blue-50 px-6 py-4 rounded-[2rem] border border-blue-100">
               <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">🏆 当前等级</div>
               <div className="font-black text-2xl text-blue-600 font-display">Lv.{level}</div>
             </div>
             <div className="text-right space-y-1">
               <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">当前荣誉称号</div>
               <div className="font-bold text-lg">{currentTitle}</div>
               <div className="flex gap-2 justify-end">
                 {['老板最爱', '会议发动机', '资源协调者'].map(t => (
                   <span key={t} className="text-[9px] px-2 py-0.5 bg-gray-100 rounded-full font-bold text-gray-500">✓ {t}</span>
                 ))}
               </div>
             </div>
          </div>
        </header>

        {/* --- Sidebar Left: Inventory --- */}
        <GameCard className="lg:col-span-3 flex flex-col h-[700px] bg-slate-50/50 border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-200"><Backpack className="w-5 h-5"/></div>
              <h2 className="font-black text-xl font-display">给阿翘补充营养</h2>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buffs</span>
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {BUFF_PROPS.map(p => (
              <motion.button
                key={p.id}
                whileHover={{ y: -5, scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleInteract(p)}
                className="bg-white border-2 border-transparent hover:border-blue-400 hover:shadow-xl p-4 rounded-3xl text-left transition-all group relative aspect-square flex flex-col justify-between"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">{p.icon}</div>
                <div>
                  <div className="text-[11px] font-black leading-tight mb-1">{p.name}</div>
                  <div className="text-[9px] font-bold text-blue-500">ACTIVATE</div>
                </div>
              </motion.button>
            ))}
          </div>
        </GameCard>

        {/* --- Main Avatar Area --- */}
        <main className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[700px]">
          
          <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
            
            {/* Dynamic Aura */}
            <motion.div 
              animate={{ 
                scale: animState === 'idle' ? [1, 1.1, 1] : [1, 1.4, 1],
                opacity: metrics.score > 80 ? [0.1, 0.3, 0.1] : [0.05, 0.15, 0.05]
              }}
              transition={{ repeat: Infinity, duration: 5 }}
              className={`absolute w-80 h-80 rounded-full blur-[100px] transition-colors duration-1000 ${
                metrics.score > 90 ? 'bg-yellow-400' : 
                metrics.score < 50 ? 'bg-red-400' : 'bg-blue-400'
              }`} 
            />

            {/* Character Viewport */}
            <div className="relative z-10 select-none flex flex-col items-center scale-110">
              <Character state={animState} metrics={metrics} level={level} />
              
              {/* Float Feedback Speech Bubble */}
              <AnimatePresence>
                {animState !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 40 }}
                      animate={{ opacity: 1, scale: 1, y: -180 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-black text-white font-black text-lg px-8 py-4 rounded-3xl shadow-2xl skew-x-2"
                    >
                      {feedback || (
                        animState === 'pushup' ? '正在被罚做俯卧撑...' : 
                        animState === 'hero' ? '功德值拉满！' : 
                        animState === 'happy' ? '阿翘很快乐' : 
                        animState === 'angry' ? '团队血压暴涨中' : 
                        animState === 'squat' ? '阿翘正在自闭...' : '收到补给'
                      )}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-[10px] border-transparent border-t-black" />
                    </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-16 text-center">
                <div className="text-5xl font-black tracking-tighter mb-2 font-display">阿翘</div>
                {metrics.score < 60 ? (
                  <div className="text-[12px] font-black text-red-500 uppercase tracking-widest animate-bounce px-4 py-1 bg-red-50 rounded-full">
                    ⚠️ 进入低电量模式
                  </div>
                ) : metrics.score > 90 ? (
                  <div className="text-[12px] font-black text-blue-500 uppercase tracking-widest animate-pulse px-4 py-1 bg-blue-50 rounded-full">
                    🌟 稀有领导状态激活
                  </div>
                ) : (
                  <div className="text-[12px] font-black text-gray-300 uppercase tracking-widest">
                    Active Leader Simulator
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Status Panel */}
            <div className="absolute bottom-0 w-full flex flex-col items-center">
               <motion.div 
                 layout
                 className="flex items-center gap-12 bg-white border border-gray-100 p-8 rounded-[3rem] shadow-2xl w-full max-w-xl"
               >
                  <div className="text-center px-4">
                    <div className="text-6xl font-black tracking-tighter mb-1 font-display">{Math.round(metrics.score)}</div>
                    <div className="text-[10px] text-gray-400 font-black tracking-widest uppercase">综合评分</div>
                  </div>
                  <div className="w-[1px] h-16 bg-gray-100" />
                  <div className="space-y-4 flex-1">
                    <ProgressBar label="营养值" value={metrics.nutrition} color="bg-green-400" icon={<Heart className="w-3 h-3"/>}/>
                    <ProgressBar label="压力值" value={metrics.pressure} color="bg-orange-400" icon={<Activity className="w-3 h-3"/>}/>
                    <ProgressBar label="团队追随指数" value={metrics.follower} color="bg-blue-400" icon={<Users className="w-3 h-3"/>}/>
                  </div>
               </motion.div>
            </div>
          </div>
        </main>

        {/* --- Sidebar Right: Events --- */}
        <GameCard className="lg:col-span-3 flex flex-col h-[700px] bg-rose-50/50 border-rose-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-200"><Flame className="w-5 h-5"/></div>
              <h2 className="font-black text-xl font-display">惩罚阿翘</h2>
            </div>
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Debuffs</span>
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {DEBUFF_PROPS.map(p => (
              <motion.button
                key={p.id}
                whileHover={{ y: 5, scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleInteract(p)}
                className="bg-white border-2 border-transparent hover:border-rose-400 hover:shadow-xl p-4 rounded-3xl text-left transition-all group relative aspect-square flex flex-col justify-between"
              >
                <div className="text-4xl group-hover:shake transition-transform">{p.icon}</div>
                <div>
                  <div className="text-[11px] font-black leading-tight mb-1">{p.name}</div>
                  <div className="text-[9px] font-bold text-rose-500">TRIGGER</div>
                </div>
              </motion.button>
            ))}
          </div>
        </GameCard>

        {/* --- Bottom Log Panel --- */}
        <section className="lg:col-span-8">
          <GameCard className="h-full flex flex-col bg-gray-50 border-none shadow-inner flex-1 min-h-[200px]">
             <div className="flex items-center gap-3 mb-6">
                <History className="w-5 h-5 text-gray-400" />
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">实时职场日志</h3>
             </div>
             <div className="overflow-y-auto space-y-3 flex-1 custom-scrollbar pr-4">
              {logs.length === 0 && <div className="text-sm text-gray-300 font-medium italic">阿翘正在待机，等待管理员指令...</div>}
              {logs.map((log) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={log.id} 
                  className="flex items-center gap-5 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <span className="text-[10px] font-black text-gray-300 tabular-nums">{log.time}</span>
                  <div className={`w-1.5 h-6 rounded-full ${log.type === 'positive' ? 'bg-green-400' : log.type === 'negative' ? 'bg-red-400' : 'bg-gray-400'}`} />
                  <span className="text-sm font-bold text-gray-600">{log.content}</span>
                </motion.div>
              ))}
            </div>
          </GameCard>
        </section>

        {/* --- AI Analysis Deck --- */}
        <section className="lg:col-span-4">
          <GameCard className="h-full bg-black text-white border-none shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">AI 综合建模评价</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="space-y-1">
                  <div className="text-3xl font-black font-display">{Math.round(metrics.score * 0.95)}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">资源调度</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black font-display text-blue-400">{Math.round(metrics.nutrition * 0.85)}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">情绪护盾</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black font-display">{Math.round(100 - metrics.pressure * 0.5)}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">组织带宽</div>
                </div>
              </div>

              <div className="bg-white/10 p-6 rounded-[2rem] border border-white/5 mb-8">
                <p className="text-xs leading-relaxed text-gray-300 font-medium">
                  模型快照：阿翘目前展现出<span className="text-white font-bold italic"> {metrics.score > 70 ? '强韧的韧性' : '局部过载'} </span>状态。
                  在{currentTitle}模板下，团队追随指数维持在<span className="text-blue-400"> {Math.round(metrics.follower)} </span>。
                  建议：{metrics.pressure > 50 ? '优先清除深夜消息Debuff，释放团队心理带宽。' : '当前组织效率极高，可尝试进行更大规模的资源争夺。'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
               <button className="w-full py-5 bg-white text-black font-black text-sm rounded-[1.5rem] shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                 <Share2 className="w-4 h-4" /> 生成阿翘成长战报
               </button>
               <button className="w-full py-5 border border-red-500/30 text-red-500 font-black text-sm rounded-[1.5rem] hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 group">
                 发送给领导 <span className="text-[9px] opacity-40 group-hover:opacity-100 italic">(危险动作)</span>
               </button>
            </div>
          </GameCard>
        </section>

      </div>

      <style jsx global>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .shake { animation: shake 0.4s; animation-iteration-count: infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F0F0F0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E0E0E0; }
      `}</style>
    </div>
  );
}

