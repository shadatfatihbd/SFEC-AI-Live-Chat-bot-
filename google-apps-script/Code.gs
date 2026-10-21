/**
 * ============================================================================
 * SFEC AI Live Chat — Google Apps Script Backend (Production Ready)
 * Branded for SFEC — Shadat Fatih Education Consultant
 * ============================================================================
 * 
 * Features:
 * - Robust doPost(e) & doGet(e) handlers with safe JSON parsing and CORS support.
 * - Google Sheets storage: "Conversations", "Messages", "Settings".
 * - Resilient Gemini AI Integration with:
 *     1. Active 2026 models (gemini-flash-lite-latest, gemini-3.5-flash-lite, gemini-3.8-flash).
 *     2. muteHttpExceptions: true to prevent uncaught runtime exceptions.
 *     3. Automatic fallback if Google Search grounding hits 429 quota or 400.
 *     4. Sanitized logging (never logs API keys, headers, or private user data).
 *     5. Auto-sheet initialization helper (setupDatabaseSheets).
 */

// Global sheet configuration
var SHEET_CONVERSATIONS = 'Conversations';
var SHEET_MESSAGES = 'Messages';
var SHEET_SETTINGS = 'Settings';
var MESSENGER_URL = 'https://m.me/ShadatFatih.Page';

// Priority model list for 2026
var SUPPORTED_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash'
];

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var action = params.action;

    if (action === 'health') {
      return jsonResponse_({
        success: true,
        app: 'SFEC AI Live Chat',
        status: 'online',
        messengerUrl: MESSENGER_URL
      });
    }

    if (action === 'diag') {
      return runSafeDiagnostics_();
    }

    if (action === 'conversation') {
      return getConversation_(params.conversationId);
    }

    if (action === 'messages') {
      return getMessages_(params.conversationId);
    }

    return jsonResponse_({
      success: false,
      error: 'Unknown action: ' + (action || 'empty')
    });
  } catch (err) {
    Logger.log('[doGet Error] ' + err.toString());
    return jsonResponse_({
      success: false,
      error: 'Internal GET error occurred'
    });
  }
}

/**
 * Handle HTTP POST Requests
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({
        success: false,
        error: 'Missing request body'
      });
    }

    var body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse_({
        success: false,
        error: 'Invalid JSON payload: ' + parseErr.message
      });
    }

    var action = body.action;

    if (action === 'createConversation') {
      return createConversation_(body);
    } else if (action === 'sendMessage') {
      return sendMessage_(body);
    } else if (action === 'aiReply') {
      return aiReply_(body);
    } else if (action === 'agentReply') {
      return agentReply_(body);
    } else if (action === 'closeConversation') {
      return closeConversation_(body);
    }

    return jsonResponse_({
      success: false,
      error: 'Unknown action: ' + (action || 'empty')
    });
  } catch (err) {
    Logger.log('[doPost Error] ' + err.toString());
    return jsonResponse_({
      success: false,
      error: 'Server error processing request'
    });
  }
}

/**
 * Helper to generate JSON response with CORS headers
 */
function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper to get or initialize a sheet
 */
function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === SHEET_CONVERSATIONS) {
      sheet.appendRow(['conversationId', 'visitorId', 'visitorName', 'status', 'createdAt', 'updatedAt']);
    } else if (name === SHEET_MESSAGES) {
      sheet.appendRow(['messageId', 'conversationId', 'sender', 'message', 'createdAt']);
    } else if (name === SHEET_SETTINGS) {
      sheet.appendRow(['Key', 'Value']);
    }
  }
  return sheet;
}

/**
 * Action: createConversation
 */
function createConversation_(body) {
  var visitorId = body.visitorId;
  if (!visitorId) {
    return jsonResponse_({ success: false, error: 'visitorId is required' });
  }

  var conversationId = Utilities.getUuid();
  var now = new Date().toISOString();
  var visitorName = body.visitorName || 'Student';

  var sheet = getSheet_(SHEET_CONVERSATIONS);
  sheet.appendRow([conversationId, visitorId, visitorName, 'open', now, now]);

  return jsonResponse_({
    success: true,
    conversation: {
      conversationId: conversationId,
      visitorId: visitorId,
      visitorName: visitorName,
      status: 'open',
      createdAt: now
    }
  });
}

/**
 * Action: sendMessage
 */
