const User = require("../models/User");
const Interview = require("../models/Interview");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { evaluateBadges, getBadgeDetails, getAllBadges } = require("../utils/badges");

const safeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  mobile: user.mobile,
  email: user.email,
  profilePic: user.profilePic,
  points: user.points || 0,
  badges: user.badges || [],
  streak: user.streak || 0,
  interviewsCompleted: user.interviewsCompleted || 0,
  level: user.level || 1,
  settings: user.settings || {},
});

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  try {
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email: normalizedEmail, password: hashedPassword });

    res.json({ message: "User registered successfully", user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload an image file" });

    const user = await User.findByIdAndUpdate(
      req.user,
      { profilePic: req.file.path },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(safeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(safeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { settings: req.body },
      { new: true }
    );
    res.json(safeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user;
    const interviews = await Interview.find({ userId, status: "completed" }).sort({ createdAt: 1 });

    const totalInterviews = interviews.length;
    const avgScore = totalInterviews
      ? Math.round(interviews.reduce((s, i) => s + (i.maxScore ? (i.totalScore / i.maxScore) * 100 : 0), 0) / totalInterviews)
      : 0;

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split("T")[0];
      const dayInterviews = interviews.filter(
        (intv) => intv.createdAt.toISOString().split("T")[0] === dayStr
      );
      weeklyData.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        count: dayInterviews.length,
        avgScore: dayInterviews.length
          ? Math.round(dayInterviews.reduce((s, intv) => s + (intv.maxScore ? (intv.totalScore / intv.maxScore) * 100 : 0), 0) / dayInterviews.length)
          : 0,
      });
    }

    const roleBreakdown = {};
    interviews.forEach((intv) => {
      if (!roleBreakdown[intv.jobTitle]) roleBreakdown[intv.jobTitle] = { count: 0, totalPct: 0 };
      roleBreakdown[intv.jobTitle].count++;
      roleBreakdown[intv.jobTitle].totalPct += intv.maxScore ? (intv.totalScore / intv.maxScore) * 100 : 0;
    });

    const topRoles = Object.entries(roleBreakdown)
      .map(([role, data]) => ({ role, count: data.count, avgScore: Math.round(data.totalPct / data.count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const user = await User.findById(userId);

    res.json({
      totalInterviews,
      avgScore,
      totalPoints: user?.points || 0,
      streak: user?.streak || 0,
      level: user?.level || 1,
      weeklyData,
      topRoles,
      recentScores: interviews.slice(-10).map((i) => ({
        date: i.createdAt,
        score: i.totalScore,
        maxScore: i.maxScore,
        role: i.jobTitle,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ points: -1 })
      .limit(20)
      .select("fullName profilePic points badges streak interviewsCompleted level");

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      fullName: u.fullName,
      profilePic: u.profilePic,
      points: u.points || 0,
      streak: u.streak || 0,
      interviewsCompleted: u.interviewsCompleted || 0,
      level: u.level || 1,
      badgeCount: u.badges?.length || 0,
      isCurrentUser: u._id.toString() === req.user,
    }));

    const currentUser = await User.findById(req.user);
    const userRank = await User.countDocuments({ points: { $gt: currentUser?.points || 0 } }) + 1;

    res.json({ leaderboard, userRank, currentUserPoints: currentUser?.points || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
    const completed = interviews.filter((i) => i.status === "completed");
    const avgScore = completed.length
      ? Math.round(
          completed.reduce((s, i) => s + (i.maxScore ? (i.totalScore / i.maxScore) * 100 : 0), 0) /
            completed.length
        )
      : 0;

    res.json({
      user: safeUser(user),
      stats: {
        totalSessions: interviews.length,
        completed: completed.length,
        pending: interviews.filter((i) => i.status === "pending").length,
        avgScore,
        badges: user.badges?.length || 0,
        points: user.points || 0,
        streak: user.streak || 0,
        level: user.level || 1,
      },
      interviews: interviews.map((i) => ({
        _id: i._id,
        jobTitle: i.jobTitle,
        jobTopic: i.jobTopic,
        questions: i.questions,
        status: i.status,
        totalScore: i.totalScore,
        maxScore: i.maxScore,
        difficulty: i.difficulty,
        interviewType: i.interviewType,
        fromResume: i.fromResume,
        createdAt: i.createdAt,
      })),
      recentActivity: completed.slice(0, 5).map((i) => ({
        role: i.jobTitle,
        score: i.totalScore,
        maxScore: i.maxScore,
        date: i.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const completedInterviews = await Interview.countDocuments({ status: "completed" });
    res.json({ totalUsers, totalInterviews, completedInterviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const allBadges = getAllBadges();
    const earned = getBadgeDetails(user.badges || []);

    res.json({
      earned,
      all: allBadges.map((b) => ({
        ...b,
        unlocked: (user.badges || []).includes(b.id),
      })),
      totalEarned: earned.length,
      totalAvailable: allBadges.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfilePhoto,
  updateSettings,
  getDashboard,
  getPlatformStats,
  getAnalytics,
  getLeaderboard,
  getAchievements,
};
