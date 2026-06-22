const appRoot = document.querySelector("#ready-labels-app");

if (appRoot && window.React && window.ReactDOM) {
  const { createElement: h, useEffect, useState } = window.React;
  const sections = ["Classroom Labels", "Infant Feeding Labels"];
  const feedingLabelOptions = ["Breast Milk Bottle Labels", "Formula Bottle Labels"];
  const classroomTemplates = [
    "Avery 94207 = Small, 2\" x 4\"",
    "Avery 6874 = Medium, 3\" x 3.75\"",
    "Avery 94256 = Large, 5\" x 3.5\"",
  ];
  const classroomLabelTypes = ["Cubby", "Crib", "Cot", "Diapers", "Clothes", "Snacks", "Backpack"];
  const communityPlaythingsLabels = [
    "Standard Cubby Insert",
    "Compact Cubby Insert",
    "Infant Cubby Insert",
    "Basket Label",
  ];

  function CareCheckReadyLabelsApp() {
    const [activeSection, setActiveSection] = useState(sections[0]);
    const [activeFeedingLabel, setActiveFeedingLabel] = useState(feedingLabelOptions[0]);
    const [childName, setChildName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [classroom, setClassroom] = useState("");
    const [photoPreview, setPhotoPreview] = useState("");
    const [classroomTemplate, setClassroomTemplate] = useState(classroomTemplates[0]);
    const [selectedClassroomLabels, setSelectedClassroomLabels] = useState(["Cubby"]);
    const [selectedCommunityLabels, setSelectedCommunityLabels] = useState(["Standard Cubby Insert"]);

    useEffect(() => {
      return () => {
        if (photoPreview) {
          URL.revokeObjectURL(photoPreview);
        }
      };
    }, [photoPreview]);

    function handlePhotoUpload(event) {
      const file = event.target.files && event.target.files[0];

      if (!file) {
        setPhotoPreview("");
        return;
      }

      setPhotoPreview((currentPreview) => {
        if (currentPreview) {
          URL.revokeObjectURL(currentPreview);
        }

        return URL.createObjectURL(file);
      });
    }

    function toggleClassroomLabel(labelType) {
      setSelectedClassroomLabels((currentTypes) =>
        currentTypes.includes(labelType)
          ? currentTypes.filter((currentType) => currentType !== labelType)
          : [...currentTypes, labelType]
      );
    }

    function toggleCommunityLabel(labelType) {
      setSelectedCommunityLabels((currentTypes) =>
        currentTypes.includes(labelType)
          ? currentTypes.filter((currentType) => currentType !== labelType)
          : [...currentTypes, labelType]
      );
    }

    function getInitials() {
      const initials = childName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((namePart) => namePart.charAt(0).toUpperCase())
        .join("");

      return initials || "CC";
    }

    function renderPhoto(className, altContext) {
      return h(
        "div",
        { className },
        photoPreview
          ? h("img", {
              src: photoPreview,
              alt: childName ? `${childName} ${altContext}` : `Child ${altContext}`,
            })
          : h("span", null, getInitials())
      );
    }

    function renderTextField(label, value, onChange, type = "text", placeholder = "") {
      return h(
        "label",
        null,
        label,
        h("input", {
          type,
          value,
          placeholder,
          onChange: (event) => onChange(event.target.value),
        })
      );
    }

    function handlePrint() {
      window.print();
    }

    function renderSharedProfileForm() {
      return h(
        "section",
        { className: "ready-profile-panel" },
        h("h1", null, "CareCheck Ready Labels"),
        renderTextField("Child Name", childName, setChildName, "text", "Avery Johnson"),
        renderTextField("Date of Birth", dateOfBirth, setDateOfBirth, "date"),
        renderTextField("Classroom", classroom, setClassroom, "text", "Infant Room A"),
        h(
          "label",
          null,
          "Child Photo",
          h("input", {
            type: "file",
            accept: "image/*",
            onChange: handlePhotoUpload,
          })
        ),
        h(
          "div",
          { className: "ready-photo-status" },
          renderPhoto("ready-photo-thumb", "photo preview"),
          h("span", null, photoPreview ? "Photo ready" : "Live photo preview")
        ),
        h(
          "article",
          { className: "ready-child-card", "aria-live": "polite" },
          renderPhoto("ready-child-photo", "profile"),
          h("p", { className: "ready-eyebrow" }, "Shared Child Profile"),
          h("h2", null, childName || "Child Name"),
          h(
            "dl",
            null,
            h("div", null, h("dt", null, "Date of Birth"), h("dd", null, dateOfBirth || "DOB")),
            h("div", null, h("dt", null, "Classroom"), h("dd", null, classroom || "Classroom")),
            h("div", null, h("dt", null, "Active Section"), h("dd", null, activeSection))
          )
        )
      );
    }

    function renderClassroomLabel(labelType) {
      return h(
        "article",
        { key: labelType, className: "classroom-label-card" },
        renderPhoto("mini-label-photo", `${labelType} label`),
        h(
          "div",
          null,
          h("p", { className: "ready-eyebrow" }, labelType),
          h("h3", null, childName || "Child Name"),
          h("p", null, classroom || "Classroom"),
          h("small", null, classroomTemplate)
        )
      );
    }

    function renderCommunityLabel(labelType) {
      const isBasketLabel = labelType === "Basket Label";

      return h(
        "article",
        {
          key: labelType,
          className: isBasketLabel ? "community-label-card community-basket-label" : "community-label-card",
        },
        h("p", { className: "ready-eyebrow" }, labelType),
        h(
          "div",
          { className: "community-label-face" },
          renderPhoto(isBasketLabel ? "community-basket-photo" : "community-label-photo", `${labelType} label`),
          h("h3", null, childName || "Child Name")
        ),
        isBasketLabel
          ? h(
              "p",
              { className: "community-label-note" },
              "Front-facing half of a 3\" x 5\" card folded for Community Playthings basket label holders."
            )
          : null
      );
    }

    function renderClassroomSection() {
      return h(
        "section",
        { className: "ready-product-panel" },
        h(
          "div",
          { className: "ready-panel-heading" },
          h("div", null, h("p", { className: "ready-eyebrow" }, "Product 1"), h("h2", null, "Classroom Labels")),
          h("span", null, `${selectedClassroomLabels.length + selectedCommunityLabels.length} selected`)
        ),
        h(
          "section",
          { className: "classroom-label-group" },
          h("div", { className: "classroom-group-heading" }, h("h3", null, "Avery Labels")),
          h(
            "label",
            null,
            "Avery Label Template",
            h(
              "select",
              {
                value: classroomTemplate,
                onChange: (event) => setClassroomTemplate(event.target.value),
              },
              classroomTemplates.map((template) => h("option", { key: template, value: template }, template))
            )
          ),
          h(
            "fieldset",
            { className: "ready-fieldset" },
            h("legend", null, "Avery Label Types"),
            h(
              "div",
              { className: "ready-checkbox-grid" },
              classroomLabelTypes.map((labelType) =>
                h(
                  "label",
                  { key: labelType, className: "ready-checkbox-card" },
                  h("input", {
                    type: "checkbox",
                    checked: selectedClassroomLabels.includes(labelType),
                    onChange: () => toggleClassroomLabel(labelType),
                  }),
                  h("span", null, labelType)
                )
              )
            )
          ),
          h(
            "div",
            { className: "classroom-label-grid" },
            selectedClassroomLabels.length
              ? selectedClassroomLabels.map(renderClassroomLabel)
              : h("div", { className: "ready-empty-state" }, "Select an Avery label type.")
          )
        ),
        h(
          "section",
          { className: "classroom-label-group" },
          h("div", { className: "classroom-group-heading" }, h("h3", null, "Community Playthings Labels")),
          h(
            "fieldset",
            { className: "ready-fieldset" },
            h("legend", null, "Community Playthings Templates"),
            h(
              "div",
              { className: "ready-checkbox-grid community-checkbox-grid" },
              communityPlaythingsLabels.map((labelType) =>
                h(
                  "label",
                  { key: labelType, className: "ready-checkbox-card" },
                  h("input", {
                    type: "checkbox",
                    checked: selectedCommunityLabels.includes(labelType),
                    onChange: () => toggleCommunityLabel(labelType),
                  }),
                  h("span", null, labelType)
                )
              )
            )
          ),
          h(
            "div",
            { className: "community-label-grid" },
            selectedCommunityLabels.length
              ? selectedCommunityLabels.map(renderCommunityLabel)
              : h("div", { className: "ready-empty-state" }, "Select a Community Playthings label.")
          )
        )
      );
    }

    function renderParentLine(label) {
      return h(
        "div",
        { key: label, className: "parent-write-line" },
        h("span", null, label),
        h("i", { "aria-hidden": "true" })
      );
    }

    function renderParentCheckbox(label) {
      return h(
        "div",
        { key: label, className: "parent-check-line" },
        h("span", { "aria-hidden": "true" }),
        h("strong", null, label)
      );
    }

    function renderBottleLabel(kind) {
      const isBreastMilk = kind === "Breast Milk";

      return h(
        "article",
        { className: "bottle-label-preview" },
        h(
          "div",
          { className: "bottle-label-topline" },
          h("span", null, "Avery 61503"),
          h("strong", null, `${kind} Bottle Label`)
        ),
        h(
          "div",
          { className: "bottle-label-main" },
          renderPhoto("bottle-label-photo", `${kind} bottle label`),
          h(
            "div",
            null,
            h("h3", null, childName || "Child Name"),
            h("p", null, dateOfBirth ? `DOB ${dateOfBirth}` : "DOB"),
            h("small", null, classroom || "Classroom")
          )
        ),
        h(
          "div",
          { className: "bottle-parent-fields" },
          isBreastMilk
            ? [
                renderParentLine("Ounces"),
                renderParentLine("Date"),
                h(
                  "div",
                  { key: "milk-state", className: "parent-check-grid" },
                  renderParentCheckbox("Fresh"),
                  renderParentCheckbox("Thawed")
                ),
                renderParentLine("Date Pumped"),
                renderParentLine("Date Thawed"),
              ]
            : [
                renderParentLine("Ounces"),
                renderParentLine("Date"),
                renderParentLine("Week Of"),
                h(
                  "div",
                  { key: "formula-weekdays", className: "parent-weekday-row" },
                  ["M", "T", "W", "TH", "F"].map((day) =>
                    h("span", { key: day }, day)
                  )
                ),
              ]
        )
      );
    }

    function renderFeedingProfileSummary(labelName) {
      return h(
        "div",
        { className: "feeding-profile-summary" },
        renderPhoto("feeding-summary-photo", `${labelName} child photo`),
        h(
          "div",
          null,
          h("span", null, "From Child Profile"),
          h("strong", null, childName || "Child Name"),
          h("small", null, dateOfBirth ? `DOB ${dateOfBirth}` : "DOB"),
          h("small", null, classroom || "Classroom")
        )
      );
    }

    function renderFeedingFeature(title, kind) {
      const isSelected = activeFeedingLabel === title;

      return h(
        "article",
        { className: isSelected ? "feeding-feature-card is-selected" : "feeding-feature-card" },
        h(
          "div",
          { className: "feeding-feature-heading" },
          h("div", null, h("p", { className: "ready-eyebrow" }, "Avery 61503"), h("h3", null, title)),
          h("span", null, isSelected ? "Selected" : "Option")
        ),
        renderFeedingProfileSummary(title),
        h(
          "button",
          {
            className: isSelected ? "feeding-select-button is-active" : "feeding-select-button",
            type: "button",
            onClick: () => setActiveFeedingLabel(title),
          },
          isSelected ? "Selected for Print" : `Select ${title}`
        ),
        isSelected
          ? h("div", { className: "feeding-feature-layout" }, renderBottleLabel(kind))
          : h("p", { className: "feeding-option-note" }, "Select this option to preview blank parent-completion labels.")
      );
    }

    function renderInfantFeedingSection() {
      return h(
        "section",
        { className: "ready-product-panel" },
        h(
          "div",
          { className: "ready-panel-heading" },
          h(
            "div",
            null,
            h("p", { className: "ready-eyebrow" }, "Product 2"),
            h("h2", null, "Infant Feeding Labels")
          ),
          h("span", null, "Avery 61503")
        ),
        h(
          "p",
          { className: "ready-panel-note" },
          "Directors print these temperature-resistant bottle labels for families. Parent-completion fields stay blank for writing at home."
        ),
        h(
          "button",
          { className: "ready-print-button", type: "button", onClick: handlePrint },
          `Print ${activeFeedingLabel}`
        ),
        h(
          "div",
          { className: "feeding-primary-stack" },
          renderFeedingFeature("Breast Milk Bottle Labels", "Breast Milk"),
          renderFeedingFeature("Formula Bottle Labels", "Formula")
        )
      );
    }

    return h(
      "div",
      { className: "ready-app" },
      h(
        "header",
        { className: "ready-header" },
        h(
          "div",
          { className: "ready-brand" },
          h("span", { className: "ready-brand-mark" }, "C"),
          h("div", null, h("strong", null, "CareCheck"), h("small", null, "Ready Labels\u2122"))
        ),
        h(
          "div",
          { className: "ready-section-tabs", role: "tablist", "aria-label": "Label sections" },
          sections.map((section) =>
            h(
              "button",
              {
                key: section,
                type: "button",
                role: "tab",
                "aria-selected": activeSection === section,
                className: activeSection === section ? "is-active" : "",
                onClick: () => setActiveSection(section),
              },
              section
            )
          )
        )
      ),
      h(
        "main",
        { className: "ready-workspace" },
        renderSharedProfileForm(),
        activeSection === "Classroom Labels" ? renderClassroomSection() : renderInfantFeedingSection()
      )
    );
  }

  if (window.ReactDOM.createRoot) {
    window.ReactDOM.createRoot(appRoot).render(h(CareCheckReadyLabelsApp));
  } else {
    window.ReactDOM.render(h(CareCheckReadyLabelsApp), appRoot);
  }
}

const careCheckComplianceDisclaimer =
  "CareCheck products and services are designed to support childcare operations and administrative workflows. They do not replace licensing requirements, accreditation standards, active supervision, professional judgment, or regulatory compliance obligations.";

const careCheckDevelopmentNotice =
  "CareCheck Technologies\u2122 is currently in active development. Features, specifications, integrations, pricing, and product availability may change prior to commercial release.";

function getCareCheckPathPrefix() {
  const nestedStylesheet = document.querySelector('link[href^="../styles.css"]');

  return nestedStylesheet ? "../" : "";
}

function normalizeCareCheckFooter() {
  const footer = document.querySelector(".site-footer");

  if (!footer) {
    return;
  }

  const prefix = getCareCheckPathPrefix();

  footer.innerHTML = `
    <div class="site-footer-main">
      <div>
        <strong>CareCheck Technologies</strong>
        <p>${careCheckDevelopmentNotice}</p>
      </div>
      <nav class="site-footer-links" aria-label="Legal and contact links">
        <a href="${prefix}privacy/">Privacy Policy</a>
        <a href="${prefix}terms/">Terms of Use</a>
        <a href="${prefix}product-disclaimer/">Product Disclaimer</a>
        <a href="${prefix}contact.html">Contact</a>
      </nav>
    </div>
    <p class="site-footer-disclaimer">${careCheckComplianceDisclaimer}</p>
    <p class="site-footer-trademark">CareCheck&trade;, CareCheck Ready&trade;, CribCheck&trade;, BottleCheck&trade;, DiaperCheck&trade;, TempCheck&trade;, DoorCheck&trade;, CloseCheck&trade;, and related names are trademarks or trademarks pending of CareCheck Technologies LLC.</p>
    <p class="site-footer-copyright">&copy; 2026 CareCheck Technologies LLC. All Rights Reserved.</p>
  `;
}

function normalizeCareCheckNavigation() {
  document.querySelectorAll('a[href$="shop-printables.html"]').forEach((link) => {
    if (link.textContent.trim() === "Shop Printables") {
      link.textContent = "CareCheck Ready\u2122";
    }
  });
}

function addCareCheckDevelopmentBanner() {
  const path = window.location.pathname.toLowerCase();
  const developmentPages = [
    "infant-care",
    "toddler-solutions",
    "office-solutions",
    "essentials",
    "academy",
    "celebrations",
    "innovation-lab",
    "founding-partners",
    "recommended-resources",
  ];
  const isDevelopmentPage = developmentPages.some((page) => path.includes(page));
  const main = document.querySelector("main");
  const pageAlreadyMarked = main?.querySelector(".page-hero h1")?.textContent.trim() === "Under Development";

  if (!isDevelopmentPage || !main || pageAlreadyMarked || document.querySelector(".development-banner")) {
    return;
  }

  const banner = document.createElement("section");
  banner.className = "development-banner";
  banner.setAttribute("aria-label", "Under Development notice");
  banner.innerHTML = `
    <p class="eyebrow">Under Development</p>
    <h2>CareCheck operational support tools are currently in development.</h2>
    <p>These hardware and operational product concepts are not yet commercially available. CareCheck Ready remains available as a session-based MVP document generator for creating downloadable childcare materials.</p>
    <p class="development-banner-disclaimer">${careCheckComplianceDisclaimer}</p>
  `;

  const hero = main.querySelector(".page-hero, .hero");
  if (hero?.nextSibling) {
    main.insertBefore(banner, hero.nextSibling);
  } else {
    main.prepend(banner);
  }
}

normalizeCareCheckNavigation();
normalizeCareCheckFooter();
addCareCheckDevelopmentBanner();
