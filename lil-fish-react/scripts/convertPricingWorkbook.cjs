const fs = require("node:fs");
const path = require("node:path");
const XLSX = require("xlsx");

const projectRoot = path.resolve(__dirname, "..");

const workbookPath = path.join(
  projectRoot,
  "business-rules",
  "Venue_Configuration_Student_Workbook.xlsx"
);

const outputDirectory = path.join(
  projectRoot,
  "src",
  "data"
);

const outputPath = path.join(
  outputDirectory,
  "quoteConfig.json"
);

const REQUIRED_SHEETS = [
  "Event Types",
  "Guest Tiers",
  "Add-Ons",
  "Risk Rules",
  "Insurance & Security",
  "Vendor Rules",
];

function cleanKey(value) {
  const words = String(value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.toLowerCase());

  if (words.length === 0) {
    return "";
  }

  return (
    words[0] +
    words
      .slice(1)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join("")
  );
}

function cleanValue(value) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  if (trimmed.toLowerCase() === "yes") {
    return true;
  }

  if (trimmed.toLowerCase() === "no") {
    return false;
  }

  return trimmed;
}

function readSheet(workbook, sheetName) {
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(
      `Missing required worksheet: ${sheetName}`
    );
  }

  // The workbook's real table headers are on row 4.
  // range: 3 tells XLSX to begin reading at row 4.
  const rawRows = XLSX.utils.sheet_to_json(
    worksheet,
    {
      range: 3,
      defval: null,
      raw: true,
    }
  );

  return rawRows
    .map((row) => {
      return Object.fromEntries(
        Object.entries(row).map(
          ([key, value]) => [
            cleanKey(key),
            cleanValue(value),
          ]
        )
      );
    })
    .filter((row) => {
      return Object.values(row).some(
        (value) =>
          value !== null &&
          value !== ""
      );
    });
}

function indexBy(rows, keyName) {
  return Object.fromEntries(
    rows
      .filter((row) => row[keyName])
      .map((row) => [
        row[keyName],
        row,
      ])
  );
}

function validateWorkbook(workbook) {
  const missingSheets = REQUIRED_SHEETS.filter(
    (sheetName) =>
      !workbook.Sheets[sheetName]
  );

  if (missingSheets.length > 0) {
    throw new Error(
      `The workbook is missing: ${missingSheets.join(
        ", "
      )}`
    );
  }
}

function validateRequiredIds(config) {
  const checks = [
    [
      "Event Types",
      config.eventTypes,
      "eventId",
    ],
    [
      "Guest Tiers",
      config.guestTiers,
      "tierId",
    ],
    [
      "Add-Ons",
      config.addOns,
      "addOnId",
    ],
    [
      "Risk Rules",
      config.riskRules,
      "riskRuleId",
    ],
    [
      "Insurance & Security",
      config.insuranceSecurity,
      "ruleId",
    ],
    [
      "Vendor Rules",
      config.vendorRules,
      "vendorRuleId",
    ],
  ];

  for (const [
    sheetName,
    rows,
    idField,
  ] of checks) {
    const missingIdRows = rows.filter(
      (row) => !row[idField]
    );

    if (missingIdRows.length > 0) {
      throw new Error(
        `${sheetName} contains ${missingIdRows.length} row(s) without ${idField}.`
      );
    }
  }
}

function main() {
  if (!fs.existsSync(workbookPath)) {
    throw new Error(
      `Workbook not found at:\n${workbookPath}`
    );
  }

  const workbook = XLSX.readFile(
    workbookPath
  );

  validateWorkbook(workbook);

  const config = {
    generatedAt: new Date().toISOString(),

    sourceWorkbook:
      path.basename(workbookPath),

    eventTypes: readSheet(
      workbook,
      "Event Types"
    ),

    guestTiers: readSheet(
      workbook,
      "Guest Tiers"
    ),

    addOns: readSheet(
      workbook,
      "Add-Ons"
    ),

    riskRules: readSheet(
      workbook,
      "Risk Rules"
    ),

    insuranceSecurity: readSheet(
      workbook,
      "Insurance & Security"
    ),

    vendorRules: readSheet(
      workbook,
      "Vendor Rules"
    ),
  };

  validateRequiredIds(config);

  config.eventTypesById = indexBy(
    config.eventTypes,
    "eventId"
  );

  config.guestTiersById = indexBy(
    config.guestTiers,
    "tierId"
  );

  config.addOnsById = indexBy(
    config.addOns,
    "addOnId"
  );

  config.riskRulesById = indexBy(
    config.riskRules,
    "riskRuleId"
  );

  config.insuranceSecurityById = indexBy(
    config.insuranceSecurity,
    "ruleId"
  );

  config.vendorRulesById = indexBy(
    config.vendorRules,
    "vendorRuleId"
  );

  fs.mkdirSync(
    outputDirectory,
    {
      recursive: true,
    }
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(config, null, 2),
    "utf8"
  );

  console.log(
    "Pricing workbook imported successfully."
  );

  console.log(
    `Source: ${workbookPath}`
  );

  console.log(
    `Output: ${outputPath}`
  );

  console.log(
    `Event types: ${config.eventTypes.length}`
  );

  console.log(
    `Guest tiers: ${config.guestTiers.length}`
  );

  console.log(
    `Add-ons: ${config.addOns.length}`
  );

  console.log(
    `Risk rules: ${config.riskRules.length}`
  );

  console.log(
    `Insurance and security rules: ${config.insuranceSecurity.length}`
  );

  console.log(
    `Vendor rules: ${config.vendorRules.length}`
  );
}

try {
  main();
} catch (error) {
  console.error(
    "\nPricing import failed."
  );

  console.error(
    error instanceof Error
      ? error.message
      : error
  );

  process.exit(1);
}