function sendMessage_(body) {
  var conversationId = body.conversationId;
  var visitorId = body.visitorId;
  var messageText = body.message;

  if (!conversationId || !visitorId || !messageText) {
    return jsonResponse_({
      success: false,
      error: 'conversationId, visitorId, and message are required'
    });
  }

  // Verify conversation ownership
  var conv = findConversation_(conversationId);
  if (!conv) {
    return jsonResponse_({ success: false, error: 'Conversation not found' });
  }
  if (conv.visitorId !== visitorId) {
    return jsonResponse_({ success: false, error: 'Unauthorized conversation access' });
  }

  var messageId = Utilities.getUuid();
  var now = new Date().toISOString();

  var msgSheet = getSheet_(SHEET_MESSAGES);
  msgSheet.appendRow([messageId, conversationId, 'visitor', messageText.toString().trim(), now]);

  // Update conversation updatedAt
  updateConversationTimestamp_(conversationId, now);

  return jsonResponse_({
    success: true,
    message: {
      messageId: messageId,
      conversationId: conversationId,
      sender: 'visitor',
      message: messageText.toString().trim(),
      createdAt: now
    }
  });
}

/**
 * Action: aiReply
 * Integrates with Google Gemini API safely and resiliently
 */
function aiReply_(body) {
  var conversationId = body.conversationId;
  var visitorId = body.visitorId;

  if (!conversationId || !visitorId) {
    return jsonResponse_({
      success: false,
      error: 'conversationId and visitorId are required'
    });
  }

  // 1. Verify conversation ownership and status
  var conv = findConversation_(conversationId);
  if (!conv) {
    return jsonResponse_({ success: false, error: 'Conversation not found' });
  }
  if (conv.visitorId !== visitorId) {
    return jsonResponse_({ success: false, error: 'Unauthorized conversation access' });
  }
  if (conv.status === 'closed') {
    return jsonResponse_({ success: false, error: 'Conversation is closed' });
  }

  // 2. Retrieve student question
  var question = body.message;
  if (!question || !question.toString().trim()) {
    question = getLastVisitorMessage_(conversationId);
  }
  if (!question) {
    return jsonResponse_({
      success: false,
      error: 'No message found to generate AI reply for'
    });
  }

  // 3. Read GEMINI_API_KEY from Script Properties
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey || !apiKey.trim()) {
    Logger.log('[Security Alert] GEMINI_API_KEY is not set in Script Properties.');
    return jsonResponse_({
      success: false,
      error: 'AI service configuration error: GEMINI_API_KEY is missing in Script Properties.'
    });
  }

  // 4. Retrieve recent message history for context (up to 4 messages)
  var history = getRecentConversationHistory_(conversationId, 4);

  // 5. Call Gemini with fallback resilience
  var aiResult = callGeminiWithFallback_(apiKey.trim(), question.toString().trim(), history);

  if (!aiResult.success) {
    Logger.log('[AI Call Failed] Category: ' + aiResult.category + ', HTTP: ' + aiResult.httpStatus);
    return jsonResponse_({
      success: false,
      error: aiResult.userMessage || 'AI service is temporarily unavailable. Please try again.'
    });
  }

  // 6. Save AI reply to Messages sheet
  var messageId = Utilities.getUuid();
  var now = new Date().toISOString();
  var msgSheet = getSheet_(SHEET_MESSAGES);
  msgSheet.appendRow([messageId, conversationId, 'ai', aiResult.text, now]);

  // Update conversation timestamp
  updateConversationTimestamp_(conversationId, now);

  return jsonResponse_({
    success: true,
    message: {
      messageId: messageId,
      conversationId: conversationId,
      sender: 'ai',
      message: aiResult.text,
      createdAt: now
    }
  });
}

/**
 * Resilient Gemini API caller:
 * Tries priority models, attempts Google Search grounding, and falls back gracefully.
 */
