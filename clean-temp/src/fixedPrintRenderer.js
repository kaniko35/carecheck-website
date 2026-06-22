(function () {
  const registry = window.CareCheckLabelRegistry;
  const renderer = window.CareCheckPrintRenderer;
  const PT = registry.INCH_TO_PT;
  const GREEN = "#0B7A34";
  const RED = "#C62828";

  const px = (value) => `${value}px`;
  const points = (inches) => inches * PT;
  const debugEnabled = () => new URLSearchParams(window.location.search).has("labelDebug")
    || window.localStorage?.getItem("carecheckLabelDebug") === "1";

  const makeEl = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const place = (element, box) => {
    element.style.left = px(box.x);
    element.style.top = px(box.y);
    element.style.width = px(box.width);
    element.style.height = px(box.height);
    return element;
  };

  const addSafeZone = (label, safe) => {
    if (!debugEnabled()) return;
    const zone = makeEl("div", "fixed-safe-zone");
    place(zone, safe);
    label.append(zone);
  };

  const addPhoto = (label, box, photoUrl) => {
    const photo = makeEl("div", "fixed-photo-box");
    place(photo, box);
    if (photoUrl) {
      const img = document.createElement("img");
      img.alt = "";
      img.src = photoUrl;
      photo.append(img);
      photo.classList.add("has-photo");
    } else {
      photo.textContent = "Photo";
    }
    label.append(photo);
    return photo;
  };

  const addFitText = (parent, tag, className, text, box, rule, options = {}) => {
    const element = makeEl(tag, className, text);
    element.dataset.fitText = "";
    element.dataset.fitMax = rule.max;
    element.dataset.fitMin = rule.min;
    element.dataset.fitWrap = options.allowWrap ? "true" : "false";
    if (options.maxLines) element.dataset.fitMaxLines = options.maxLines;
    place(element, box);
    parent.append(element);
    return element;
  };

  const fitFixedText = (root) => {
    root.querySelectorAll("[data-fit-text]").forEach((element) => {
      const max = Number.parseFloat(element.dataset.fitMax || "16");
      const min = Number.parseFloat(element.dataset.fitMin || "8");
      const allowWrap = element.dataset.fitWrap === "true";
      const maxLines = Number.parseInt(element.dataset.fitMaxLines || "1", 10);
      let size = max;

      element.style.fontSize = px(size);
      element.style.lineHeight = element.style.lineHeight || "1.05";
      element.style.whiteSpace = allowWrap ? "normal" : "nowrap";
      element.style.overflow = "visible";

      const fits = () => {
        const computed = window.getComputedStyle(element);
        const lineHeight = Number.parseFloat(computed.lineHeight) || size * 1.05;
        const maxHeight = allowWrap ? lineHeight * maxLines + 1 : element.clientHeight + 1;
        return element.scrollWidth <= element.clientWidth + 1 && element.scrollHeight <= maxHeight + 1;
      };

      while (size > min && !fits()) {
        size -= 0.5;
        element.style.fontSize = px(size);
      }
    });
  };

  const createPage = (template, className = "fixed-print-page") => {
    const page = makeEl("section", className);
    page.style.width = px(points(template.pageSize.width));
    page.style.height = px(points(template.pageSize.height));
    return page;
  };

  const createBoundary = (box, className = "fixed-label-boundary") => {
    const label = makeEl("article", className);
    place(label, box);
    return label;
  };

  const getSlots = (template) => {
    const metrics = registry.getSheetMetrics(template);
    return Array.from({ length: metrics.capacity }, (_, index) => {
      const col = index % metrics.cols;
      const row = Math.floor(index / metrics.cols);
      return {
        x: metrics.marginX + col * (metrics.labelWidth + metrics.gapX),
        y: metrics.marginY + row * (metrics.labelHeight + metrics.gapY),
        width: metrics.labelWidth,
        height: metrics.labelHeight,
      };
    });
  };

  const appendField = (label, text, box, options = {}) => {
    const row = makeEl("div", "fixed-field-row");
    place(row, box);
    const labelText = makeEl("span", "", text);
    const line = makeEl("i");
    row.append(labelText, line);
    if (options.short) row.classList.add("is-short");
    label.append(row);
    return row;
  };

  const appendChecks = (label, checks, box) => {
    const row = makeEl("div", "fixed-check-row");
    place(row, box);
    checks.forEach((check) => {
      const item = makeEl("span");
      item.append(makeEl("i"), document.createTextNode(check));
      row.append(item);
    });
    label.append(row);
  };

  const appendWeekdays = (label, days, box) => {
    const row = makeEl("div", "fixed-weekday-row");
    place(row, box);
    days.forEach((day) => {
      const item = makeEl("span");
      item.append(makeEl("strong", "", day), makeEl("i"));
      row.append(item);
    });
    label.append(row);
  };

  const createFeedingLabel = ({ template, variant, childName, dob, photoUrl, includePhoto }) => {
    const label = createBoundary({ x: 0, y: 0, width: points(template.labelSize.width), height: points(template.labelSize.height) }, "fixed-label-boundary fixed-feeding-label");
    const safe = {
      x: points(template.safeZone.left),
      y: points(template.safeZone.top),
      width: points(template.labelSize.width - template.safeZone.left - template.safeZone.right),
      height: points(template.labelSize.height - template.safeZone.top - template.safeZone.bottom),
    };
    const isBreastMilk = variant === "breastmilk";
    const title = isBreastMilk ? "BREAST MILK" : "FORMULA";
    const titleColor = isBreastMilk ? RED : GREEN;
    const photo = includePhoto && photoUrl ? template.photoBox : null;
    const photoBox = photo ? {
      x: points(photo.x),
      y: points(photo.y),
      width: points(photo.width),
      height: points(photo.height),
    } : null;
    const headerWidth = photoBox ? Math.max(70, photoBox.x - safe.x - 6) : safe.width;
    const titleSize = template.id === "avery-61503-feeding" ? 11 : 9;
    const nameRule = photoBox && template.textRules.photoName ? template.textRules.photoName : template.textRules.name;
    const dobSize = template.textRules.dob.max;
    const fieldSize = template.textRules.fields.max;
    const row = template.id === "avery-61503-feeding"
      ? {
          titleY: safe.y + 5,
          nameY: safe.y + 20,
          dobY: safe.y + 50,
          fieldStart: safe.y + (isBreastMilk ? 60 : 61),
          rowGap: isBreastMilk ? 13 : 17,
          fieldHeight: isBreastMilk ? 13 : 15,
        }
      : {
          titleY: safe.y + 5,
          nameY: safe.y + 18,
          dobY: safe.y + 40,
          fieldStart: safe.y + 57,
          rowGap: isBreastMilk ? 16 : 18,
          fieldHeight: 12,
        };

    addSafeZone(label, safe);
    if (photoBox) addPhoto(label, photoBox, photoUrl);

    const titleEl = makeEl("p", "fixed-feeding-title", title);
    titleEl.style.color = titleColor;
    titleEl.style.fontSize = px(titleSize);
    place(titleEl, { x: safe.x, y: row.titleY, width: headerWidth, height: titleSize + 4 });
    label.append(titleEl);

    addFitText(label, "h4", "fixed-feeding-name", childName || "Child Name", {
      x: safe.x,
      y: row.nameY,
      width: headerWidth,
      height: template.id === "avery-61503-feeding" ? 30 : 18,
    }, nameRule);

    const dobEl = makeEl("small", "fixed-feeding-dob", dob || "DOB");
    dobEl.style.fontSize = px(dobSize);
    place(dobEl, { x: safe.x, y: row.dobY, width: headerWidth, height: dobSize + 6 });
    label.append(dobEl);

    const fieldLineWidth = photoBox ? Math.max(48, headerWidth - 4) : safe.width;
    appendField(label, "Ounces", { x: safe.x, y: row.fieldStart, width: fieldLineWidth, height: row.fieldHeight }, { short: Boolean(photoBox) });
    appendField(label, isBreastMilk ? "Date" : "Date/Week of", { x: safe.x, y: row.fieldStart + row.rowGap, width: fieldLineWidth, height: row.fieldHeight }, { short: Boolean(photoBox) });

    if (isBreastMilk) {
      appendChecks(label, ["Fresh", "Thawed"], { x: safe.x, y: row.fieldStart + row.rowGap * 2, width: fieldLineWidth, height: row.fieldHeight });
      appendField(label, "Date Pumped", { x: safe.x, y: row.fieldStart + row.rowGap * 3, width: safe.width, height: row.fieldHeight });
      appendField(label, "Date Thawed", { x: safe.x, y: row.fieldStart + row.rowGap * 4, width: safe.width, height: row.fieldHeight });
    } else {
      appendWeekdays(label, ["M", "T", "W", "TH", "F"], { x: safe.x, y: row.fieldStart + row.rowGap * 2, width: safe.width, height: template.id === "avery-61503-feeding" ? 24 : 20 });
    }

    label.style.setProperty("--fixed-field-size", px(fieldSize));
    return label;
  };

  const createFeedingSheet = ({ template, variant, childName, dob, photoUrl, includePhoto }) => {
    const page = createPage(template, "fixed-print-page fixed-feeding-page");
    const slots = getSlots(template);
    slots.forEach((slot) => {
      const label = createFeedingLabel({ template, variant, childName, dob, photoUrl, includePhoto });
      place(label, slot);
      page.append(label);
    });
    return page;
  };

  const createCommunityLabel = ({ template, childName, photoUrl, includePhoto = true }) => {
    const page = createPage(template, "fixed-print-page fixed-community-page");
    const labelWidth = points(template.labelSize.width);
    const labelHeight = points(template.labelSize.height);
    const pageWidth = points(template.pageSize.width);
    const pageHeight = points(template.pageSize.height);
    const label = createBoundary({
      x: template.id === "community-basket-label" ? 0 : Math.max(points(template.margins.left), (pageWidth - labelWidth) / 2),
      y: template.id === "community-basket-label" ? 0 : Math.max(points(template.margins.top), (pageHeight - labelHeight) / 2),
      width: points(template.labelSize.width),
      height: points(template.labelSize.height),
    }, `fixed-label-boundary fixed-community-label ${template.cutGuide || ""}`);
    const safe = {
      x: points(template.safeZone.left),
      y: points(template.safeZone.top),
      width: points(template.labelSize.width - template.safeZone.left - template.safeZone.right),
      height: points(template.labelSize.height - template.safeZone.top - template.safeZone.bottom),
    };

    addSafeZone(label, safe);

    if (template.cutGuide === "community-arch") {
      const photo = template.photoBox;
      const photoBox = { x: points(photo.x), y: points(photo.y), width: points(photo.width), height: points(photo.height) };
      if (includePhoto) addPhoto(label, photoBox, photoUrl);
      const gap = includePhoto ? 14 : 0;
      const textX = includePhoto ? photoBox.x + photoBox.width + gap : safe.x;
      const textWidth = safe.x + safe.width - textX;
      addFitText(label, "strong", "fixed-community-name", childName || "Child Name", {
        x: textX,
        y: safe.y + safe.height * 0.18,
        width: textWidth,
        height: safe.height * 0.62,
      }, template.textRules.name, { allowWrap: true, maxLines: 2 });
    } else if (template.cutGuide === "community-oval") {
      const photo = template.photoBox;
      addPhoto(label, { x: points(photo.x), y: points(photo.y), width: points(photo.width), height: points(photo.height) }, photoUrl);
      addFitText(label, "strong", "fixed-community-name", childName || "Child Name", {
        x: safe.x,
        y: safe.y + 8,
        width: safe.width,
        height: safe.height * 0.34,
      }, template.textRules.name, { allowWrap: true, maxLines: 2 });
    } else {
      const photo = template.photoBox;
      const photoBox = { x: points(photo.x), y: points(photo.y), width: points(photo.width), height: points(photo.height) };
      addPhoto(label, photoBox, photoUrl);
      addFitText(label, "strong", "fixed-community-name fixed-basket-name", childName || "Child Name", {
        x: photoBox.x + photoBox.width + 18,
        y: safe.y,
        width: safe.width - photoBox.width - 26,
        height: safe.height,
      }, template.textRules.name);
    }

    page.append(label);
    return page;
  };

  const createClassroomSheet = ({ template, labels, childName, classroom, photoUrl, showBlankSlots = true }) => {
    const page = createPage(template, "fixed-print-page fixed-classroom-page");
    const slots = getSlots(template);
    const items = showBlankSlots ? renderer.fillToCapacity(labels, slots.length) : labels;
    items.forEach((labelTitle, index) => {
      if (!labelTitle && !showBlankSlots) return;
      const slot = slots[index];
      const label = createBoundary(slot, `fixed-label-boundary fixed-classroom-label ${labelTitle ? "" : "is-empty"}`);
      if (labelTitle) {
        const safe = {
          x: points(template.safeZone.left),
          y: points(template.safeZone.top),
          width: slot.width - points(template.safeZone.left + template.safeZone.right),
          height: slot.height - points(template.safeZone.top + template.safeZone.bottom),
        };
        addSafeZone(label, safe);
        if (template.photoBox) addPhoto(label, {
          x: points(template.photoBox.x),
          y: points(template.photoBox.y),
          width: points(template.photoBox.width),
          height: points(template.photoBox.height),
        }, photoUrl);
        const isHorizontal = template.textRules.layout === "horizontal";
        const textX = isHorizontal && template.photoBox ? points(template.photoBox.x + template.photoBox.width) + 10 : safe.x;
        const textWidth = safe.x + safe.width - textX;
        addFitText(label, "p", "fixed-classroom-title", labelTitle, { x: textX, y: safe.y + 2, width: textWidth, height: 16 }, template.textRules.title);
        addFitText(label, "h4", "fixed-classroom-name", childName || "Child Name", { x: textX, y: isHorizontal ? safe.y + 30 : safe.y + safe.height * 0.56, width: textWidth, height: 34 }, template.textRules.name);
        if (classroom) addFitText(label, "small", "fixed-classroom-room", classroom, { x: textX, y: isHorizontal ? safe.y + 66 : safe.y + safe.height * 0.78, width: textWidth, height: 18 }, template.textRules.classroom);
      }
      page.append(label);
    });
    return page;
  };

  window.CareCheckFixedPrintRenderer = {
    createClassroomSheet,
    createCommunityLabel,
    createFeedingSheet,
    debugEnabled,
    fitFixedText,
  };
})();
