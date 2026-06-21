const BADGE_RULES = [
  { id: "first_interview", name: "First Step", desc: "Complete your first interview", icon: "🎯", check: (u) => u.interviewsCompleted >= 1 },
  { id: "five_interviews", name: "Dedicated Learner", desc: "Complete 5 interviews", icon: "📚", check: (u) => u.interviewsCompleted >= 5 },
  { id: "ten_interviews", name: "Interview Pro", desc: "Complete 10 interviews", icon: "🏆", check: (u) => u.interviewsCompleted >= 10 },
  { id: "streak_3", name: "On Fire", desc: "3-day practice streak", icon: "🔥", check: (u) => u.streak >= 3 },
  { id: "streak_7", name: "Unstoppable", desc: "7-day practice streak", icon: "⚡", check: (u) => u.streak >= 7 },
  { id: "points_100", name: "Rising Star", desc: "Earn 100 points", icon: "⭐", check: (u) => u.points >= 100 },
  { id: "points_500", name: "Elite Candidate", desc: "Earn 500 points", icon: "💎", check: (u) => u.points >= 500 },
  { id: "perfect_score", name: "Perfect Score", desc: "Score 100% on an interview", icon: "🎖️", check: (u) => u.hasPerfectScore },
];

const evaluateBadges = (user, extra = {}) => {
  const ctx = {
    points: user.points || 0,
    streak: user.streak || 0,
    interviewsCompleted: user.interviewsCompleted || 0,
    hasPerfectScore: extra.hasPerfectScore || user.hasPerfectScore || false,
  };
  const earned = [];
  for (const rule of BADGE_RULES) {
    if (rule.check(ctx)) earned.push(rule.id);
  }
  return earned;
};

const getBadgeDetails = (badgeIds = []) =>
  BADGE_RULES.filter((b) => badgeIds.includes(b.id));

const getAllBadges = () => BADGE_RULES;

module.exports = { evaluateBadges, getBadgeDetails, getAllBadges, BADGE_RULES };
