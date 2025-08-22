// ==UserScript==
// @name         PractiSign - Auto PractiScore Registration
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Auto-register for PractiScore matches with configurable preferences
// @author       You
// @match        https://practiscore.com/*
// @match        file://*
// @match        http://localhost/*
// @match        http://127.0.0.1/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

// Add CSS styles
GM_addStyle(`
/* PractiSign UI Styles */
#practisign-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
}

#practisign-controls {
    background: #2c3e50;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 200px;
}

#practisign-status {
    color: #ecf0f1;
    font-weight: 500;
    flex: 1;
    text-align: center;
    padding: 4px 8px;
    border-radius: 4px;
    background: #34495e;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-idle {
    background: #34495e !important;
    color: #bdc3c7 !important;
}

.status-watching {
    background: #f39c12 !important;
    color: #fff !important;
    animation: pulse 2s infinite;
}

.status-hot {
    background: #e74c3c !important;
    color: #fff !important;
    animation: pulse 0.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

#practisign-arm {
    background: #27ae60;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
    min-width: 60px;
}

#practisign-arm:hover {
    background: #229954;
    transform: translateY(-1px);
}

#practisign-arm:active {
    transform: translateY(0);
}

#practisign-config {
    background: #3498db;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
}

#practisign-config:hover {
    background: #2980b9;
    transform: translateY(-1px);
}

#practisign-panel {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-top: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 1px solid #ddd;
    max-width: 350px;
    max-height: 80vh;
    overflow-y: auto;
}

#practisign-panel h3 {
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 16px;
    font-weight: 600;
}

.config-group {
    margin-bottom: 15px;
}

.config-group label {
    display: block;
    margin-bottom: 5px;
    color: #34495e;
    font-weight: 500;
    font-size: 13px;
}

.config-group input[type="text"] {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}

.config-group input[type="text"]:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.config-group input[type="checkbox"] {
    margin-right: 8px;
}

.checkbox-list {
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    background: #f9f9f9;
}

.checkbox-list label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    cursor: pointer;
}

.checkbox-list label:hover {
    background: #f0f0f0;
    padding: 2px 4px;
    border-radius: 2px;
}

.config-group button {
    background: #27ae60;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    margin-right: 10px;
    transition: all 0.2s;
}

.config-group button:hover {
    background: #229954;
}

#config-cancel {
    background: #95a5a6 !important;
}

#config-cancel:hover {
    background: #7f8c8d !important;
}

/* Toast notifications */
.practisign-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #2c3e50;
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    font-size: 14px;
    font-weight: 500;
}

.practisign-toast.show {
    transform: translateX(0);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    #practisign-container {
        bottom: 10px;
        right: 10px;
        left: 10px;
    }
    
    #practisign-controls {
        min-width: auto;
        width: 100%;
    }
    
    #practisign-panel {
        max-width: none;
        margin-top: 10px;
    }
    
    .practisign-toast {
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
`);

