const cache = new Map();
const CACHE_TTL_MS = 8 * 60 * 1000; // 8 minutes cache

/**
 * Executes a GraphQL query against LeetCode's public GraphQL endpoint.
 */
async function queryLeetCodeGraphQL(query, variables) {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://leetcode.com",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode GraphQL responded with HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors[0].message || "LeetCode GraphQL error");
  }

  return data.data;
}

/**
 * Main fetch function with fallback to trusted open API wrappers if direct GraphQL blocks IP/cloud.
 */
async function fetchLeetCodeUserData(username) {
  const cleanUsername = username.trim().toLowerCase();
  const cacheKey = `leetcode_${cleanUsername}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    console.log(`⚡ Returning cached LeetCode stats for ${cleanUsername}`);
    return { ...cached.data, cached: true };
  }

  try {
    const graphqlQuery = `
      query userProfileData($username: String!) {
        matchedUser(username: $username) {
          username
          githubUrl
          twitterUrl
          linkedinUrl
          profile {
            realName
            userAvatar
            ranking
            reputation
            starRating
            aboutMe
            school
            countryName
            company
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          submissionCalendar
        }
        allQuestionsCount {
          difficulty
          count
        }
        userContestRanking(userSlug: $username) {
          attendedContestsCount
          rating
          globalRanking
          topPercentage
        }
        recentSubmissionList(username: $username, limit: 10) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

    const data = await queryLeetCodeGraphQL(graphqlQuery, { username: cleanUsername });

    if (!data || !data.matchedUser) {
      throw new Error(`LeetCode user '${cleanUsername}' not found.`);
    }

    const user = data.matchedUser;
    const acStats = user.submitStatsGlobal.acSubmissionNum || [];
    const totalStats = user.submitStatsGlobal.totalSubmissionNum || [];
    const allQuestions = data.allQuestionsCount || [];

    const getAcCount = (diff) => {
      const item = acStats.find((s) => s.difficulty === diff);
      return item ? item.count : 0;
    };

    const getTotalSubmissions = () => {
      const item = totalStats.find((s) => s.difficulty === "All");
      return item ? item.submissions : 0;
    };

    const getAcSubmissions = () => {
      const item = acStats.find((s) => s.difficulty === "All");
      return item ? item.submissions : 0;
    };

    const totalAcSubmissions = getAcSubmissions();
    const totalSubmissions = getTotalSubmissions();
    const acceptanceRate = totalSubmissions > 0 ? ((totalAcSubmissions / totalSubmissions) * 100).toFixed(1) : "0.0";

    // Process submission calendar for streak and activity heatmap
    let submissionCalendar = {};
    try {
      submissionCalendar = JSON.parse(user.submissionCalendar || "{}");
    } catch {
      submissionCalendar = {};
    }

    // Calculate current streak
    const timestamps = Object.keys(submissionCalendar).map(Number).sort((a, b) => b - a);
    let currentStreak = 0;
    const nowSec = Math.floor(Date.now() / 1000);
    const daySec = 86400;
    let checkDay = Math.floor(nowSec / daySec);

    // Check if user submitted today or yesterday
    const submissionDays = new Set(timestamps.map((ts) => Math.floor(ts / daySec)));
    if (submissionDays.has(checkDay) || submissionDays.has(checkDay - 1)) {
      if (!submissionDays.has(checkDay)) checkDay--; // Start from yesterday if not solved today yet
      while (submissionDays.has(checkDay)) {
        currentStreak++;
        checkDay--;
      }
    }

    const formattedData = {
      username: user.username,
      realName: user.profile?.realName || user.username,
      avatar: user.profile?.userAvatar || "https://assets.leetcode.com/users/default_avatar.jpg",
      ranking: user.profile?.ranking || null,
      reputation: user.profile?.reputation || 0,
      totalSolved: getAcCount("All"),
      easySolved: getAcCount("Easy"),
      mediumSolved: getAcCount("Medium"),
      hardSolved: getAcCount("Hard"),
      totalEasy: allQuestions.find((q) => q.difficulty === "Easy")?.count || 800,
      totalMedium: allQuestions.find((q) => q.difficulty === "Medium")?.count || 1600,
      totalHard: allQuestions.find((q) => q.difficulty === "Hard")?.count || 700,
      acceptanceRate: parseFloat(acceptanceRate),
      contestRating: data.userContestRanking ? Math.round(data.userContestRanking.rating) : null,
      contestGlobalRanking: data.userContestRanking?.globalRanking || null,
      topPercentage: data.userContestRanking?.topPercentage || null,
      attendedContests: data.userContestRanking?.attendedContestsCount || 0,
      currentStreak,
      recentSubmissions: data.recentSubmissionList || [],
      submissionCalendar,
      lastSynced: new Date().toISOString(),
      cached: false,
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: formattedData });
    return formattedData;
  } catch (error) {
    console.warn(`⚠️ Primary GraphQL query failed for ${username}: ${error.message}. Trying REST API fallback...`);
    
    // Fallback to trusted public API wrapper if direct GraphQL was blocked or rate limited
    const fallbackResponse = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${cleanUsername}`);
    if (!fallbackResponse.ok) {
      throw new Error(`Could not fetch LeetCode profile for username '${cleanUsername}'`);
    }

    const fbData = await fallbackResponse.json();
    if (fbData.errors || !fbData.totalSolved) {
      throw new Error(`LeetCode profile '${cleanUsername}' not found`);
    }

    const fallbackFormatted = {
      username: cleanUsername,
      realName: cleanUsername,
      avatar: "https://assets.leetcode.com/users/default_avatar.jpg",
      ranking: fbData.ranking || null,
      reputation: fbData.reputation || 0,
      totalSolved: fbData.totalSolved || 0,
      easySolved: fbData.easySolved || 0,
      mediumSolved: fbData.mediumSolved || 0,
      hardSolved: fbData.hardSolved || 0,
      totalEasy: 800,
      totalMedium: 1600,
      totalHard: 700,
      acceptanceRate: parseFloat(fbData.acceptanceRate || 0),
      contestRating: fbData.contributionPoint || null,
      contestGlobalRanking: null,
      topPercentage: null,
      attendedContests: 0,
      currentStreak: fbData.streak || 0,
      recentSubmissions: fbData.recentSubmissions || [],
      submissionCalendar: fbData.submissionCalendar || {},
      lastSynced: new Date().toISOString(),
      cached: false,
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: fallbackFormatted });
    return fallbackFormatted;
  }
}

module.exports = { fetchLeetCodeUserData };
