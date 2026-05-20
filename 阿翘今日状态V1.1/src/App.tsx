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
  observer: string;
  scoreChange: number;
  finalScore: number;
  propName: string;
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
  flavor: string;
  rarity?: 'SSR' | 'RARE' | 'COMMON';
}

// --- Constants ---

const BUFF_PROPS: InteractionProp[] = [
  { id: 'coffee', name: '请喝咖啡', score: 5, type: 'buff', icon: '☕', anim: 'happy', desc: '+5 精神值', log: '阿翘感觉可以再上5个班', flavor: '也许能换来10分钟好脾气' },
  { id: 'tea', name: '请团队喝奶茶', score: 8, type: 'buff', icon: '🧋', anim: 'happy', desc: '+8 精神值', log: '阿翘获得情绪价值补给', flavor: '集体快乐，领导回血' },
  { id: 'shield', name: '成功阻拦+1需求', score: 20, type: 'buff', icon: '🚫', anim: 'hero', desc: '+20 综合评分', log: '功德无量，建议保护', flavor: '稀有行为，建议保护' },
  { id: 'cancel_meeting', name: '取消周会', score: 30, type: 'buff', icon: '❌', anim: 'glow', desc: '+30 精神值', log: '这是真正的自由', flavor: '今日SSR事件' },
  { id: 'budget', name: '帮团队争预算', score: 20, type: 'buff', icon: '💰', anim: 'power', desc: '+20 资源值', log: '资源包到账', flavor: '领导形象瞬间提升' },
  { id: 'praise', name: '当众夸团队', score: 8, type: 'buff', icon: '🏆', anim: 'glow', desc: '+8 耐心值', log: '阿翘获得荣誉Buff', flavor: '夸奖是真正生产力' },
  { id: 'off_work', name: '全员准点下班', score: 40, type: 'buff', icon: '🕔', anim: 'sunset', desc: '+40 综合评分', log: '职场传说正在上演', flavor: '传说级事件' },
  { id: 'promotion', name: '帮下属升职加薪', score: 35, type: 'buff', icon: '📈', anim: 'power', desc: '+35 综合评分', log: '好评如潮', flavor: '属于隐藏剧情' },
];

const DEBUFF_PROPS: InteractionProp[] = [
  { id: 'late_msg', name: '深夜发消息', score: -8, type: 'debuff', icon: '📱', anim: 'sweat', desc: '-8 精神值', log: '压力+10', flavor: '“看到消息了吗？”' },
  { id: 'late_demand', name: '临下班加需求', score: -10, type: 'debuff', icon: '📋', anim: 'pushup', desc: '-10 精神值', log: '团队血压上涨', flavor: '经典技能' },
  { id: 'pua_fail', name: 'PUA不够努力', score: -20, type: 'debuff', icon: '😑', anim: 'faint', desc: '-20 综合评分', log: '向上管理失败', flavor: '伤害持续生效' },
  { id: 'extra_work', name: '给下属接活', score: -15, type: 'debuff', icon: '🤝', anim: 'squat', desc: '-15 耐心值', log: '团队负载增加', flavor: '别人答应，你干活' },
  { id: 'album', name: '要求众筹买专辑', score: -40, type: 'debuff', icon: '💿', anim: 'faint', desc: '-40 综合评分', log: '信用破产', flavor: '史诗级掉血' },
  { id: 'dumb', name: '遇事开始装傻', score: -18, type: 'debuff', icon: '🙈', anim: 'faint', desc: '-18 耐心值', log: '沟通成本激增', flavor: '技能：失忆术' },
  { id: 'empathy_only', name: '只提供情绪价值', score: -15, type: 'debuff', icon: '🫂', anim: 'sad', desc: '-15 精神值', log: '无效安慰', flavor: '解决不了问题但会安慰' },
  { id: 'easy_work', name: '“这个应该不难吧”', score: -30, type: 'debuff', icon: '💀', anim: 'angry', desc: '-30 综合评分', log: '暴击伤害', flavor: '暴击伤害' },
];

