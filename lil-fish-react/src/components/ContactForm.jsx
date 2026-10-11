import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCalendarCheck, FaStore } from "react-icons/fa";
import "./ContactForm.css";
import quoteConfig from "../data/quoteConfig.json";

const VENUE_NAME = "Lil Fish Community Center";
const QUOTES_API_URL = import.meta.env.VITE_QUOTES_API_URL ?? "";

function asNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function getConfiguredAddOn(addOnId) {
  return quoteConfig.addOnsById?.[addOnId] ?? null;
}

const vendorEventTypes = [
  "harvest-festival",
  "holiday-market",
];

const initialVendorFormData = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  eventType: "",
  vendorCategory: "",
  productDescription: "",
  boothSize: "",
  electricityNeeded: "no",
  website: "",
  message: "",
};

const initialQuoteFormData = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  eventDate: "",
  preferredStartTime: "",
  guestCount: "200",
  message: "",
};

const initialQuoteOptions = {
  bridalSuite: true,
  bridalSuiteHours: "4",
  decorations: true,
  music: true,
  cleaning: true,
  catering: true,
  security: true,
  securityOfficers: "3",
  securityHours: "4",
};

function ContactForm() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedType = searchParams.get("type");
  const pageMode = !selectedType
    ? "choice"
    : vendorEventTypes.includes(selectedType)
      ? "vendor"
      : "quote";

  const [vendorFormData, setVendorFormData] = useState(
    initialVendorFormData
  );

  const [quoteFormData, setQuoteFormData] = useState(
    initialQuoteFormData
  );

  const [quoteOptions, setQuoteOptions] = useState(
    initialQuoteOptions
  );

  const activeVendorEventType =
    pageMode === "vendor"
      ? vendorFormData.eventType || selectedType
      : vendorFormData.eventType;

  const activeQuoteInterest =
    pageMode === "quote"
      ? quoteFormData.interest || selectedType
      : quoteFormData.interest;

  const selectedEventType =
    quoteConfig.eventTypesById?.[activeQuoteInterest] ??
    quoteConfig.eventTypesById?.["custom-event"] ??
    quoteConfig.eventTypes?.[0] ??
    null;

  const bridalSuiteAddOn = getConfiguredAddOn("bridal-suite");
  const decorationAddOn = getConfiguredAddOn("decoration-package");
  const musicAddOn = getConfiguredAddOn("music-package");
  const cleaningAddOn = getConfiguredAddOn("cleaning-fee");
  const cateringAddOn = getConfiguredAddOn("catering");
  const securityAddOn = getConfiguredAddOn("security-officer");

  const BASE_PRICE = asNumber(selectedEventType?.basePrice);
  const BRIDAL_SUITE_PRICE_PER_HOUR = asNumber(
    bridalSuiteAddOn?.rate
  );
  const DECORATION_PACKAGE_FEE = asNumber(
    decorationAddOn?.rate
  );
  const MUSIC_PACKAGE_FEE = asNumber(musicAddOn?.rate);
  const CLEANING_FEE = asNumber(cleaningAddOn?.rate);
  const CATERING_PRICE_PER_GUEST = asNumber(cateringAddOn?.rate);
  const SECURITY_PRICE_PER_OFFICER_PER_HOUR = asNumber(
    securityAddOn?.rate
  );

  const [showQuoteContactForm, setShowQuoteContactForm] =
    useState(false);

  const [vendorSubmitted, setVendorSubmitted] =
    useState(false);

  const [quoteSubmitted, setQuoteSubmitted] =
    useState(false);

  const [quoteError, setQuoteError] = useState("");

  const [quoteSuccess, setQuoteSuccess] = useState("");

  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  const guestCount = Math.max(
    Number(quoteFormData.guestCount) || 0,
    0
  );

  const bridalSuiteHours = Math.max(
    Number(quoteOptions.bridalSuiteHours) || 0,
    0
  );

  const securityOfficers = Math.max(
    Number(quoteOptions.securityOfficers) || 0,
    0
  );

  const securityHours = Math.max(
    Number(quoteOptions.securityHours) || 0,
    0
  );

  function findGuestTier(numberOfGuests) {
    return quoteConfig.guestTiers.find((tier) => {
      const minimum = asNumber(tier.minimumGuests);
      const maximum = asNumber(
        tier.maximumGuests,
        Number.MAX_SAFE_INTEGER
      );

      return (
        numberOfGuests >= minimum &&
        numberOfGuests <= maximum
      );
    });
  }

  function calculateRefundableDeposit(numberOfGuests) {
    const guestTier = findGuestTier(numberOfGuests);
    const tierDeposit = asNumber(
      guestTier?.baseRefundableDeposit
    );
    const eventDeposit = asNumber(
      selectedEventType?.defaultDeposit
    );

    return Math.max(tierDeposit, eventDeposit);
  }

  function getDepositTierLabel(numberOfGuests) {
    const guestTier = findGuestTier(numberOfGuests);

    if (!guestTier) {
      return "Guest count requires manager review";
    }

    return guestTier.tierName ?? "Configured guest tier";
  }

  const refundableDeposit =
    calculateRefundableDeposit(guestCount);

  const depositTierLabel =
    getDepositTierLabel(guestCount);

  const bridalSuiteFee = quoteOptions.bridalSuite
    ? bridalSuiteHours *
      BRIDAL_SUITE_PRICE_PER_HOUR
    : 0;

  const cateringFee = quoteOptions.catering
    ? guestCount * CATERING_PRICE_PER_GUEST
    : 0;

  const securityFee = quoteOptions.security
    ? securityOfficers *
      securityHours *
      SECURITY_PRICE_PER_OFFICER_PER_HOUR
    : 0;

  const estimatedTotal =
    BASE_PRICE +
    bridalSuiteFee +
    (quoteOptions.decorations
      ? DECORATION_PACKAGE_FEE
      : 0) +
    (quoteOptions.music
      ? MUSIC_PACKAGE_FEE
      : 0) +
    (quoteOptions.cleaning
      ? CLEANING_FEE
      : 0) +
    refundableDeposit +
    cateringFee +
    securityFee;

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function getEventTypeLabel(value) {
    const eventTypes = {
      "spring-festival": "Spring Festival",
      "summer-concert": "Summer Concert",
      "harvest-festival": "Harvest Festival",
      "holiday-market": "Holiday Market",
      "wedding-venue": "Wedding Venue",
      "family-reunion": "Family Reunion",
      graduation: "Graduation Celebration",
      retirement: "Retirement Party",
      anniversary: "Anniversary Celebration",
      "custom-event": "Custom Event Package",
    };

    return eventTypes[value] || "Event";
  }

  function openVendorForm(
    eventType = "harvest-festival"
  ) {
    setVendorSubmitted(false);
    setVendorFormData({
      ...initialVendorFormData,
      eventType,
    });
    setQuoteFormData(initialQuoteFormData);
    setQuoteOptions(initialQuoteOptions);
    setShowQuoteContactForm(false);
    setQuoteSubmitted(false);

    setSearchParams({
      type: eventType,
    });
  }

  function openQuoteCalculator(
    eventType = "custom-event"
  ) {
    setQuoteSubmitted(false);
    setShowQuoteContactForm(false);
    setQuoteFormData({
      ...initialQuoteFormData,
      interest: eventType,
    });
    setVendorFormData(initialVendorFormData);
    setVendorSubmitted(false);

    setSearchParams({
      type: eventType,
    });
  }

  function returnToContactOptions() {
    setSearchParams({});

    setVendorFormData(initialVendorFormData);
    setQuoteFormData(initialQuoteFormData);
    setQuoteOptions(initialQuoteOptions);

    setVendorSubmitted(false);
    setQuoteSubmitted(false);
    setShowQuoteContactForm(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleVendorChange(event) {
    const { name, value } = event.target;

    setVendorFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setVendorSubmitted(false);
  }

  function handleVendorSubmit(event) {
    event.preventDefault();

    const vendorRequest = {
      requestType: "vendor-request",
      venue: VENUE_NAME,

      applicant: {
        name: vendorFormData.name,
        businessName:
          vendorFormData.businessName,
        email: vendorFormData.email,
        phone: vendorFormData.phone,
      },

      vendorDetails: {
        eventType: activeVendorEventType,

        eventLabel: getEventTypeLabel(
          activeVendorEventType
        ),

        vendorCategory:
          vendorFormData.vendorCategory,

        productDescription:
          vendorFormData.productDescription,

        boothSize: vendorFormData.boothSize,

        electricityNeeded:
          vendorFormData.electricityNeeded,

        website: vendorFormData.website,
        message: vendorFormData.message,
      },
    };

    console.log(
      "Lil Fish vendor request submitted:",
      vendorRequest
    );

    const selectedVendorEvent =
      activeVendorEventType;

    setVendorSubmitted(true);

    setVendorFormData({
      ...initialVendorFormData,
      eventType: selectedVendorEvent,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleQuoteFormChange(event) {
    const { name, value } = event.target;

    setQuoteFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setQuoteSubmitted(false);
    setQuoteError("");
    setQuoteSuccess("");
  }

  function handleQuoteOptionChange(event) {
    const { name, checked } = event.target;

    setQuoteOptions((previousOptions) => ({
      ...previousOptions,
      [name]: checked,
    }));

    setQuoteSubmitted(false);
    setQuoteError("");
    setQuoteSuccess("");
  }

  function handleQuoteNumberChange(event) {
    const { name, value } = event.target;

    setQuoteOptions((previousOptions) => ({
      ...previousOptions,
      [name]: value,
    }));

    setQuoteSubmitted(false);
    setQuoteError("");
    setQuoteSuccess("");
  }

  function validateQuoteCalculator() {
  const rawGuestCount = Number(
    quoteFormData.guestCount
  );

  if (!activeQuoteInterest) {
    return "Please select an event type before continuing.";
  }

  if (
    !Number.isFinite(rawGuestCount) ||
    rawGuestCount < 1
  ) {
    return "Guest count must be at least 1.";
  }

  if (rawGuestCount > 300) {
    return "Guest count cannot exceed 300 for an online quote.";
  }

  if (!selectedEventType) {
    return "The selected event package could not be found.";
  }

  if (
    !Number.isFinite(
      Number(selectedEventType.basePrice)
    )
  ) {
    return "Pricing information is unavailable for this event package.";
  }

  const selectedAddOnChecks = [
    {
      selected: quoteOptions.bridalSuite,
      label: "Bridal Suite",
      addOn: bridalSuiteAddOn,
    },
    {
      selected: quoteOptions.decorations,
      label: "Decoration Package",
      addOn: decorationAddOn,
    },
    {
      selected: quoteOptions.music,
      label: "Music Package",
      addOn: musicAddOn,
    },
    {
      selected: quoteOptions.cleaning,
      label: "Cleaning Service",
      addOn: cleaningAddOn,
    },
    {
      selected: quoteOptions.catering,
      label: "Catering",
      addOn: cateringAddOn,
    },
    {
      selected: quoteOptions.security,
      label: "Event Security",
      addOn: securityAddOn,
    },
  ];

  const missingPricing =
    selectedAddOnChecks.find(
      ({ selected, addOn }) =>
        selected &&
        (
          !addOn ||
          !Number.isFinite(Number(addOn.rate))
        )
    );

  if (missingPricing) {
    return `${missingPricing.label} pricing is unavailable. Please contact us for assistance.`;
  }

  return "";
}

function validateQuoteContactDetails() {
  if (!quoteFormData.name.trim()) {
    return "Please enter your full name.";
  }

  if (!quoteFormData.email.trim()) {
    return "Please enter your email address.";
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(quoteFormData.email)) {
    return "Please enter a valid email address.";
  }

  if (!quoteFormData.phone.trim()) {
    return "Please enter your phone number.";
  }

  if (!quoteFormData.eventDate) {
    return "Please choose a preferred event date.";
  }

  if (!quoteFormData.preferredStartTime) {
    return "Please choose a preferred start time.";
  }

  if (!quoteFormData.message.trim()) {
    return "Please tell us a little about your event.";
  }

  return "";
}


  function openQuoteContactForm() {
  setQuoteError("");
  setQuoteSuccess("");

  const validationMessage =
    validateQuoteCalculator();

  if (validationMessage) {
    setQuoteError(validationMessage);
    return;
  }

  setShowQuoteContactForm(true);
  setQuoteSubmitted(false);

  window.setTimeout(() => {
    document
      .getElementById(
        "lil-fish-quote-contact-form"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 100);
}


  async function handleQuoteSubmit(event) {
    event.preventDefault();

    setQuoteError("");
    setQuoteSuccess("");
    setIsSubmittingQuote(true);

    try {
      const calculatorValidation =
        validateQuoteCalculator();

      if (calculatorValidation) {
        throw new Error(calculatorValidation);
      }

      const contactValidation =
        validateQuoteContactDetails();

      if (contactValidation) {
        throw new Error(contactValidation);
      }

      const quoteRequest = {
        requestType: "event-quote",
        venue: VENUE_NAME,

        customer: {
          name: quoteFormData.name,
          email: quoteFormData.email,
          phone: quoteFormData.phone,
        },

        event: {
          eventType: activeQuoteInterest,

          eventTypeLabel: getEventTypeLabel(
            activeQuoteInterest
          ),

          eventDate: quoteFormData.eventDate,

          preferredStartTime:
            quoteFormData.preferredStartTime,

          guestCount,
          message: quoteFormData.message,
        },

        selectedPackages: {
          bridalSuite:
            quoteOptions.bridalSuite,

          decorations:
            quoteOptions.decorations,

          music: quoteOptions.music,

          cleaning:
            quoteOptions.cleaning,

          catering:
            quoteOptions.catering,

          security:
            quoteOptions.security,
        },

        pricing: {
          source: quoteConfig.sourceWorkbook,
          eventTypeId:
            selectedEventType?.eventId ?? null,
          basePrice: BASE_PRICE,

          bridalSuiteFee,

          bridalSuiteHours:
            quoteOptions.bridalSuite
              ? bridalSuiteHours
              : 0,

          bridalSuitePricePerHour:
            BRIDAL_SUITE_PRICE_PER_HOUR,

          decorationPackageFee:
            quoteOptions.decorations
              ? DECORATION_PACKAGE_FEE
              : 0,

          musicPackageFee:
            quoteOptions.music
              ? MUSIC_PACKAGE_FEE
              : 0,

          cleaningFee:
            quoteOptions.cleaning
              ? CLEANING_FEE
              : 0,

          refundableDeposit,

          refundableDepositTier:
            depositTierLabel,

          cateringFee,

          cateringPricePerGuest:
            CATERING_PRICE_PER_GUEST,

          securityFee,

          securityOfficers:
            quoteOptions.security
              ? securityOfficers
              : 0,

          securityHours:
            quoteOptions.security
              ? securityHours
              : 0,

          securityPricePerOfficerPerHour:
            SECURITY_PRICE_PER_OFFICER_PER_HOUR,

          estimatedTotal,
        },
      };

      console.log(
        "Lil Fish event quote submitted:",
        quoteRequest
      );

      const submittedEventType =
        activeQuoteInterest;

      if (!QUOTES_API_URL) {
        setQuoteSubmitted(true);

        setQuoteSuccess(
          "Demo request prepared. Connect VITE_QUOTES_API_URL to send quotes to the backend."
        );

        setShowQuoteContactForm(false);

        setQuoteFormData({
          ...initialQuoteFormData,
          interest: submittedEventType,
        });

        setQuoteOptions(initialQuoteOptions);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      const response = await fetch(
        `${QUOTES_API_URL.replace(/\/$/, "")}/api/quotes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quoteRequest),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The quote request failed."
        );
      }

      setQuoteSubmitted(true);

      setQuoteSuccess(
        `${data.message} Your request number is ${data.quote.id}.`
      );

      setShowQuoteContactForm(false);

      setQuoteFormData({
        ...initialQuoteFormData,
        interest: submittedEventType,
      });

      setQuoteOptions(initialQuoteOptions);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Lil Fish quote submission failed:",
        error
      );

      setQuoteSubmitted(false);

      setQuoteError(
        error instanceof TypeError
          ? "We could not reach the quote API. Check VITE_QUOTES_API_URL and make sure the backend is running."
          : error instanceof Error
            ? error.message
            : "Something went wrong while submitting your quote. Please try again."
      );
    } finally {
      setIsSubmittingQuote(false);
    }
  }

  if (pageMode === "choice") {
    return (
      <section className="contact-booking-section">
        <div className="contact-page-heading">
          <p className="quote-eyebrow">
            Lil Fish Community Center
          </p>

          <h2>How Can We Help?</h2>

          <p>
            Apply to become a festival vendor or
            build an estimate for your private
            event.
          </p>
        </div>

        <div className="contact-choice-grid">
          <article className="contact-choice-card">
            <div className="contact-choice-icon" aria-hidden="true">
              <FaStore />
            </div>

            <h3>Become a Vendor</h3>

            <p>
              Interested in selling food, crafts,
              artwork, produce, or other goods at
              one of our community events?
            </p>

            <div className="contact-choice-buttons">
              <button
                type="button"
                onClick={() =>
                  openVendorForm(
                    "harvest-festival"
                  )
                }
              >
                Harvest Festival Vendor
              </button>

              <button
                type="button"
                className="secondary-choice-button"
                onClick={() =>
                  openVendorForm(
                    "holiday-market"
                  )
                }
              >
                Holiday Market Vendor
              </button>
            </div>
          </article>

          <article className="contact-choice-card">
            <div className="contact-choice-icon" aria-hidden="true">
              <FaCalendarCheck />
            </div>

            <h3>Plan a Private Event</h3>

            <p>
              Build a quick estimate for a
              wedding, reunion, graduation,
              anniversary, or other private event.
            </p>

            <button
              type="button"
              onClick={() =>
                openQuoteCalculator(
                  "custom-event"
                )
              }
            >
              Open Event Quote Calculator
            </button>
          </article>
        </div>
      </section>
    );
  }

  if (pageMode === "vendor") {
    return (
      <section className="contact-booking-section">
        <div className="contact-page-heading">
          <p className="quote-eyebrow">
            Lil Fish Community Center
          </p>

          <h2>Vendor Request Form</h2>

          <p>
            Apply to participate as a vendor at
            the{" "}
            {getEventTypeLabel(
              activeVendorEventType
            )}
            .
          </p>
        </div>

        {vendorSubmitted && (
          <div
            className="contact-success-message"
            role="status"
          >
            <h3>Thank you!</h3>

            <p>
              Your vendor request has been
              received. Our team will review your
              information and follow up with
              availability, vendor requirements,
              pricing, and next steps.
            </p>
          </div>
        )}

        <div className="vendor-form-layout">
          <form
            className="contact-booking-form vendor-request-form"
            onSubmit={handleVendorSubmit}
          >
            <div className="contact-form-field">
              <label htmlFor="vendor-event-type">
                Which event are you applying for?
              </label>

              <select
                id="vendor-event-type"
                name="eventType"
                value={
                  activeVendorEventType
                }
                onChange={handleVendorChange}
                required
              >
                <option value="harvest-festival">
                  Harvest Festival
                </option>

                <option value="holiday-market">
                  Holiday Market
                </option>
              </select>
            </div>

            <div className="contact-form-grid">
              <div className="contact-form-field">
                <label htmlFor="vendor-name">
                  Your Name
                </label>

                <input
                  id="vendor-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={vendorFormData.name}
                  onChange={handleVendorChange}
                  required
                />
              </div>

              <div className="contact-form-field">
                <label htmlFor="vendor-business-name">
                  Business or Vendor Name
                </label>

                <input
                  id="vendor-business-name"
                  name="businessName"
                  type="text"
                  placeholder="Your business or booth name"
                  value={
                    vendorFormData.businessName
                  }
                  onChange={handleVendorChange}
                  required
                />
              </div>
            </div>

            <div className="contact-form-grid">
              <div className="contact-form-field">
                <label htmlFor="vendor-email">
                  Email Address
                </label>

                <input
                  id="vendor-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={vendorFormData.email}
                  onChange={handleVendorChange}
                  required
                />
              </div>

              <div className="contact-form-field">
                <label htmlFor="vendor-phone">
                  Phone Number
                </label>

                <input
                  id="vendor-phone"
                  name="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={vendorFormData.phone}
                  onChange={handleVendorChange}
                  required
                />
              </div>
            </div>

            <div className="contact-form-field">
              <label htmlFor="vendor-category">
                What type of vendor are you?
              </label>

              <select
                id="vendor-category"
                name="vendorCategory"
                value={
                  vendorFormData.vendorCategory
                }
                onChange={handleVendorChange}
                required
              >
                <option value="">
                  Select a vendor category
                </option>

                <option value="food">
                  Food or Beverage
                </option>

                <option value="farm-produce">
                  Farm Produce
                </option>

                <option value="handmade-crafts">
                  Handmade Crafts
                </option>

                <option value="artwork">
                  Artwork
                </option>

                <option value="clothing-accessories">
                  Clothing or Accessories
                </option>

                <option value="home-goods">
                  Home Goods
                </option>

                <option value="community-organization">
                  Community Organization
                </option>

                <option value="entertainment">
                  Entertainment or Activity
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="contact-form-field">
              <label htmlFor="product-description">
                What will you be selling or
                offering?
              </label>

              <textarea
                id="product-description"
                name="productDescription"
                rows="5"
                placeholder="Describe your products, food, services, activity, or display."
                value={
                  vendorFormData.productDescription
                }
                onChange={handleVendorChange}
                required
              />
            </div>

            <div className="contact-form-grid">
              <div className="contact-form-field">
                <label htmlFor="booth-size">
                  Preferred Booth Size
                </label>

                <select
                  id="booth-size"
                  name="boothSize"
                  value={
                    vendorFormData.boothSize
                  }
                  onChange={handleVendorChange}
                  required
                >
                  <option value="">
                    Select a booth size
                  </option>

                  <option value="10x10">
                    10 x 10 booth
                  </option>

                  <option value="10x20">
                    10 x 20 booth
                  </option>

                  <option value="food-truck">
                    Food truck or trailer
                  </option>

                  <option value="not-sure">
                    Not sure yet
                  </option>
                </select>
              </div>

              <div className="contact-form-field">
                <label htmlFor="electricity-needed">
                  Do you need electricity?
                </label>

                <select
                  id="electricity-needed"
                  name="electricityNeeded"
                  value={
                    vendorFormData.electricityNeeded
                  }
                  onChange={handleVendorChange}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>

                  <option value="not-sure">
                    Not sure
                  </option>
                </select>
              </div>
            </div>

            <div className="contact-form-field">
              <label htmlFor="vendor-website">
                Website or Social Media
              </label>

              <input
                id="vendor-website"
                name="website"
                type="text"
                placeholder="Optional website or social media page"
                value={vendorFormData.website}
                onChange={handleVendorChange}
              />
            </div>

            <div className="contact-form-field">
              <label htmlFor="vendor-message">
                Anything else we should know?
              </label>

              <textarea
                id="vendor-message"
                name="message"
                rows="5"
                placeholder="Share setup requirements, special requests, past event experience, or other helpful information."
                value={vendorFormData.message}
                onChange={handleVendorChange}
              />
            </div>

            <button
              className="submit-quote-button"
              type="submit"
            >
              Submit Vendor Request
            </button>
          </form>

          <aside className="vendor-side-card">
            <h3>Planning a Private Event?</h3>

            <p>
              The vendor request form is only for
              the Harvest Festival and Holiday
              Market.
            </p>

            <p>
              For weddings, reunions,
              graduations, anniversaries, and
              private celebrations, use our event
              quote calculator.
            </p>

            <button
              type="button"
              onClick={() =>
                openQuoteCalculator(
                  "custom-event"
                )
              }
            >
              Open Event Quote Calculator
            </button>

            <button
              type="button"
              className="text-button"
              onClick={returnToContactOptions}
            >
              Return to Contact Options
            </button>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-booking-section">
      <div className="contact-page-heading">
        <p className="quote-eyebrow">
          Lil Fish Community Center
        </p>

        <h2>Event Quote Calculator</h2>

        <p>
          Build a quick estimate for your event,
          then submit your information for
          availability and final pricing.
        </p>
      </div>

      {quoteError && (
        <div
          className="quote-error-message"
          role="alert"
        >
          <strong>We couldn't continue.</strong>
          <p>{quoteError}</p>
        </div>
      )}

      {quoteSuccess && (
        <div
          className="quote-success-message"
          role="status"
        >
          <strong>Success!</strong>
          <p>{quoteSuccess}</p>
        </div>
      )}

      {quoteSubmitted && (
        <div
          className="contact-success-message"
          role="status"
        >
          <h3>Thank you!</h3>

          <p>
            Your quote inquiry has been received.
            Our team will follow up with
            availability, final pricing, and next
            steps.
          </p>
        </div>
      )}

      <div className="quote-calculator-layout">
        <div className="quote-calculator-controls">
          <div className="calculator-card">
            <h3>Event Information</h3>

            <label htmlFor="quote-event-type">
              What type of event are you planning?
            </label>

            <select
              id="quote-event-type"
              name="interest"
              value={activeQuoteInterest}
              onChange={handleQuoteFormChange}
              required
            >
              <option value="">
                Select an event type
              </option>

              <option value="spring-festival">
                Spring Festival
              </option>

              <option value="summer-concert">
                Summer Concert
              </option>

              <option value="wedding-venue">
                Wedding Venue
              </option>

              <option value="family-reunion">
                Family Reunion
              </option>

              <option value="graduation">
                Graduation Celebration
              </option>

              <option value="retirement">
                Retirement Party
              </option>

              <option value="anniversary">
                Anniversary Celebration
              </option>

              <option value="custom-event">
                Custom Event Package
              </option>
            </select>
            <label htmlFor="quote-guest-count">
              Estimated Guest Count
            </label>

            <input
              id="quote-guest-count"
              name="guestCount"
              type="number"
              min="1"
              max="300"
              value={quoteFormData.guestCount}
              onChange={handleQuoteFormChange}
            />

            <p className="calculator-helper-text">
              Catering is estimated at{" "}
              {formatCurrency(
                CATERING_PRICE_PER_GUEST
              )}{" "}
              per guest. Your refundable deposit
              also adjusts automatically according
              to the estimated event size.
            </p>
          </div>

          <div className="calculator-card">
            <h3>Packages and Services</h3>

            <label className="calculator-checkbox">
              <input
                type="checkbox"
                name="bridalSuite"
                checked={
                  quoteOptions.bridalSuite
                }
                onChange={
                  handleQuoteOptionChange
                }
              />

              <span>
                <strong>Bridal Suite</strong>

                <small>
                  {formatCurrency(
                    BRIDAL_SUITE_PRICE_PER_HOUR
                  )}{" "}
                  per hour
                </small>
              </span>
            </label>

            {quoteOptions.bridalSuite && (
              <div className="hourly-option">
                <label htmlFor="bridal-suite-hours">
                  Bridal Suite Hours
                </label>

                <input
                  id="bridal-suite-hours"
                  name="bridalSuiteHours"
                  type="number"
                  min="1"
                  max="12"
                  value={
                    quoteOptions.bridalSuiteHours
                  }
                  onChange={
                    handleQuoteNumberChange
                  }
                />

                <p>
                  {bridalSuiteHours} hour
                  {bridalSuiteHours === 1
                    ? ""
                    : "s"}{" "}
                  x{" "}
                  {formatCurrency(
                    BRIDAL_SUITE_PRICE_PER_HOUR
                  )}{" "}
                  ={" "}
                  {formatCurrency(
                    bridalSuiteFee
                  )}
                </p>
              </div>
            )}

            <label className="calculator-checkbox">
              <input
                type="checkbox"
                name="decorations"
                checked={
                  quoteOptions.decorations
                }
                onChange={
                  handleQuoteOptionChange
                }
              />

              <span>
                <strong>
                  Decoration Package
                </strong>

                <small>
                  {formatCurrency(
                    DECORATION_PACKAGE_FEE
                  )}
                </small>
              </span>
            </label>

            <label className="calculator-checkbox">
              <input
                type="checkbox"
                name="music"
                checked={quoteOptions.music}
                onChange={
                  handleQuoteOptionChange
                }
              />

              <span>
                <strong>Music Package</strong>

                <small>
                  {formatCurrency(
                    MUSIC_PACKAGE_FEE
                  )}
                </small>
              </span>
            </label>

            <label className="calculator-checkbox">
              <input
                type="checkbox"
                name="cleaning"
                checked={
                  quoteOptions.cleaning
                }
                onChange={
                  handleQuoteOptionChange
                }
              />

              <span>
                <strong>Cleaning Service</strong>

                <small>
                  {formatCurrency(
                    CLEANING_FEE
                  )}
                </small>
              </span>
            </label>

            <div className="hourly-option">
              <label>
                Estimated Refundable Damage
                Deposit
              </label>

              <p>
                <strong>
                  {formatCurrency(
                    refundableDeposit
                  )}
                </strong>
              </p>

              <p>{depositTierLabel}</p>

              <p>
                This required deposit is based on
                the estimated number of guests. It
                may be adjusted after the venue
                reviews the final event details,
                insurance requirements, and overall
                risk level.
              </p>
            </div>

            <label className="calculator-checkbox">
              <input
                type="checkbox"
                name="catering"
                checked={
                  quoteOptions.catering
                }
                onChange={
                  handleQuoteOptionChange
                }
              />

              <span>
                <strong>Catering</strong>

                <small>
                  {formatCurrency(
                    CATERING_PRICE_PER_GUEST
                  )}{" "}
                  per guest
                </small>
              </span>
            </label>

            <label className="calculator-checkbox">
              <input
                type="checkbox"
                name="security"
                checked={
                  quoteOptions.security
                }
                onChange={
                  handleQuoteOptionChange
                }
              />

              <span>
                <strong>Event Security</strong>

                <small>
                  {formatCurrency(
                    SECURITY_PRICE_PER_OFFICER_PER_HOUR
                  )}{" "}
                  per officer, per hour
                </small>
              </span>
            </label>

            {quoteOptions.security && (
              <div className="security-options">
                <div>
                  <label htmlFor="security-officers">
                    Number of Officers
                  </label>

                  <input
                    id="security-officers"
                    name="securityOfficers"
                    type="number"
                    min="1"
                    max="10"
                    value={
                      quoteOptions.securityOfficers
                    }
                    onChange={
                      handleQuoteNumberChange
                    }
                  />
                </div>

                <div>
                  <label htmlFor="security-hours">
                    Security Hours
                  </label>

                  <input
                    id="security-hours"
                    name="securityHours"
                    type="number"
                    min="1"
                    max="24"
                    value={
                      quoteOptions.securityHours
                    }
                    onChange={
                      handleQuoteNumberChange
                    }
                  />
                </div>

                <p className="security-calculation">
                  {securityOfficers} officer
                  {securityOfficers === 1
                    ? ""
                    : "s"}{" "}
                  x {securityHours} hour
                  {securityHours === 1
                    ? ""
                    : "s"}{" "}
                  x{" "}
                  {formatCurrency(
                    SECURITY_PRICE_PER_OFFICER_PER_HOUR
                  )}{" "}
                  ={" "}
                  {formatCurrency(securityFee)}
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="quote-summary-card">
          <div className="quote-summary-heading">
            <p>Estimated Quote</p>

            <h3>
              {formatCurrency(estimatedTotal)}
            </h3>
          </div>

          <div className="quote-event-summary">
            <p>
              <span>Venue</span>
              <strong>{VENUE_NAME}</strong>
            </p>

            <p>
              <span>Event</span>

              <strong>
                {getEventTypeLabel(
                  activeQuoteInterest
                )}
              </strong>
            </p>

            <p>
              <span>Guests</span>
              <strong>{guestCount}</strong>
            </p>
          </div>

          <div className="quote-price-breakdown">
            <div>
              <span>
                Venue rental - 4 hours
              </span>

              <strong>
                {formatCurrency(BASE_PRICE)}
              </strong>
            </div>

            {quoteOptions.bridalSuite && (
              <div>
                <span>
                  Bridal suite -{" "}
                  {bridalSuiteHours} hour
                  {bridalSuiteHours === 1
                    ? ""
                    : "s"}
                </span>

                <strong>
                  {formatCurrency(
                    bridalSuiteFee
                  )}
                </strong>
              </div>
            )}

            {quoteOptions.decorations && (
              <div>
                <span>Decorations</span>

                <strong>
                  {formatCurrency(
                    DECORATION_PACKAGE_FEE
                  )}
                </strong>
              </div>
            )}

            {quoteOptions.music && (
              <div>
                <span>Music package</span>

                <strong>
                  {formatCurrency(
                    MUSIC_PACKAGE_FEE
                  )}
                </strong>
              </div>
            )}

            {quoteOptions.cleaning && (
              <div>
                <span>Cleaning fee</span>

                <strong>
                  {formatCurrency(
                    CLEANING_FEE
                  )}
                </strong>
              </div>
            )}

            <div>
              <span>
                Refundable deposit -{" "}
                {guestCount} guests
              </span>

              <strong>
                {formatCurrency(
                  refundableDeposit
                )}
              </strong>
            </div>

            {quoteOptions.security && (
              <div>
                <span>
                  Security - {securityOfficers}{" "}
                  officer
                  {securityOfficers === 1
                    ? ""
                    : "s"}
                  , {securityHours} hour
                  {securityHours === 1
                    ? ""
                    : "s"}
                </span>

                <strong>
                  {formatCurrency(
                    securityFee
                  )}
                </strong>
              </div>
            )}

            {quoteOptions.catering && (
              <div>
                <span>
                  Catering - {guestCount} guests
                </span>

                <strong>
                  {formatCurrency(
                    cateringFee
                  )}
                </strong>
              </div>
            )}
          </div>

          <div className="quote-total-row">
            <span>Estimated Total</span>

            <strong>
              {formatCurrency(estimatedTotal)}
            </strong>
          </div>

          <p className="quote-disclaimer">
            This calculator provides an estimate
            only. The refundable damage deposit is
            based on the estimated guest count and
            may be adjusted after the final event
            size, insurance requirements, event
            activities, and other risk factors are
            reviewed.
          </p>

          <div className="quote-action-buttons">
            <button
              type="button"
              className="quick-quote-button"
              onClick={openQuoteContactForm}
            >
              Continue With This Quote
            </button>

            <button
              type="button"
              className="text-button"
              onClick={returnToContactOptions}
            >
              Return to Contact Options
            </button>
          </div>
        </aside>
      </div>

      {showQuoteContactForm && (
        <div
          className="quote-inquiry-wrapper"
          id="lil-fish-quote-contact-form"
        >
          <div className="quote-inquiry-heading">
            <p className="quote-eyebrow">
              Personalized Event Request
            </p>

            <h2>
              Request Your Detailed Quote
            </h2>

            <p>
              Share your contact and event
              information so our team can confirm
              availability and prepare final
              pricing.
            </p>
          </div>

          <form
            className="contact-booking-form"
            onSubmit={handleQuoteSubmit}
            noValidate
          >
            <div className="submitted-quote-preview">
              <div>
                <span>Estimated total</span>

                <strong>
                  {formatCurrency(
                    estimatedTotal
                  )}
                </strong>
              </div>

              <div>
                <span>Event type</span>

                <strong>
                  {getEventTypeLabel(
                    activeQuoteInterest
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Refundable deposit
                </span>

                <strong>
                  {formatCurrency(
                    refundableDeposit
                  )}
                </strong>
              </div>
            </div>

            <div className="contact-form-grid">
              <div className="contact-form-field">
                <label htmlFor="quote-name">
                  Your Name
                </label>

                <input
                  id="quote-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={quoteFormData.name}
                  onChange={
                    handleQuoteFormChange
                  }
                  required
                />
              </div>

              <div className="contact-form-field">
                <label htmlFor="quote-email">
                  Your Email
                </label>

                <input
                  id="quote-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={quoteFormData.email}
                  onChange={
                    handleQuoteFormChange
                  }
                  required
                />
              </div>
            </div>

            <div className="contact-form-field">
              <label htmlFor="quote-phone">
                Phone Number
              </label>

              <input
                id="quote-phone"
                name="phone"
                type="tel"
                placeholder="Your phone number"
                value={quoteFormData.phone}
                onChange={
                  handleQuoteFormChange
                }
                required
              />
            </div>

            <div className="contact-form-grid">
              <div className="contact-form-field">
                <label htmlFor="quote-event-date">
                  Preferred Event Date
                </label>

                <input
                  id="quote-event-date"
                  name="eventDate"
                  type="date"
                  value={
                    quoteFormData.eventDate
                  }
                  onChange={
                    handleQuoteFormChange
                  }
                  required
                />
              </div>

              <div className="contact-form-field">
                <label htmlFor="quote-start-time">
                  Preferred Start Time
                </label>

                <input
                  id="quote-start-time"
                  name="preferredStartTime"
                  type="time"
                  value={
                    quoteFormData.preferredStartTime
                  }
                  onChange={
                    handleQuoteFormChange
                  }
                  required
                />
              </div>
            </div>

            <div className="contact-form-field">
              <label htmlFor="quote-message">
                Tell us more about your event
              </label>

              <textarea
                id="quote-message"
                name="message"
                rows="6"
                placeholder="Tell us about your theme, schedule, setup needs, accessibility needs, vendors, alcohol service, entertainment, and special requests."
                value={quoteFormData.message}
                onChange={
                  handleQuoteFormChange
                }
                required
              />
            </div>

            <div className="quote-form-actions">
              <button
                type="button"
                className="cancel-quote-button"
                onClick={() =>
                  setShowQuoteContactForm(false)
                }
              >
                Return to Calculator
              </button>

              <button
                type="submit"
                className="submit-quote-button"
                disabled={isSubmittingQuote}
              >
                {isSubmittingQuote
                  ? "Submitting Quote..."
                  : "Request Detailed Quote"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default ContactForm;