(function () {
  "use strict";

  // Configuration and state management
  let config = {
    timezone: "America/Chicago",
    sport: "USPSA",
    division: "CO",
    class: "B",
    powerFactor: "Major",
    categories: [],
    memberIdLabel: "USPSA #",
    memberIdValue: "",
    memberNumber: "",
    mailingAddress: "",
    phoneNumber: "",
    matchShirt: "L",
    preregCode: null,
    agreeWaiver: true,
    stopAtStripe: true,
    dryRun: false,
    pollCadence: { farMs: 30000, nearMs: 5000, finalMs: 600 },
  };

  // Runtime state
  let armed = false;
  let inFlight = false;
  let mode = "far";
  let currentTimer = null;
  let observer = null;

  // Load saved config
  function loadConfig() {
    const saved = GM_getValue("practisign_config");
    if (saved) {
      config = { ...config, ...saved };
    }
  }

  // Save config
  function saveConfig() {
    GM_setValue("practisign_config", config);
  }

  // UI Components
  function createControlUI() {
    const container = document.createElement("div");
    container.id = "practisign-container";
    container.innerHTML = `
            <div id="practisign-controls">
                <div id="practisign-status">Idle</div>
                <button id="practisign-arm">Arm</button>
                <button id="practisign-refresh" title="Refresh page">🔄</button>
                <button id="practisign-config">⚙️</button>
            </div>
            <div id="practisign-panel" style="display: none;">
                <h3>PractiSign Configuration</h3>
                <div class="config-group">
                    <label>Division:</label>
                    <select id="config-division">
                        <option value="CO">CO (Carry Optics)</option>
                        <option value="LO">LO (Limited Optics)</option>
                        <option value="OPN">OPN (Open)</option>
                        <option value="LTD">LTD (Limited)</option>
                        <option value="PROD">PROD (Production)</option>
                        <option value="SS">SS (Single Stack)</option>
                        <option value="PCC">PCC</option>
                        <option value="REV">REV (Revolver)</option>
                        <option value="L10">L10 (Limited 10)</option>
                        <option value="ISR">ISR</option>
                        <option value="OSR">OSR</option>
                        <option value="RFPI">RFPI</option>
                        <option value="RFPO">RFPO</option>
                        <option value="RFRI">RFRI</option>
                        <option value="RFRO">RFRO</option>
                        <option value="PCCI">PCCI</option>
                        <option value="PCCO">PCCO</option>
                    </select>
                </div>
                <div class="config-group">
                    <label>Class:</label>
                    <select id="config-class">
                        <option value="U">U</option>
                        <option value="D">D</option>
                        <option value="C">C</option>
                        <option value="B">B</option>
                        <option value="A">A</option>
                        <option value="M">M</option>
                        <option value="G">G</option>
                        <option value="X">X</option>
                    </select>
                </div>
                <div class="config-group">
                    <label>Power Factor:</label>
                    <select id="config-powerFactor">
                        <option value="Major">Major</option>
                        <option value="Minor">Minor</option>
                    </select>
                </div>
                <div class="config-group">
                    <label>Categories:</label>
                    <div class="checkbox-list">
                        <label><input type="checkbox" value="Preteen"> Preteen</label>
                        <label><input type="checkbox" value="Junior"> Junior</label>
                        <label><input type="checkbox" value="Senior"> Senior</label>
                        <label><input type="checkbox" value="Super Senior"> Super Senior</label>
                        <label><input type="checkbox" value="Lady"> Lady</label>
                        <label><input type="checkbox" value="Law Enforcement"> Law Enforcement</label>
                        <label><input type="checkbox" value="Military"> Military</label>
                        <label><input type="checkbox" value="Distinguished Senior"> Distinguished Senior</label>
                    </div>
                </div>
                <div class="config-group">
                    <label>USPSA Member ID:</label>
                    <input type="text" id="config-memberId" value="${
                      config.memberIdValue
                    }" placeholder="A12345">
                </div>
                <div class="config-group">
                    <label>Member Number:</label>
                    <input type="text" id="config-memberNumber" value="${
                      config.memberNumber
                    }" placeholder="Member number">
                </div>
                <div class="config-group">
                    <label>Mailing Address:</label>
                    <input type="text" id="config-mailingAddress" value="${
                      config.mailingAddress
                    }" placeholder="Your address">
                </div>
                <div class="config-group">
                    <label>Phone Number:</label>
                    <input type="text" id="config-phoneNumber" value="${
                      config.phoneNumber
                    }" placeholder="(555) 123-4567">
                </div>
                <div class="config-group">
                    <label>Match Shirt Size:</label>
                    <select id="config-matchShirt">
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="2XL">2XL</option>
                        <option value="3XL">3XL</option>
                        <option value="4XL">4XL</option>
                    </select>
                </div>
                <div class="config-group">
                    <label>Prereg Code (optional):</label>
                    <input type="text" id="config-prereg" value="${
                      config.preregCode || ""
                    }">
                </div>
                <div class="config-group">
                    <label>
                        <input type="checkbox" id="config-waiver" ${
                          config.agreeWaiver ? "checked" : ""
                        }>
                        Auto-agree to waivers
                    </label>
                </div>
                <div class="config-group">
                    <label>
                        <input type="checkbox" id="config-stopStripe" ${
                          config.stopAtStripe ? "checked" : ""
                        }>
                        Stop at Stripe payment
                    </label>
                </div>
                <div class="config-group">
                    <label>
                        <input type="checkbox" id="config-dryRun" ${
                          config.dryRun ? "checked" : ""
                        }>
                        Dry run (don't submit)
                    </label>
                </div>
                <div class="config-group">
                    <button id="config-save">Save</button>
                    <button id="config-cancel">Cancel</button>
                </div>
            </div>
        `;

    document.body.appendChild(container);
    attachUIEvents();
  }

  function attachUIEvents() {
    const armBtn = document.getElementById("practisign-arm");
    const refreshBtn = document.getElementById("practisign-refresh");
    const configBtn = document.getElementById("practisign-config");
    const panel = document.getElementById("practisign-panel");
    const saveBtn = document.getElementById("config-save");
    const cancelBtn = document.getElementById("config-cancel");

    armBtn.addEventListener("click", toggleArmed);
    refreshBtn.addEventListener("click", () => {
      console.log("🔄 PractiSign: Manual page refresh requested");
      showToast("Refreshing page...");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    configBtn.addEventListener("click", () => {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    });

    saveBtn.addEventListener("click", saveConfigFromUI);
    cancelBtn.addEventListener("click", () => {
      panel.style.display = "none";
      loadConfigToUI();
    });

    // Kill switch
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && armed) {
        disarm();
        showToast("Disarmed by user");
      }
    });
  }

  function saveConfigFromUI() {
    config.division = document.getElementById("config-division").value;
    config.class = document.getElementById("config-class").value;
    config.powerFactor = document.getElementById("config-powerFactor").value;

    // Get selected categories
    const categoryCheckboxes = document.querySelectorAll(
      '.checkbox-list input[type="checkbox"]:checked'
    );
    config.categories = Array.from(categoryCheckboxes).map((cb) => cb.value);

    config.memberIdValue = document.getElementById("config-memberId").value;
    config.memberNumber = document.getElementById("config-memberNumber").value;
    config.mailingAddress = document.getElementById(
      "config-mailingAddress"
    ).value;
    config.phoneNumber = document.getElementById("config-phoneNumber").value;
    config.matchShirt = document.getElementById("config-matchShirt").value;
    config.preregCode = document.getElementById("config-prereg").value || null;
    config.agreeWaiver = document.getElementById("config-waiver").checked;
    config.stopAtStripe = document.getElementById("config-stopStripe").checked;
    config.dryRun = document.getElementById("config-dryRun").checked;

    saveConfig();
    document.getElementById("practisign-panel").style.display = "none";
    showToast("Configuration saved");
  }

  function loadConfigToUI() {
    document.getElementById("config-division").value = config.division;
    document.getElementById("config-class").value = config.class;
    document.getElementById("config-powerFactor").value = config.powerFactor;

    // Set categories
    const categoryCheckboxes = document.querySelectorAll(
      '.checkbox-list input[type="checkbox"]'
    );
    categoryCheckboxes.forEach((cb) => {
      cb.checked = config.categories.includes(cb.value);
    });

    document.getElementById("config-memberId").value = config.memberIdValue;
    document.getElementById("config-memberNumber").value = config.memberNumber;
    document.getElementById("config-mailingAddress").value =
      config.mailingAddress;
    document.getElementById("config-phoneNumber").value = config.phoneNumber;
    document.getElementById("config-matchShirt").value = config.matchShirt;
    document.getElementById("config-prereg").value = config.preregCode || "";
    document.getElementById("config-waiver").checked = config.agreeWaiver;
    document.getElementById("config-stopStripe").checked = config.stopAtStripe;
    document.getElementById("config-dryRun").checked = config.dryRun;
  }

  // Core functionality
  function toggleArmed() {
    if (armed) {
      disarm();
    } else {
      arm();
    }
  }

  function arm() {
    armed = true;
    inFlight = false;
    mode = "far";
    updateStatus("Watching");
    document.getElementById("practisign-arm").textContent = "Disarm";
    showToast("Armed - watching for registration to open");
    startPolling();
  }

  function disarm() {
    armed = false;
    inFlight = false;
    if (currentTimer) {
      clearTimeout(currentTimer);
      currentTimer = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    updateStatus("Idle");
    document.getElementById("practisign-arm").textContent = "Arm";
  }

  function startPolling() {
    if (!armed || inFlight) return;

    tick();
  }

  function tick() {
    if (!armed || inFlight) return;

    // Check if registration is actually open (for test page)
    if (window.registrationOpen === false) {
      return;
    }

    // Check if registration is available
    const registerClicked = clickButtonLike(
      "register",
      "sign up",
      "signup",
      "register now",
      "sign up now"
    );
    if (registerClicked) {
      console.log("🎯 PractiSign: Register button clicked!");
      inFlight = true;
      updateStatus("Hot");
      showToast("Registration clicked - filling form...");
      setTimeout(afterRegister, 400);
      return;
    }

    // Check for waitlist registration (when match is full but waitlist is open)
    const waitlistInput = document.querySelector(
      'input[name="waitlist"][value="1"]'
    );
    const regSubmitBtn = document.getElementById("regSubmit");
    if (waitlistInput && regSubmitBtn && regSubmitBtn.value === "Register") {
      console.log("🎯 PractiSign: Waitlist registration detected!");
      inFlight = true;
      updateStatus("Hot");
      showToast("Waitlist registration detected - filling form...");
      setTimeout(afterRegister, 400);
      return;
    }

    // Check for countdown to adjust polling cadence
    const body = document.body.innerText;
    if (/opens in|registration opens/i.test(body)) {
      mode = "near";
    }

    // Check if registration is completely closed (no form at all)
    const hasRegistrationForm =
      document.getElementById("registration") ||
      document.getElementById("regForm") ||
      document.querySelector('form[action*="register"]');
    if (!hasRegistrationForm) {
      console.log(
        "🎯 PractiSign: Registration form not found - registration closed"
      );
      mode = "far"; // Poll less frequently when closed
    }

    // In "near" mode, refresh the page periodically to catch registration opening
    if (mode === "near" && !hasRegistrationForm) {
      const refreshInterval = 30000; // 30 seconds
      const timeSinceLastRefresh = Date.now() - (window.lastRefreshTime || 0);

      if (timeSinceLastRefresh > refreshInterval) {
        console.log(
          "🔄 PractiSign: Refreshing page to check for registration..."
        );
        window.lastRefreshTime = Date.now();
        showToast("Refreshing page to check for registration...");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return;
      }
    }

    // Schedule next poll
    const delay = config.pollCadence[mode] || config.pollCadence.farMs;
    currentTimer = setTimeout(tick, delay);
  }

  function afterRegister() {
    // Wait for form to load and check if it's ready
    let attempts = 0;
    const maxAttempts = 10;

    const checkForm = () => {
      attempts++;

      // Check if we have form elements
      const hasFormElements = document.querySelector(
        'form, input, select, .registration-form, [class*="registration"]'
      );

      if (hasFormElements || attempts >= maxAttempts) {
        fillForm();
      } else {
        setTimeout(checkForm, 500);
      }
    };

    setTimeout(checkForm, 500);
  }

  function fillForm() {
    let filled = false;

    // Fill division - PractiScore uses radio buttons
    const divisionRadios = document.querySelectorAll(
      'input[name="division"][type="radio"]'
    );

    // Division name mapping for different PractiScore formats
    const divisionMapping = {
      // Abbreviated to full names
      CO: ["CO", "Carry Optics"],
      LO: ["LO", "Limited Optics"],
      OPN: ["OPN", "Open"],
      LTD: ["LTD", "Limited"],
      PROD: ["PROD", "Production"],
      SS: ["SS", "Single Stack"],
      PCC: ["PCC", "PCC"],
      REV: ["REV", "Revolver"],
      L10: ["L10", "Limited 10"],
      // Add more mappings as needed
    };

    const targetDivisions = divisionMapping[config.division] || [
      config.division,
    ];

    for (const radio of divisionRadios) {
      if (targetDivisions.includes(radio.value)) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
        filled = true;
        showToast("Division filled: " + radio.value);
        break;
      }
    }

    // Fill class - PractiScore uses radio buttons
    const classRadios = document.querySelectorAll(
      'input[name="class"][type="radio"]'
    );
    for (const radio of classRadios) {
      if (radio.value === config.class) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
        filled = true;
        showToast("Class filled: " + config.class);
        break;
      }
    }

    // Fill categories - PractiScore uses checkboxes
    if (config.categories.length > 0) {
      const categoryCheckboxes = document.querySelectorAll(
        'input[name="categories[]"][type="checkbox"]'
      );
      categoryCheckboxes.forEach((cb) => {
        if (config.categories.includes(cb.value)) {
          cb.checked = true;
          cb.dispatchEvent(new Event("change", { bubbles: true }));
          filled = true;
        }
      });
      if (config.categories.length > 0) {
        showToast("Categories filled: " + config.categories.join(", "));
      }
    }

    // Fill member ID - PractiScore uses "member-number" field
    const memberInput =
      document.getElementById("member-number") ||
      document.querySelector('input[name="member-number"]');
    if (memberInput) {
      memberInput.value = config.memberIdValue;
      memberInput.dispatchEvent(new Event("change", { bubbles: true }));
      filled = true;
      showToast("Member ID filled: " + config.memberIdValue);
    }

    // Fill power factor - PractiScore uses radio buttons
    const powerFactorRadios = document.querySelectorAll(
      'input[name="power-factor"][type="radio"]'
    );
    for (const radio of powerFactorRadios) {
      if (radio.value === config.powerFactor) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
        filled = true;
        showToast("Power Factor filled: " + config.powerFactor);
        break;
      }
    }

    // Fill member number (different from USPSA member ID)
    const memberNumberInput =
      document.getElementById("member-number") ||
      document.querySelector('input[name="member-number"]');
    if (memberNumberInput && config.memberNumber) {
      memberNumberInput.value = config.memberNumber;
      memberNumberInput.dispatchEvent(new Event("change", { bubbles: true }));
      filled = true;
      showToast("Member Number filled: " + config.memberNumber);
    }

    // Fill mailing address
    const mailingAddressInput =
      document.getElementById("mailing-address") ||
      document.querySelector('input[name="mailing-address"]');
    if (mailingAddressInput && config.mailingAddress) {
      mailingAddressInput.value = config.mailingAddress;
      mailingAddressInput.dispatchEvent(new Event("change", { bubbles: true }));
      filled = true;
      showToast("Mailing Address filled");
    }

    // Fill phone number
    const phoneInput =
      document.getElementById("phone") ||
      document.querySelector('input[name="phone"]');
    if (phoneInput && config.phoneNumber) {
      phoneInput.value = config.phoneNumber;
      phoneInput.dispatchEvent(new Event("change", { bubbles: true }));
      filled = true;
      showToast("Phone Number filled");
    }

    // Fill match shirt size - PractiScore uses radio buttons
    const matchShirtRadios = document.querySelectorAll(
      'input[name="match-shirt"][type="radio"]'
    );
    for (const radio of matchShirtRadios) {
      if (radio.value === config.matchShirt) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
        filled = true;
        showToast("Match Shirt filled: " + config.matchShirt);
        break;
      }
    }

    // Fill prereg code if provided - PractiScore uses "code" field
    if (config.preregCode) {
      const codeInput =
        document.getElementById("code") ||
        document.querySelector('input[name="code"]');
      if (codeInput) {
        codeInput.value = config.preregCode;
        codeInput.dispatchEvent(new Event("change", { bubbles: true }));
        filled = true;
        showToast("Prereg code filled: " + config.preregCode);
      }
    }

    // Agree to waivers - PractiScore uses "accept_waiver" checkbox
    if (config.agreeWaiver) {
      const waiverCheckbox = document.querySelector(
        'input[name="accept_waiver"]'
      );
      if (waiverCheckbox && !waiverCheckbox.checked) {
        waiverCheckbox.checked = true;
        waiverCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
        filled = true;
        showToast("Waiver agreed to");
      }
    }

    // Note: PractiScore doesn't have squad selection in the registration form
    // Squad selection is typically done separately after registration
    // This is handled by the match director or through a separate squadding process
    showToast("Squad selection not available during registration");

    if (config.dryRun) {
      showToast("Dry run complete - review and submit manually");
      disarm();
      return;
    }

    // Submit form - PractiScore uses "Register" button
    setTimeout(() => {
      // Check if registration is actually open (for test page)
      if (window.registrationOpen === false) {
        console.log("❌ PractiSign: Not submitting - registration not open");
        showToast("Registration not open yet - waiting...");
        disarm();
        return;
      }

      const submitBtn =
        document.getElementById("regSubmit") ||
        document.querySelector('input[type="submit"][value="Register"]');
      if (submitBtn && !submitBtn.disabled) {
        console.log("✅ PractiSign: Submitting registration form");
        submitBtn.click();
        showToast("Registration submitted - watching for payment");
        watchForStripe();
      } else {
        showToast("Form filled - click Register manually");
        disarm();
      }
    }, 500);
  }

  function watchForStripe() {
    // Watch for navigation to Stripe
    observer = new MutationObserver(() => {
      if (location.host.includes("checkout.stripe")) {
        showNotification("Stripe open - confirm payment to finish");
        showToast("Stripe detected - complete payment manually");
        observer.disconnect();
        disarm();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // Utility functions
  function setInputByLabel(reLabel, value) {
    const labels = [...document.querySelectorAll("label")];
    const lab = labels.find((l) => reLabel.test(l.textContent || ""));
    if (!lab) return false;

    const id = lab.getAttribute("for");
    const input = id
      ? document.getElementById(id)
      : lab.querySelector("input,select,textarea");
    if (!input) return false;

    if (input.tagName === "SELECT") {
      input.value = value;
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function clickButtonLike(...names) {
    const candidates = [
      ...document.querySelectorAll(
        'button, a[role="button"], input[type="submit"]'
      ),
    ];
    const n = names.map((s) => s.toLowerCase());
    const btn = candidates.find((el) => {
      const text = (el.innerText || el.value || "").toLowerCase();
      const isVisible =
        el.offsetParent !== null &&
        el.style.display !== "none" &&
        el.style.visibility !== "hidden" &&
        el.style.opacity !== "0";
      return n.some((t) => text.includes(t)) && !el.disabled && isVisible;
    });

    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }

  function pickSquad(prefs) {
    // Try multiple selector strategies for squad elements
    const selectors = [
      '[class*="squad"]',
      "[data-squad]",
      '[class*="Squad"]',
      "tr",
      "li",
      ".squad-row",
      ".squad-item",
      '[class*="registration"]',
    ];

    const rows = [];
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      rows.push(...elements);
    });

    // Try exact preferred squads
    for (const pref of prefs) {
      const row = rows.find((r) => {
        const text = r.textContent || "";
        return (
          text.includes(pref) &&
          r.querySelector('button,a,input[type="button"],input[type="radio"]')
        );
      });
      if (row) {
        const btn = row.querySelector(
          'button,a,input[type="button"],input[type="radio"]'
        );
        if (btn && !btn.disabled) {
          btn.click();
          return true;
        }
      }
    }

    // Fallback to open squads
    const open = rows.find((r) => {
      const text = r.textContent || "";
      return (
        /open|spot|available|select/i.test(text) &&
        r.querySelector('button,a,input[type="button"],input[type="radio"]')
      );
    });

    if (open) {
      const btn = open.querySelector(
        'button,a,input[type="button"],input[type="radio"]'
      );
      if (btn && !btn.disabled) {
        btn.click();
        return true;
      }
    }

    return false;
  }

  function checkWaivers() {
    let checked = false;
    const labels = [...document.querySelectorAll("label")];
    labels.forEach((l) => {
      if (/waiver|consent|agree/i.test(l.textContent || "")) {
        const box =
          l.querySelector('input[type="checkbox"]') ||
          (l.getAttribute("for") &&
            document.getElementById(l.getAttribute("for")));
        if (box && !box.checked) {
          box.checked = true;
          box.dispatchEvent(new Event("change", { bubbles: true }));
          checked = true;
        }
      }
    });
    return checked;
  }

  // UI helpers
  function updateStatus(status) {
    const statusEl = document.getElementById("practisign-status");
    if (statusEl) {
      statusEl.textContent = status;
      statusEl.className = `status-${status.toLowerCase()}`;
    }
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "practisign-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function showNotification(message) {
    if (typeof GM_notification !== "undefined") {
      GM_notification({
        text: message,
        title: "PractiSign",
        timeout: 5000,
      });
    } else if (
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("PractiSign", { body: message });
    }
  }

  // Initialize
  function init() {
    console.log("🎯 PractiSign: Initializing...");

    loadConfig();
    createControlUI();
    loadConfigToUI();

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Add debug info to console
    console.log("🎯 PractiSign loaded on:", window.location.href);
    console.log("📋 Current config:", config);

    // Force UI to be visible for debugging
    setTimeout(() => {
      const container = document.getElementById("practisign-container");
      if (container) {
        console.log("✅ PractiSign UI found and should be visible");
        container.style.display = "block";
        container.style.zIndex = "999999";
      } else {
        console.log("❌ PractiSign UI not found - creating manually");
        createControlUI();
      }
    }, 1000);

    // Add debug function to window for testing
    window.practisignDebug = {
      config: () => console.log("Current config:", config),
      showUI: () => {
        console.log("🔧 Manually showing PractiSign UI...");
        createControlUI();
        const container = document.getElementById("practisign-container");
        if (container) {
          container.style.display = "block";
          container.style.zIndex = "999999";
          console.log("✅ UI should now be visible");
        }
      },
      testFormDetection: () => {
        console.log("🔍 Testing form detection...");
        const forms = document.querySelectorAll("form");
        const inputs = document.querySelectorAll("input, select");
        const buttons = document.querySelectorAll("button");

        console.log("Forms found:", forms.length);
        console.log("Inputs found:", inputs.length);
        console.log("Buttons found:", buttons.length);

        buttons.forEach((btn, i) => {
          console.log(`Button ${i}: "${btn.textContent.trim()}"`);
        });
      },
      testLabels: () => {
        console.log("🏷️ Testing label detection...");
        const labels = document.querySelectorAll("label");
        labels.forEach((label, i) => {
          console.log(`Label ${i}: "${label.textContent.trim()}"`);
        });
      },
      testDivisions: () => {
        console.log("🎯 Testing division detection...");
        const divisionRadios = document.querySelectorAll(
          'input[name="division"][type="radio"]'
        );
        console.log(`Found ${divisionRadios.length} division options:`);
        divisionRadios.forEach((radio, i) => {
          console.log(`  ${i + 1}. "${radio.value}"`);
        });

        // Test current config against available divisions
        const divisionMapping = {
          CO: ["CO", "Carry Optics"],
          LO: ["LO", "Limited Optics"],
          OPN: ["OPN", "Open"],
          LTD: ["LTD", "Limited"],
          PROD: ["PROD", "Production"],
          SS: ["SS", "Single Stack"],
          PCC: ["PCC", "PCC"],
          REV: ["REV", "Revolver"],
          L10: ["L10", "Limited 10"],
        };

        const targetDivisions = divisionMapping[config.division] || [
          config.division,
        ];
        const match = divisionRadios.find((radio) =>
          targetDivisions.includes(radio.value)
        );

        if (match) {
          console.log(
            `✅ Config division "${config.division}" matches available option "${match.value}"`
          );
        } else {
          console.log(
            `❌ Config division "${config.division}" not found in available options`
          );
          console.log(`   Looking for: ${targetDivisions.join(", ")}`);
        }
      },
    };
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