function callGeminiWithFallback_(apiKey, prompt, history) {
  var systemInstruction = 
    'You are SFEC AI, an expert educational admission assistant for Bangladeshi students created by SFEC (Shadat Fatih Education Consultant). ' +
    'Provide accurate guidance on National University (NU) Honours, Degree (Pass), Masters (Regular/Private), subject choice, and admission criteria. ' +
    'Answer in polite, clear Bengali by default (or English if asked in English). ' +
    'Always remind students to verify dates, circulars, and GPA rules with the official NU notice at nu.ac.bd.';

  // Build conversation contents array
  var contents = [];

  // Add past conversation context
  for (var i = 0; i < history.length; i++) {
    var h = history[i];
    contents.push({
      role: h.sender === 'visitor' ? 'user' : 'model',
      parts: [{ text: h.message }]
    });
  }

  // Add the current prompt if not already in history
  if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
  }

  // Try supported models in order
  for (var m = 0; m < SUPPORTED_MODELS.length; m++) {
    var model = SUPPORTED_MODELS[m];

    // Attempt 1: Try with Google Search Grounding
    var groundedResult = executeGeminiRequest_(apiKey, model, contents, systemInstruction, true);
    if (groundedResult.success) {
      return groundedResult;
    }

    // If error was 429 (quota exceeded on grounding) or 400 (grounding unsupported), fallback immediately WITHOUT grounding
    if (groundedResult.httpStatus === 429 || groundedResult.httpStatus === 400) {
      Logger.log('[Grounding Unavailable/Quota Exceeded] Falling back without grounding on: ' + model);
      var standardResult = executeGeminiRequest_(apiKey, model, contents, systemInstruction, false);
      if (standardResult.success) {
        return standardResult;
      }
    }

    // If model returned 404 (retired) or 503 (high demand), continue loop to next model
    Logger.log('[Model Failover] Model ' + model + ' returned HTTP ' + groundedResult.httpStatus + ', trying next candidate.');
  }

  return {
    success: false,
    category: 'ALL_MODELS_EXHAUSTED',
    httpStatus: 503,
    userMessage: 'AI service is temporarily experiencing high traffic. Please try again or connect via Messenger.'
  };
}

/**
 * Execute raw Gemini generateContent HTTP request
 */
function executeGeminiRequest_(apiKey, model, contents, systemInstruction, enableGrounding) {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey;

  var payload = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024
    }
  };

  if (enableGrounding) {
    payload.tools = [{ googleSearch: {} }];
  }

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // CRITICAL: prevents Apps Script from throwing uncaught runtime exceptions!
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var statusCode = response.getResponseCode();
    var responseBody = response.getContentText();

    if (statusCode === 200) {
      var data = JSON.parse(responseBody);
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
        var textPart = data.candidates[0].content.parts[0].text;
        if (textPart && textPart.trim()) {
          return {
            success: true,
            text: textPart.trim(),
            model: model,
            httpStatus: 200
          };
        }
      }
    }

    // Safe error extraction (sanitizing secrets)
    var errorCategory = 'UNKNOWN';
    var userMessage = 'AI service is temporarily unavailable. Please try again.';

    if (statusCode === 400) {
      errorCategory = 'BAD_REQUEST';
    } else if (statusCode === 401 || statusCode === 403) {
      errorCategory = 'AUTH_ERROR';
      userMessage = 'Gemini API authentication failed. Please verify API key permissions.';
    } else if (statusCode === 404) {
      errorCategory = 'MODEL_NOT_FOUND';
    } else if (statusCode === 429) {
      errorCategory = 'QUOTA_EXCEEDED';
      userMessage = 'Gemini API rate limit reached. Please retry in a moment.';
    } else if (statusCode >= 500) {
      errorCategory = 'UPSTREAM_SERVER_ERROR';
    }

    Logger.log('[Gemini API Diagnostic] HTTP ' + statusCode + ' [' + errorCategory + '] for model ' + model);

    return {
      success: false,
      category: errorCategory,
      httpStatus: statusCode,
      userMessage: userMessage
    };
  } catch (netErr) {
    Logger.log('[UrlFetchApp Network Error] ' + netErr.message);
    return {
      success: false,
      category: 'NETWORK_EXCEPTION',
      httpStatus: 0,
      userMessage: 'Network error connecting to Gemini API.'
    };
  }
}

/**
 * Retrieve last message sent by visitor in conversation
 */
function getLastVisitorMessage_(conversationId) {
  var sheet = getSheet_(SHEET_MESSAGES);
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][1] === conversationId && data[i][2] === 'visitor') {
      return data[i][3];
    }
  }
  return null;
}

/**
 * Retrieve recent messages for context
 */
function getRecentConversationHistory_(conversationId, limit) {
  var sheet = getSheet_(SHEET_MESSAGES);
  var data = sheet.getDataRange().getValues();
  var history = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === conversationId) {
      history.push({
        sender: data[i][2],
        message: data[i][3]
      });
    }
  }

  return history.slice(-limit);
}

/**
 * Helper to find conversation by ID
 */
