const STUDENTS_SHEET = "Students";
const PROJECTS_SHEET = "Projects";
const VOTES_SHEET = "Votes";
const SETTINGS_SHEET = "Settings";

// Cache TTLs (seconds)
const SETTINGS_TTL = 300;    // 5 min - refresh if admin changes voting status
const ROSTER_TTL = 1800;     // 30 min - the student roster rarely changes mid-event
const PROJECTS_TTL = 60;     // 1 min - project details and members can be edited during setup
const VOTED_SET_TTL = 1800;  // 30 min - rebuilt from cache on every vote anyway
const RESULTS_TTL = 10;      // 10s - keeps admin dashboard near-real-time without hammering Sheets
const PROJECTS_CACHE_KEY = "projects_with_members_v1";

// ========================================
// MAIN ENTRY POINT
// ========================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || "";

    if (action === "verifyStudent") {
      return verifyStudent(data.studentNumber);
    }
    if (action === "submitVote") {
      return submitVote(data.studentNumber, data.projectId);
    }
    if (action === "getResults") {
      return getResults();
    }
    if (action === "adminLogin") {
      return verifyAdmin(data.password);
    }
    if (action === "setVotingStatus") {
      if (!isAdminAuthorized(data.adminPassword)) {
        return response(false, "Administrator authorization failed.", "unauthorized");
      }
      return setVotingStatus(data.isOpen);
    }
    if (action === "clearCache") {
      if (!isAdminAuthorized(data.adminPassword)) {
        return response(false, "Administrator authorization failed.", "unauthorized");
      }
      return clearAllCaches();
    }

    return response(false, "Invalid action.", "invalid_action");
  } catch (error) {
    Logger.log(error);
    return response(false, "An unexpected error occurred.", "server_error");
  }
}

function doGet(e) {
  return response(true, "API is running.", "active");
}

function isAdminAuthorized(password) {
  const configuredPassword = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
  return Boolean(configuredPassword) && String(password || "") === configuredPassword;
}

function verifyAdmin(password) {
  if (!PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD")) {
    return response(false, "Admin password is not configured in Apps Script properties.", "admin_not_configured");
  }
  if (!isAdminAuthorized(password)) {
    return response(false, "Incorrect administrator password.", "unauthorized");
  }
  return response(true, "Administrator verified.", "admin_verified");
}

// ========================================
// CACHE LAYER
// Every one of these avoids a live Sheets API call on the common path.
// The script cache is shared across all users/executions of this project.
// ========================================

function getSettingsCached() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get("settings");
  if (cached) return JSON.parse(cached);

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SETTINGS_SHEET);
  if (!sheet) throw new Error("Settings sheet not found.");

  const data = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0]).trim();
    if (key) settings[key] = String(data[i][1]).trim();
  }
  cache.put("settings", JSON.stringify(settings), SETTINGS_TTL);
  return settings;
}

function isVotingOpenFromSettings(settings) {
  return String(settings["voting_open"] || "").toUpperCase() === "TRUE";
}

function getStudentSetCached() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get("students");
  if (cached) return new Set(JSON.parse(cached));

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(STUDENTS_SHEET);
  if (!sheet) throw new Error("Students sheet not found.");

  const data = sheet.getDataRange().getValues();
  const ids = data.slice(1).map((r) => String(r[0]).trim()).filter(Boolean);
  cache.put("students", JSON.stringify(ids), ROSTER_TTL);
  return new Set(ids);
}

function getProjectsCached() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(PROJECTS_CACHE_KEY);
  if (cached) return JSON.parse(cached);

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(PROJECTS_SHEET);
  if (!sheet) throw new Error("Projects sheet not found.");

  const data = sheet.getDataRange().getValues();
  const projects = data
    .slice(1)
    .filter((r) => r[0] !== "")
    .map((r) => ({
      id: String(r[0]).trim(),
      title: String(r[1]).trim(),
      group: String(r[2]).trim(),
      image: String(r[3]).trim(),
      members: String(r[4] || "").split(/\r?\n/).map((name) => name.trim()).filter(Boolean)
    }));
  cache.put(PROJECTS_CACHE_KEY, JSON.stringify(projects), PROJECTS_TTL);
  return projects;
}

function getVotedSetCached() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get("votedStudents");
  if (cached) return new Set(JSON.parse(cached));
  return rebuildVotedSetFromSheet();
}

function rebuildVotedSetFromSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(VOTES_SHEET);
  if (!sheet) throw new Error("Votes sheet not found.");

  const data = sheet.getDataRange().getValues();
  const ids = data.slice(1).map((r) => String(r[0]).trim()).filter(Boolean);
  CacheService.getScriptCache().put("votedStudents", JSON.stringify(ids), VOTED_SET_TTL);
  return new Set(ids);
}

function addVotedStudentToCache(studentNumber, currentSet) {
  currentSet.add(studentNumber);
  CacheService.getScriptCache().put(
    "votedStudents",
    JSON.stringify(Array.from(currentSet)),
    VOTED_SET_TTL
  );
}

function getVotesRowsCached() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get("votesRows");
  if (cached) return JSON.parse(cached);

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(VOTES_SHEET);
  if (!sheet) throw new Error("Votes sheet not found.");

  const data = sheet.getDataRange().getValues();
  const rows = data
    .slice(1)
    .filter((r) => r[0] !== "")
    .map((r) => [String(r[0]).trim(), String(r[1]).trim()]);
  cache.put("votesRows", JSON.stringify(rows), RESULTS_TTL);
  return rows;
}

function invalidateSettingsCache() {
  CacheService.getScriptCache().remove("settings");
}

