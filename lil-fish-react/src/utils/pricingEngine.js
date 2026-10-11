import quoteConfig from "../data/quoteConfig.json";

function asNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function findGuestTier(guestCount) {
  return quoteConfig.guestTiers.find((tier) => {
    const minimum = asNumber(tier.minimumGuests);

    const maximum = asNumber(
      tier.maximumGuests,
      Number.MAX_SAFE_INTEGER
    );

    return (
      guestCount >= minimum &&
      guestCount <= maximum
    );
  });
}

function calculateAddOn(addOn, quantity = 1) {
  const rate = asNumber(addOn.rate);

  const safeQuantity = Math.max(
    asNumber(quantity, 1),
    1
  );

  switch (addOn.pricingMethod) {
    case "per-hour":
    case "per-guest":
    case "per-item":
      return rate * safeQuantity;

    case "percentage":
      return 0;

    case "flat-fee":
    default:
      return rate;
  }
}

function matchesRiskRule(rule, formData) {
  const fieldName = rule.fieldName;
  const expectedValue = rule.expectedValue;

  if (!fieldName) {
    return false;
  }

  const actualValue = formData[fieldName];

  if (typeof expectedValue === "boolean") {
    return Boolean(actualValue) === expectedValue;
  }

  return (
    String(actualValue ?? "").toLowerCase() ===
    String(expectedValue ?? "").toLowerCase()
  );
}

export function calculateQuote(formData) {
  const eventType =
    quoteConfig.eventTypesById[
      formData.eventTypeId
    ];

  if (!eventType) {
    throw new Error(
      "Please select a valid event type."
    );
  }

  const guestCount = asNumber(
    formData.guestCount
  );

  if (guestCount < 1) {
    throw new Error(
      "Please enter a valid guest count."
    );
  }

  const guestTier = findGuestTier(guestCount);

  if (!guestTier) {
    throw new Error(
      "No guest tier matches this guest count."
    );
  }

  const basePrice = asNumber(
    eventType.basePrice
  );

  const eventDeposit = asNumber(
    eventType.defaultDeposit
  );

  const tierDeposit = asNumber(
    guestTier.baseRefundableDeposit
  );

  const baseDeposit = Math.max(
    eventDeposit,
    tierDeposit
  );

  const selectedAddOns = (
    formData.addOns ?? []
  )
    .map((selection) => {
      const addOn =
        quoteConfig.addOnsById[selection.id];

      if (!addOn) {
        return null;
      }

      const quantity = asNumber(
        selection.quantity,
        1
      );

      const total = calculateAddOn(
        addOn,
        quantity
      );

      return {
        id: addOn.addOnId,
        name: addOn.addOnName,
        pricingMethod: addOn.pricingMethod,
        rate: asNumber(addOn.rate),
        quantity,
        total,
      };
    })
    .filter(Boolean);

  const addOnTotal = selectedAddOns.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const triggeredRiskRules =
    quoteConfig.riskRules
      .filter((rule) => rule.active !== false)
      .filter((rule) =>
        matchesRiskRule(rule, formData)
      );

  const riskDepositAdjustment =
    triggeredRiskRules.reduce(
      (sum, rule) =>
        sum +
        asNumber(rule.depositAdjustment),
      0
    );

  const securityOfficerAdjustment =
    triggeredRiskRules.reduce(
      (sum, rule) =>
        sum +
        asNumber(
          rule.securityOfficerAdjustment
        ),
      0
    );

  const managerReview =
    eventType.managerReview === true ||
    guestTier.managerReview === true ||
    triggeredRiskRules.some(
      (rule) => rule.managerReview === true
    );

  const insuranceRequired =
    guestTier.insuranceDefault ===
      "Required" ||
    triggeredRiskRules.some(
      (rule) =>
        rule.insuranceResult === "Required"
    );

  const minimumSecurityOfficers =
    asNumber(
      guestTier.minimumSecurityOfficers
    ) + securityOfficerAdjustment;

  const depositTotal =
    baseDeposit + riskDepositAdjustment;

  const subtotal =
    basePrice + addOnTotal;

  const estimatedTotal =
    subtotal + depositTotal;

  return {
    eventType: {
      id: eventType.eventId,
      name: eventType.eventName,
    },
    guestCount,
    guestTier,
    basePrice,
    selectedAddOns,
    addOnTotal,
    subtotal,
    baseDeposit,
    riskDepositAdjustment,
    depositTotal,
    estimatedTotal,
    triggeredRiskRules,
    managerReview,
    insuranceRequired,
    minimumSecurityOfficers,
  };
}