const SSR_BUFFS: InteractionProp[] = [
  { id: 'ssr_trip', name: '老板出差', score: 12, type: 'buff', icon: '☀️', anim: 'happy', desc: '+12 精神值', log: '惊喜：老板去外地考察了', flavor: '★★★★★ 极稀有', rarity: 'SSR' },
  { id: 'ssr_budget', name: '部门预算增加', score: 20, type: 'buff', icon: '💰', anim: 'power', desc: '+20 资源值', log: '惊喜：财报表现优异', flavor: '★★★★ 高概率', rarity: 'SSR' },
  { id: 'ssr_meeting', name: '今日不开会', score: 30, type: 'buff', icon: '🔥', anim: 'glow', desc: '+30 精神值', log: '惊喜：今日完全不准开会', flavor: '★★★ 普通', rarity: 'SSR' },
  { id: 'ssr_delay', name: '项目延期', score: 15, type: 'buff', icon: '🎉', anim: 'sunset', desc: '+15 耐心值', log: '传说：期限放宽，全场欢呼', flavor: '★★★★ 高概率', rarity: 'SSR' },
  { id: 'rare_kpi', name: 'KPI下调', score: 25, type: 'buff', icon: '📉', anim: 'power', desc: '+25 综合评分', log: '限定：目标压力缓解', flavor: '★★★★★ 极稀有', rarity: 'SSR' },
];

const RARE_DEBUFFS: InteractionProp[] = [
  { id: 'danger_demand', name: '临下班新增需求', score: -20, type: 'debuff', icon: '💀', anim: 'pushup', desc: '-20 精神值', log: '危险：逻辑崩塌开始', flavor: '高危', rarity: 'RARE' },
  { id: 'danger_pua', name: 'PUA下属不够努力', score: -25, type: 'debuff', icon: '💀', anim: 'angry', desc: '-25 综合评分', log: '危险：无效对比', flavor: '极高危', rarity: 'RARE' },
  { id: 'danger_empathy', name: '只给情绪价值不解决问题', score: -18, type: 'debuff', icon: '💀', anim: 'sad', desc: '-18 综合评分', log: '危险：由于Bug过多无法上线', flavor: '高危', rarity: 'RARE' },
  { id: 'danger_meeting', name: '开会超过2小时', score: -15, type: 'debuff', icon: '💀', anim: 'faint', desc: '-15 精神值', log: '危险：主观臆断爆发', flavor: '中等风险', rarity: 'RARE' },
  { id: 'danger_extra', name: '给下属接额外活', score: -20, type: 'debuff', icon: '💀', anim: 'squat', desc: '-20 耐心值', log: '危险：完全低估工作量', flavor: '高危', rarity: 'RARE' },
  { id: 'danger_dumb', name: '遇问题装傻', score: -30, type: 'debuff', icon: '💀', anim: 'faint', desc: '-30 综合评分', log: '危险：心理防线崩溃', flavor: '毁灭级', rarity: 'RARE' },
  { id: 'danger_album', name: '众筹给领导买专辑', score: -40, type: 'debuff', icon: '💀', anim: 'faint', desc: '-40 资源值', log: '危险：团队信任破产', flavor: '极高危', rarity: 'RARE' },
  { id: 'danger_simple', name: '“简单改一下”', score: -50, type: 'debuff', icon: '💀', anim: 'angry', desc: '-50 综合评分', log: '危险：毁灭性伤害', flavor: '毁灭级', rarity: 'RARE' },
];

const HIDDEN_BUFFS = [
  { id: 'h1', name: '【天选之日】', desc: '幸运爆发，万事亨通', icon: '🎲' },
  { id: 'h2', name: '【阿翘请客】', desc: '自动恢复20点电量', icon: '🍱' },
  { id: 'h3', name: '【老板休假】', desc: '全体压力直线下降', icon: '✈️' },
  { id: 'h4', name: '【系统维护】', desc: '今日无法进行任何扣分', icon: '🛠️' },
  { id: 'h5', name: '【灵光一现】', desc: '随机解除一个烦恼', icon: '💡' },
];

// --- Components ---