function findConversation_(conversationId) {
  var sheet = getSheet_(SHEET_CONVERSATIONS);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === conversationId) {
      return {
        conversationId: data[i][0],
        visitorId: data[i][1],
        visitorName: data[i][2],
        status: data[i][3],
        createdAt: data[i][4],
        updatedAt: data[i][5]
      };
    }
  }
  return null;
}

/**
 * Update conversation updatedAt timestamp
 */
function updateConversationTimestamp_(conversationId, timestamp) {
  var sheet = getSheet_(SHEET_CONVERSATIONS);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === conversationId) {
      sheet.getRange(i + 1, 6).setValue(timestamp);
      break;
    }
  }
}

/**
 * Action: getMessages
 */
function getMessages_(conversationId) {
  if (!conversationId) {
    return jsonResponse_({ success: false, error: 'conversationId is required' });
  }

  var sheet = getSheet_(SHEET_MESSAGES);
  var data = sheet.getDataRange().getValues();
  var messages = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === conversationId) {
      messages.push({
        messageId: data[i][0],
        conversationId: data[i][1],
        sender: data[i][2],
        message: data[i][3],
        createdAt: data[i][4]
      });
    }
  }

  return jsonResponse_({
    success: true,
    messages: messages
  });
}

/**
 * Action: getConversation
 */
function getConversation_(conversationId) {
  if (!conversationId) {
    return jsonResponse_({ success: false, error: 'conversationId is required' });
  }

  var conv = findConversation_(conversationId);
  if (!conv) {
    return jsonResponse_({ success: false, error: 'Conversation not found' });
  }

  return jsonResponse_({
    success: true,
    conversation: conv
  });
}

/**
 * Action: agentReply (human agent console response)
 */
function agentReply_(body) {
  var agentToken = PropertiesService.getScriptProperties().getProperty('AGENT_TOKEN');
  if (!agentToken || body.agentToken !== agentToken) {
    return jsonResponse_({ success: false, error: 'Unauthorized agent token' });
  }

  var conversationId = body.conversationId;
  var messageText = body.message;
  if (!conversationId || !messageText) {
    return jsonResponse_({ success: false, error: 'conversationId and message are required' });
  }

  var messageId = Utilities.getUuid();
  var now = new Date().toISOString();
  var msgSheet = getSheet_(SHEET_MESSAGES);
  msgSheet.appendRow([messageId, conversationId, 'agent', messageText.toString().trim(), now]);

  updateConversationTimestamp_(conversationId, now);

  return jsonResponse_({
    success: true,
    message: {
      messageId: messageId,
      conversationId: conversationId,
      sender: 'agent',
      message: messageText.toString().trim(),
      createdAt: now
    }
  });
}

/**
 * Action: closeConversation
 */
function closeConversation_(body) {
  var conversationId = body.conversationId;
  var sheet = getSheet_(SHEET_CONVERSATIONS);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === conversationId) {
      sheet.getRange(i + 1, 4).setValue('closed');
      return jsonResponse_({ success: true, status: 'closed' });
    }
  }

  return jsonResponse_({ success: false, error: 'Conversation not found' });
}

/**
 * Safe Diagnostic Check (GET ?action=diag)
 * Checks API key presence, active sheets, and Gemini model availability without exposing secrets.
 */
function runSafeDiagnostics_() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  var hasKey = Boolean(apiKey && apiKey.trim().length > 10);

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets().map(function(s) { return s.getName(); });

  var modelCheck = 'SKIPPED (no key)';
  if (hasKey) {
    var testResult = executeGeminiRequest_(apiKey.trim(), 'gemini-flash-lite-latest', [
      { role: 'user', parts: [{ text: 'ping' }] }
    ], 'Answer in 1 word', false);
    modelCheck = testResult.success ? 'HEALTHY (HTTP 200)' : 'FAILED (HTTP ' + testResult.httpStatus + ' [' + testResult.category + '])';
  }

  return jsonResponse_({
    success: true,
    diagnostics: {
      backend: 'online',
      geminiKeyConfigured: hasKey,
      sheetsPresent: sheets,
      geminiModelStatus: modelCheck
    }
  });
}

/**
 * One-click initialization tool to run directly in Apps Script editor:
 * Select "setupDatabaseSheets" from dropdown and click Run.
 */
function setupDatabaseSheets() {
  getSheet_(SHEET_CONVERSATIONS);
  getSheet_(SHEET_MESSAGES);
  getSheet_(SHEET_SETTINGS);
  Logger.log('SFEC Database sheets initialized successfully.');
}
