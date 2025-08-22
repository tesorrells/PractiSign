// PractiSign Test Script
// Run this in the browser console on the test page to validate functionality

console.log("🧪 PractiSign Test Script Loaded");

// Test configuration
const testConfig = {
  division: "CO",
  memberIdValue: "A12345",
  squadPreferences: ["Squad 3", "Squad 2", "Squad 1"],
  preregCode: "TEST2024",
  agreeWaiver: true,
  stopAtStripe: true,
  dryRun: true,
};

// Test functions
function testFormDetection() {
  console.log("🔍 Testing form detection...");

  // Test division selection
  const divisionSelect = document.getElementById("division");
  if (divisionSelect) {
    divisionSelect.value = testConfig.division;
    divisionSelect.dispatchEvent(new Event("change", { bubbles: true }));
    console.log("✅ Division set to:", testConfig.division);
  } else {
    console.log("❌ Division select not found");
  }

  // Test member ID
  const memberInput = document.getElementById("memberId");
  if (memberInput) {
    memberInput.value = testConfig.memberIdValue;
    memberInput.dispatchEvent(new Event("change", { bubbles: true }));
    console.log("✅ Member ID set to:", testConfig.memberIdValue);
  } else {
    console.log("❌ Member ID input not found");
  }

  // Test prereg code
  const preregInput = document.getElementById("preregCode");
  if (preregInput) {
    preregInput.value = testConfig.preregCode;
    preregInput.dispatchEvent(new Event("change", { bubbles: true }));
    console.log("✅ Prereg code set to:", testConfig.preregCode);
  } else {
    console.log("❌ Prereg code input not found");
  }
}

function testWaiverChecking() {
  console.log("📋 Testing waiver checking...");

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  let checkedCount = 0;

  checkboxes.forEach((checkbox) => {
    const label = checkbox.closest(".checkbox-group")?.querySelector("label");
    if (label && /waiver|consent|agree/i.test(label.textContent)) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      checkedCount++;
      console.log(
        "✅ Checked waiver:",
        label.textContent.substring(0, 50) + "..."
      );
    }
  });

  console.log(`✅ Checked ${checkedCount} waiver checkboxes`);
}

function testSquadSelection() {
  console.log("👥 Testing squad selection...");

  const squadRows = document.querySelectorAll(".squad-row");
  let selected = false;

  // Try preferred squads first
  for (const pref of testConfig.squadPreferences) {
    const squadRow = Array.from(squadRows).find(
      (row) => row.textContent.includes(pref) && !row.classList.contains("full")
    );

    if (squadRow) {
      const button = squadRow.querySelector("button");
      if (button && !button.disabled) {
        button.click();
        console.log("✅ Selected preferred squad:", pref);
        selected = true;
        break;
      }
    }
  }

  // Fallback to any open squad
  if (!selected) {
    const openSquad = Array.from(squadRows).find(
      (row) => row.classList.contains("open") && !row.classList.contains("full")
    );

    if (openSquad) {
      const button = openSquad.querySelector("button");
      if (button && !button.disabled) {
        button.click();
        console.log("✅ Selected fallback squad");
        selected = true;
      }
    }
  }

  if (!selected) {
    console.log("❌ No available squads found");
  }
}

function testButtonDetection() {
  console.log("🔘 Testing button detection...");

  const buttons = document.querySelectorAll("button");
  const buttonTexts = Array.from(buttons).map((btn) => btn.textContent.trim());

  console.log("Available buttons:", buttonTexts);

  // Test register button detection
  const registerBtn = Array.from(buttons).find((btn) =>
    /register|sign up|signup/i.test(btn.textContent)
  );

  if (registerBtn) {
    console.log("✅ Register button found:", registerBtn.textContent);
  } else {
    console.log("❌ Register button not found");
  }

  // Test submit button detection
  const submitBtn = Array.from(buttons).find((btn) =>
    /submit|continue|checkout/i.test(btn.textContent)
  );

  if (submitBtn) {
    console.log("✅ Submit button found:", submitBtn.textContent);
  } else {
    console.log("❌ Submit button not found");
  }
}

function runFullTest() {
  console.log("🚀 Starting PractiSign full test...");
  console.log("Test config:", testConfig);

  // Check if registration is open
  const status = document.getElementById("status");
  if (status && status.textContent.includes("OPEN")) {
    console.log("✅ Registration is open, proceeding with tests");

    testFormDetection();
    testWaiverChecking();
    testSquadSelection();
    testButtonDetection();

    console.log("🎉 Full test completed!");
  } else {
    console.log("⚠️ Registration not open. Toggle registration open first.");
    console.log('💡 Use the "Toggle Registration Open/Closed" button');
  }
}

function testPollingSimulation() {
  console.log("⏰ Testing polling simulation...");

  let pollCount = 0;
  const maxPolls = 5;

  const pollInterval = setInterval(() => {
    pollCount++;
    console.log(`Poll ${pollCount}/${maxPolls}: Checking for registration...`);

    const status = document.getElementById("status");
    if (status && status.textContent.includes("OPEN")) {
      console.log("🎯 Registration detected!");
      clearInterval(pollInterval);
      runFullTest();
    } else if (pollCount >= maxPolls) {
      console.log("⏰ Polling simulation complete");
      clearInterval(pollInterval);
    }
  }, 2000);
}

// Make functions available globally
window.practisignTest = {
  testFormDetection,
  testWaiverChecking,
  testSquadSelection,
  testButtonDetection,
  runFullTest,
  testPollingSimulation,
  config: testConfig,
};

console.log("📝 Available test functions:");
console.log("- practisignTest.runFullTest() - Run complete test");
console.log("- practisignTest.testFormDetection() - Test form filling");
console.log("- practisignTest.testWaiverChecking() - Test waiver checking");
console.log("- practisignTest.testSquadSelection() - Test squad selection");
console.log("- practisignTest.testButtonDetection() - Test button detection");
console.log(
  "- practisignTest.testPollingSimulation() - Test polling simulation"
);
console.log("- practisignTest.config - View/modify test configuration");