function clearAllCaches() {
  CacheService.getScriptCache().removeAll(["settings", "students", "projects", PROJECTS_CACHE_KEY, "votedStudents", "votesRows"]);
  return response(true, "Cache cleared.", "cache_cleared");
}

// ========================================
// SETTINGS TOGGLE
// ========================================

function setVotingStatus(isOpen) {
  if (typeof isOpen !== "boolean") {
    return response(false, "Voting status must be true or false.", "invalid_request");
  }
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = spreadsheet.getSheetByName(SETTINGS_SHEET);
  if (!settingsSheet) {
    return response(false, "Settings sheet not found.", "server_error");
  }

  const data = settingsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === "voting_open") {
      settingsSheet.getRange(i + 1, 2).setValue(isOpen);
      invalidateSettingsCache(); // critical: without this, stale cache could keep voting "open" or "closed" for up to SETTINGS_TTL
      return response(true, isOpen ? "Voting is now open." : "Voting is now closed.", isOpen ? "voting_open" : "voting_closed");
    }
  }

  return response(false, "Voting status setting not found.", "server_error");
}

// ========================================
// VERIFY STUDENT
// ========================================

function verifyStudent(studentNumber) {
  try {
    const settings = getSettingsCached();
    if (!isVotingOpenFromSettings(settings)) {
      return response(false, "Voting is currently closed.", "voting_closed");
    }

    studentNumber = String(studentNumber || "").trim();
    if (!studentNumber) {
      return response(false, "Student number is required.", "invalid_student");
    }

    const studentSet = getStudentSetCached();
    if (!studentSet.has(studentNumber)) {
      return response(false, "Student number not found.", "invalid_student");
    }

    const votedSet = getVotedSetCached();
    if (votedSet.has(studentNumber)) {
      return response(false, "You have already voted.", "already_voted");
    }

    return response(true, "Student verified.", "eligible");
  } catch (error) {
    Logger.log(error);
    return response(false, "Voting system is not configured correctly.", "server_error");
  }
}

// ========================================
// SUBMIT VOTE
// All read-only checks happen BEFORE the lock, using cached data.
// The lock only wraps the duplicate-vote check + the actual write,
// which is the only part that truly needs to be serialized.
// ========================================

function submitVote(studentNumber, projectId) {
  try {
    studentNumber = String(studentNumber || "").trim();
    projectId = String(projectId || "").trim();

    if (!studentNumber || !projectId) {
      return response(false, "Student number and project are required.", "invalid_request");
    }

    const settings = getSettingsCached();
    if (!isVotingOpenFromSettings(settings)) {
      return response(false, "Voting is currently closed.", "voting_closed");
    }

    const studentSet = getStudentSetCached();
    if (!studentSet.has(studentNumber)) {
      return response(false, "Student number not found.", "invalid_student");
    }

    const projects = getProjectsCached();
    if (!projects.some((p) => p.id === projectId)) {
      return response(false, "Invalid project.", "invalid_project");
    }

    // --- Critical section: only the duplicate check + write need exclusivity ---
    const lock = LockService.getScriptLock();
    let gotLock = false;
    try {
      gotLock = lock.tryLock(5000); // fail fast instead of blocking 10s under heavy load
      if (!gotLock) {
        return response(false, "The system is busy recording votes. Please try again in a few seconds.", "server_busy");
      }

      const votedSet = getVotedSetCached();
      if (votedSet.has(studentNumber)) {
        return response(false, "You have already voted.", "already_voted");
      }

      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const votesSheet = spreadsheet.getSheetByName(VOTES_SHEET);
      votesSheet.appendRow([studentNumber, projectId, new Date()]);

      addVotedStudentToCache(studentNumber, votedSet);

      return response(true, "Vote successfully recorded.", "vote_recorded");
    } finally {
      if (gotLock) lock.releaseLock();
    }
  } catch (error) {
    Logger.log(error);
    return response(false, "An unexpected error occurred.", "server_error");
  }
}

// ========================================
// RESULTS
// ========================================

function getResults() {
  try {
    const settings = getSettingsCached();
    const votingOpen = isVotingOpenFromSettings(settings);

    const studentSet = getStudentSetCached();
    const projects = getProjectsCached();
    const votesRows = getVotesRowsCached();

    const voteCounts = {};
    votesRows.forEach(([, projectId]) => {
      if (projectId) voteCounts[projectId] = (voteCounts[projectId] || 0) + 1;
    });

    const totalVotes = votesRows.length;
    const totalStudents = studentSet.size;

    const projectResults = projects.map((p) => {
      const count = voteCounts[p.id] || 0;
      return {
        id: p.id,
        title: p.title,
        group: p.group,
        members: p.members,
        image: convertDriveUrl(p.image),
        votes: count,
        percentage: totalVotes > 0 ? Number(((count / totalVotes) * 100).toFixed(1)) : 0
      };
    });

    return responseWithData(true, "results", "Results retrieved.", {
      votingOpen,
      totalStudents,
      totalVotes,
      turnout: totalStudents > 0 ? Number(((totalVotes / totalStudents) * 100).toFixed(1)) : 0,
      projects: projectResults
    });
  } catch (error) {
    Logger.log(error);
    return response(false, "Voting system is not configured correctly.", "server_error");
  }
}

function convertDriveUrl(url) {
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return url;
  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
}

function response(success, message, status) {
  return ContentService.createTextOutput(JSON.stringify({ success, status, message })).setMimeType(
    ContentService.MimeType.JSON
  );
}

function responseWithData(success, status, message, extraData) {
  return ContentService.createTextOutput(
    JSON.stringify({ success, status, message, data: extraData })
  ).setMimeType(ContentService.MimeType.JSON);
}