const Character = ({ state, metrics, level }: { state: string; metrics: any; level: number }) => {
  const isTired = metrics.pressure > 80;
  const isHealthy = metrics.nutrition > 90;
  
  return (
    <motion.div 
      className="relative w-80 h-80 flex items-center justify-center scale-110"
      animate={
        state === 'pushup' ? { rotate: [0, -75, 0], y: [0, 80, 0] } :
        state === 'squat' ? { scaleY: 0.7, y: 50 } :
        state === 'angry' ? { x: [-15, 15, -15, 15, -10, 10, 0], y: [-5, 5, -5, 5, 0], filter: 'sepia(0.5) hue-rotate(-30deg) saturate(1.5)' } :
        { y: [0, -15, 0] }
      }
      transition={{ 
        repeat: state === 'pushup' ? Infinity : (state === 'idle' ? Infinity : 0),
        duration: state === 'pushup' ? 0.4 : (state === 'angry' ? 0.2 : 2),
        ease: "easeInOut"
      }}
    >
      {/* Character Image */}
      <motion.div 
        className={`w-full h-full rounded-[4rem] overflow-hidden border-[1px] border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.06)] bg-white relative group transition-all duration-700 ${
          isTired ? 'saturate-[0.5] brightness-75' : 
          isHealthy ? 'brightness-105 contrast-105' : ''
        }`}
      >
        <img 
          src="/aqiao_avatar.jpg" 
          alt="阿翘" 
          className="w-full h-full object-cover"
        />

        {/* State Overlays */}
        <AnimatePresence>
          {state === 'angry' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500/10 mix-blend-overlay" 
            />
          )}
          {state === 'power' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-400/10 mix-blend-color-dodge" 
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Particle Effects (Feedback) */}
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
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                animate={{
                  y: [0, -120],
                  x: [0, (i - 2.5) * 50],
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

      {/* Level Up Text */}
      <AnimatePresence>
        {state === 'glow' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: -180, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-2xl font-bold text-blue-500 tracking-tighter bg-white/80 backdrop-blur px-6 py-2 rounded-full shadow-lg border border-blue-100">LEVEL UP!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const ProgressBar = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[11px] font-bold tracking-tight text-gray-400">
      <span className="flex items-center gap-1.5">{icon}{label}</span>
      <span className="text-gray-900 font-mono">{Math.round(value)}%</span>
    </div>
    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className={`h-full ${color} transition-all`}
      />
    </div>
  </div>
);

const GameCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-8 ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('aqiao_metrics');
    return saved ? JSON.parse(saved) : {
      score: 85,
      nutrition: 72,
      pressure: 38,
      follower: 90
    };
  });
  
  const [totals, setTotals] = useState(() => {
    const saved = localStorage.getItem('aqiao_totals');
    return saved ? JSON.parse(saved) : { heal: 0, damage: 0 };
  });

  const [level, setLevel] = useState(6);
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('aqiao_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [animState, setAnimState] = useState<'idle' | 'happy' | 'sad' | 'sweat' | 'faint' | 'angry' | 'pushup' | 'hero' | 'power' | 'glow' | 'sunset' | 'squat'>('idle');
  const [consecutiveDebuffs, setConsecutiveDebuffs] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Auth state
  const [observerName, setObserverName] = useState<string | null>(() => localStorage.getItem('aqiao_observer'));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [pendingProp, setPendingProp] = useState<InteractionProp | null>(null);
  const [isBuffRevealed, setIsBuffRevealed] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('aqiao_metrics', JSON.stringify(metrics));
    localStorage.setItem('aqiao_logs', JSON.stringify(logs));
    localStorage.setItem('aqiao_totals', JSON.stringify(totals));
  }, [metrics, logs, totals]);

  // Level Logic
  useEffect(() => {
    const newLv = Math.floor(metrics.score / 15) + 1;
    if (newLv !== level) {
      setLevel(newLv);
      if (newLv > level) {
        setAnimState('glow');
        setFeedback('🎉 级 别 提 升 ！');
        setTimeout(() => {
          setAnimState('idle');
          setFeedback('');
        }, 2500);
      }
    }
  }, [metrics.score, level]);

  const addLog = (prop: InteractionProp, content: string, type: 'positive' | 'negative' | 'neutral', scoreChange: number, finalScore: number, userName: string) => {
    const newLog: LogEntry & { rarity?: string } = {
      id: Math.random().toString(36).substring(2, 11),
      time: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      content,
      type,
      observer: userName,
      scoreChange,
      finalScore,
      propName: prop.name,
      rarity: prop.rarity || 'COMMON'
    };
    setLogs(prev => [newLog, ...prev].slice(0, 20));
  };

  const [rareEventTrigger, setRareEventTrigger] = useState<{ type: 'SSR' | 'RARE', name: string } | null>(null);

  const handleInteract = (prop: InteractionProp, forcedName?: string) => {
    const userName = forcedName || observerName;
    if (!userName) {
      setPendingProp(prop);
      setIsLoginModalOpen(true);
      return;
    }

    // 5% chance triggers SSR/Rare event
    let activeProp = prop;
    const isRare = Math.random() < 0.05;
    
    if (isRare) {
      if (prop.type === 'buff') {
        activeProp = SSR_BUFFS[Math.floor(Math.random() * SSR_BUFFS.length)];
        setRareEventTrigger({ type: 'SSR', name: activeProp.name });
      } else {
        activeProp = RARE_DEBUFFS[Math.floor(Math.random() * RARE_DEBUFFS.length)];
        setRareEventTrigger({ type: 'RARE', name: activeProp.name });
      }
      
      setTimeout(() => setRareEventTrigger(null), 3000);
    } else {
      setFeedback(prop.log);
    }

    const currentProp = activeProp;

    if (currentProp.type === 'debuff') {
      setConsecutiveDebuffs(prev => prev + 1);
      setTotals(prev => ({ ...prev, damage: prev.damage + Math.abs(currentProp.score) }));
    } else {
      setConsecutiveDebuffs(0);
      setTotals(prev => ({ ...prev, heal: prev.heal + currentProp.score }));
    }

    // Determine target state
    let targetState = currentProp.anim as any;
    if (currentProp.type === 'debuff' && (consecutiveDebuffs >= 1 || isRare)) {
      targetState = isRare ? 'angry' : 'squat';
    }
    
    if (isRare && currentProp.type === 'buff') {
      targetState = 'glow';
    }

    setAnimState(targetState);
    
    setMetrics(prev => {
      const nextScore = Math.min(100, Math.max(0, prev.score + currentProp.score));
      addLog(currentProp, currentProp.log, currentProp.type === 'buff' ? 'positive' : 'negative', currentProp.score, nextScore, userName);
      
      return {
        score: nextScore,
        nutrition: Math.min(100, Math.max(0, prev.nutrition + (currentProp.type === 'buff' ? 10 : -8))),
        pressure: Math.min(100, Math.max(0, prev.pressure + (currentProp.type === 'debuff' ? 15 : -12))),
        follower: Math.min(100, Math.max(0, prev.follower + (currentProp.type === 'buff' ? 6 : -10))),
      };
    });
    
    setTimeout(() => {
      setAnimState('idle');
      if (!isRare) setFeedback('');
    }, 2500);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tempName.trim()) return;
    
    const name = tempName.trim();
    setObserverName(name);
    localStorage.setItem('aqiao_observer', name);
    setIsLoginModalOpen(false);
    setTempName('');
    
    if (pendingProp) {
      setTimeout(() => {
        handleInteract(pendingProp, name);
        setPendingProp(null);
      }, 0);
    }
  };

  const currentStatusEmoji = useMemo(() => {
    if (metrics.score > 90) return "🚀 活力全开";
    if (metrics.score > 70) return "🙂 正常营业";
    if (metrics.score > 40) return "😑 勉强支撑";
    return "💀 申请报废";
  }, [metrics.score]);

  return (
    <div className="min-h-screen bg-white text-[#37352F] pb-24 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        {/* --- Notion Style Header --- */}
        <header className="pt-20 pb-16 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <h1 className="text-5xl font-bold tracking-tight text-[#1D1D1F]">阿翘今日状态</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-400">
              <span className="bg-gray-50 px-3 py-1 rounded-md border border-gray-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                当前状态：{currentStatusEmoji}
              </span>
              <span className="bg-gray-50 px-3 py-1 rounded-md border border-gray-100 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                今日观察员：{observerName || '游客'}
                {observerName && (
                   <button onClick={() => { setObserverName(null); localStorage.removeItem('aqiao_observer'); }} className="ml-2 hover:text-red-500 transition-colors">退出</button>
                )}
              </span>
            </div>
            <p className="text-gray-400 font-medium text-lg max-w-lg leading-relaxed">
              今天，你决定让他回血，还是增加一点压力值。
            </p>
          </div>
          
          <div className="flex gap-12 text-sm">
             <div className="space-y-1">
               <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">累计回血</div>
               <div className="text-2xl font-bold tabular-nums text-blue-500">+{totals.heal}</div>
             </div>
             <div className="space-y-1">
               <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">累计掉血</div>
               <div className="text-2xl font-bold tabular-nums text-red-400">-{totals.damage}</div>
             </div>
          </div>
        </header>

        <div className="mt-20 flex flex-col items-center gap-24">
          
          {/* --- Main Character Area (Side-by-Side) --- */}
          <main className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            <div className="relative w-full max-w-[320px] lg:max-w-[400px] aspect-square flex items-center justify-center">
              <Character state={animState} metrics={metrics} level={level} />
              
              {/* Float Feedback Speech Bubble */}
              <AnimatePresence>
                {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: -240, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-black text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl"
                    >
                      {feedback}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status Viewport Metrics */}
            <div className="w-full max-w-md px-4">
               <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.03)] space-y-8">
                 <div className="flex items-end justify-between">
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">续航能力 🔋</div>
                      <div className="text-5xl font-bold tracking-tighter tabular-nums text-gray-800">{Math.round(metrics.score)}%</div>
                   </div>
                   <div className="text-right">
                     <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1 font-mono">Lv.{level}</div>
                     <Trophy className="w-5 h-5 text-gray-100 inline-block" />
                   </div>
                 </div>
                 
                 <div className="space-y-6">
                    <ProgressBar label="精神值 ☕" value={metrics.nutrition} color="bg-blue-400" icon={<Zap className="w-3 h-3"/>}/>
                    <ProgressBar label="耐心值 😑" value={metrics.pressure} color="bg-amber-400" icon={<Activity className="w-3 h-3"/>}/>
                    <ProgressBar label="资源值 💰" value={metrics.follower} color="bg-[#37352F]" icon={<Coins className="w-3 h-3"/>}/>
                 </div>
               </div>
            </div>
          </main>

          {/* --- Interactive Area (Combined & Compact) --- */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Buff Area */}
            <section className="space-y-8">
              <div className="space-y-2 px-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  给阿翘续命 ☕
                </h2>
                <div className="text-[13px] font-medium text-gray-400">
                  偶尔回血，也许能换来几天好脾气。
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {BUFF_PROPS.map(p => (
                  <motion.button
                    key={p.id}
                    whileHover={{ y: -4, shadow: "0 20px 40px rgba(0,0,0,0.04)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleInteract(p)}
                    className="bg-white border border-gray-100 p-4 rounded-[1.5rem] text-center transition-all group shadow-sm flex flex-col items-center justify-center min-h-[140px]"
                  >
                    <div className="text-2xl mb-3 grayscale-[0.3] group-hover:grayscale-0 transition-all">{p.icon}</div>
                    <div className="w-full">
                      <div className="text-[11px] font-bold text-gray-800 mb-1 truncate">{p.name}</div>
                      <div className="text-[10px] font-bold text-blue-500 uppercase mb-2">{p.desc.split(' ')[0]}</div>
                      <div className="text-[9px] font-medium text-gray-300 leading-tight group-hover:text-gray-400 transition-colors h-6 flex items-center justify-center italic">{p.flavor}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Debuff Area */}
            <section className="space-y-8">
               <div className="space-y-2 px-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  让阿翘掉点血 🔥
                </h2>
                <div className="text-[13px] font-medium text-gray-400">
                  每一次操作，都会改变今日状态。
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {DEBUFF_PROPS.map(p => (
                  <motion.button
                    key={p.id}
                    whileHover={{ y: -4, shadow: "0 20px 40px rgba(0,0,0,0.04)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleInteract(p)}
                    className="bg-white border border-gray-100 p-4 rounded-[1.5rem] text-center transition-all group shadow-sm flex flex-col items-center justify-center min-h-[140px]"
                  >
                    <div className="text-2xl mb-3 grayscale-[0.6] group-hover:grayscale-0 transition-all">{p.icon}</div>
                    <div className="w-full">
                      <div className="text-[11px] font-bold text-gray-800 mb-1 truncate">{p.name}</div>
                      <div className="text-[10px] font-bold text-red-400 uppercase mb-2">{p.desc.split(' ')[0]}</div>
                      <div className="text-[9px] font-medium text-gray-300 leading-tight group-hover:text-gray-400 transition-colors h-6 flex items-center justify-center italic">{p.flavor}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* --- Notion Style Logs --- */}
        <section className="mt-40 border-t border-gray-50 pt-16">
          <div className="flex items-center gap-3 mb-10">
            <History className="w-4 h-4 text-gray-300" />
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">今日围观记录</h3>
          </div>
          
          <div className="space-y-1 h-[400px] overflow-y-auto custom-scrollbar pr-4">
            {logs.length === 0 && <div className="text-sm text-gray-300 font-medium italic py-8">目前还没有互动记录...</div>}
            {logs.map((log: any) => (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={log.id} 
                className={`group flex flex-wrap items-center gap-x-4 gap-y-1 py-4 border-b border-gray-50 hover:bg-gray-50/50 px-4 rounded-xl transition-all ${
                  log.rarity === 'SSR' ? 'bg-amber-50/30' : log.rarity === 'RARE' ? 'bg-red-50/30' : ''
                }`}
              >
                <span className="text-[11px] font-bold text-gray-300 tabular-nums w-12">{log.time}</span>
                <span className="text-sm font-bold text-gray-900 w-24 truncate">{log.observer}</span>
                <span className="text-sm font-medium text-gray-500 flex-1">
                  {log.rarity === 'SSR' && <span className="text-[10px] font-bold text-amber-500 mr-2 uppercase tracking-tighter">[SSR]</span>}
                  {log.rarity === 'RARE' && <span className="text-[10px] font-bold text-red-500 mr-2 uppercase tracking-tighter">[危险]</span>}
                  {log.propName}
                </span>
                <div className="flex items-center gap-2">
                   <ArrowRight className="w-3 h-3 text-gray-200" />
                   <span className={`text-[12px] font-bold ${log.scoreChange > 0 ? 'text-blue-500' : 'text-red-400'}`}>
                     {log.scoreChange > 0 ? '续航能力' : '压力值'} {log.scoreChange > 0 ? '+' : ''}{log.scoreChange}
                   </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      {/* --- Rare Event Overlays --- */}
      <AnimatePresence>
        {rareEventTrigger && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-12 py-6 rounded-full shadow-2xl backdrop-blur-xl border flex items-center gap-6 ${
              rareEventTrigger.type === 'SSR' ? 'bg-amber-400 text-white border-amber-300' : 'bg-black text-white border-red-500 shadow-red-500/20'
            }`}
          >
            <div className="text-4xl">{rareEventTrigger.type === 'SSR' ? '✨' : '💀'}</div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                {rareEventTrigger.type === 'SSR' ? '稀有事件触发' : '危险事件触发'}
              </div>
              <div className="text-xl font-bold">{rareEventTrigger.name}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Login Modal --- */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl"
            >
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold tracking-tight mb-2">先报个名 👀</h2>
                <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
                  系统将记录谁在给阿翘续命，<br />
                  谁在偷偷增加KPI。
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-8">
                <input 
                  autoFocus
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="阿翘、匿名好人..."
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-100 transition-all placeholder:text-gray-300"
                />
                
                <div className="flex flex-col gap-3">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#37352F] text-white font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all text-sm"
                  >
                    确认并操作
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-all text-xs"
                  >
                    取消
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F5F5F5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E5E5E5; }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes pulse-warm {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(0.98); }
        }
        .animate-pulse-warm { animation: pulse-warm 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

