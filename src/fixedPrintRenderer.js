(function () {
  const registry = window.CareCheckLabelRegistry;
  const renderer = window.CareCheckPrintRenderer;
  const PT = registry.INCH_TO_PT;
  const GREEN = "#0B7A34";
  const RED = "#C62828";
  const CLASSROOM_RENDERER_VERSION = "classroom-pdf-20260625-43";

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

  const addCommunityArchGuide = (label) => {
    const guide = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    guide.setAttribute("class", "fixed-community-arch-guide");
    guide.setAttribute("viewBox", "0 0 1000 205");
    guide.setAttribute("preserveAspectRatio", "none");
    path.setAttribute("d", "M16 1 H984 Q999 1 999 18 V185 Q999 203 982 199 Q500 70 18 199 Q1 203 1 185 V18 Q1 1 16 1 Z");
    guide.append(path);
    label.prepend(guide);
  };

  const addFitText = (parent, tag, className, text, box, rule, options = {}) => {
    const element = makeEl(tag, className, text);
    element.dataset.fitText = "";
    element.dataset.fitMax = rule.max;
    element.dataset.fitMin = rule.min;
    element.dataset.fitWrap = options.allowWrap ? "true" : "false";
    element.dataset.fitPreferSingleLine = options.preferSingleLine ? "true" : "false";
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
      const preferSingleLine = element.dataset.fitPreferSingleLine === "true";
      const maxLines = Number.parseInt(element.dataset.fitMaxLines || "1", 10);
      let size = max;

      element.style.fontSize = px(size);
      element.style.lineHeight = element.style.lineHeight || "1.05";
      element.style.whiteSpace = allowWrap ? "normal" : "nowrap";
      element.style.overflow = "visible";

      const fits = (singleLine = !allowWrap) => {
        const computed = window.getComputedStyle(element);
        const lineHeight = Number.parseFloat(computed.lineHeight) || size * 1.05;
        const maxHeight = singleLine ? element.clientHeight + 1 : lineHeight * maxLines + 1;
        return element.scrollWidth <= element.clientWidth + 1 && element.scrollHeight <= maxHeight + 1;
      };

      if (allowWrap && preferSingleLine) {
        element.style.whiteSpace = "nowrap";
        while (size > min && !fits(true)) {
          size -= 0.5;
          element.style.fontSize = px(size);
        }
        if (fits(true)) return;
        element.style.whiteSpace = "normal";
      }

      while (size > min && !fits()) {
        size -= 0.5;
        element.style.fontSize = px(size);
      }
    });
  };

  const fitTextToWidth = (text, maxWidth, maxFontSize, minFontSize, fontWeight = 700) => ({
    text,
    maxWidth,
    maxFontSize,
    minFontSize,
    fontWeight,
  });

  const calculateTextAreaWidth = (safe, photoBox, gap = 6) => (photoBox
    ? Math.max(54, photoBox.x - safe.x - gap)
    : safe.width);

  const renderNameSingleLine = (parent, text, box, rule) => addFitText(
    parent,
    "h4",
    "fixed-feeding-name",
    text || "Child Name",
    box,
    rule,
  );

  const renderOptionalClassroom = (parent, classroom, box, rule) => {
    if (!classroom) return null;
    return addFitText(parent, "small", "fixed-classroom-room", classroom, box, rule);
  };

  const getClassroomNoPhotoLayout = (template, safe, hasClassroom) => {
    if (template.id === "avery-94256-classroom") {
      const nameHeight = 74;
      const roomHeight = hasClassroom ? 28 : 0;
      const titleHeight = 30;
      const gap = 10;
      const totalHeight = nameHeight + titleHeight + roomHeight + gap * (hasClassroom ? 2 : 1);
      const startY = safe.y + Math.max(0, (safe.height - totalHeight) / 2);

      return {
        name: { x: safe.x, y: startY, width: safe.width, height: nameHeight },
        classroom: {
          x: safe.x,
          y: startY + nameHeight + gap,
          width: safe.width,
          height: roomHeight,
        },
        title: {
          x: safe.x,
          y: startY + nameHeight + gap + roomHeight + (hasClassroom ? gap : 0),
          width: safe.width,
          height: titleHeight,
        },
      };
    }

    const titleHeight = Math.min(template.id === "avery-94207-classroom" ? 18 : template.id === "avery-94256-classroom" ? 28 : 24, safe.height * 0.18);
    const roomHeight = hasClassroom ? Math.min(template.id === "avery-94207-classroom" ? 18 : template.id === "avery-94256-classroom" ? 28 : 22, safe.height * 0.16) : 0;
    const gap = template.id === "avery-94207-classroom"
      ? 3
      : Math.max(5, Math.min(12, safe.height * 0.055));
    const nameHeight = template.id === "avery-94256-classroom"
      ? Math.min(safe.height * 0.24, 58)
      : template.id === "avery-94207-classroom"
        ? Math.min(safe.height * 0.28, 36)
      : Math.min(safe.height * (hasClassroom ? 0.34 : 0.44), Math.max(34, safe.height - titleHeight - roomHeight - gap * 2));
    const totalHeight = titleHeight + nameHeight + roomHeight + gap * (hasClassroom ? 2 : 1);
    const startY = safe.y + Math.max(0, (safe.height - totalHeight) / 2);

    if (template.id === "avery-94207-classroom") {
      const centerY = safe.y + safe.height / 2;
      const nameY = centerY - nameHeight / 2 - 18;
      const titleY = Math.max(safe.y, nameY - titleHeight - 3);
      const classroomY = Math.min(safe.y + safe.height - roomHeight, nameY + nameHeight + 12);
      return {
        title: { x: safe.x, y: titleY, width: safe.width, height: titleHeight },
        name: { x: safe.x, y: nameY, width: safe.width, height: nameHeight },
        classroom: {
          x: safe.x,
          y: classroomY,
          width: safe.width,
          height: roomHeight,
        },
      };
    }

    return {
      name: { x: safe.x, y: startY, width: safe.width, height: nameHeight },
      classroom: {
        x: safe.x,
        y: startY + nameHeight + gap,
        width: safe.width,
        height: roomHeight,
      },
      title: {
        x: safe.x,
        y: startY + nameHeight + gap + roomHeight + (hasClassroom ? gap : 0),
        width: safe.width,
        height: titleHeight,
      },
    };
  };

  const getNoPhotoNameRule = (template) => {
    const rule = template.textRules.name;

    if (template.id === "avery-94256-classroom") {
      return { ...rule, max: 46, min: Math.max(rule.min, 16), lineHeight: 1.02 };
    }

    if (template.id === "avery-6874-classroom") {
      return { ...rule, max: 30, min: Math.max(rule.min, 12) };
    }

    if (template.id === "avery-94207-classroom") {
      return { ...rule, max: 28, min: 7, wrap: false };
    }

    return {
      ...rule,
      max: rule.max * 1.45,
      min: Math.max(rule.min, 9),
    };
  };

  const getClassroomPhotoStackLayout = (template, safe, photoBox, hasClassroom) => {
    const isLarge = template.id === "avery-94256-classroom";
    const nameHeight = isLarge ? 40 : 34;
    const roomHeight = hasClassroom ? (isLarge ? 22 : 18) : 0;
    const titleHeight = isLarge ? 24 : 20;
    const gap = isLarge ? 6 : 5;
    const totalHeight = photoBox.height + nameHeight + roomHeight + titleHeight + gap * (hasClassroom ? 3 : 2);
    const startY = safe.y + Math.max(0, (safe.height - totalHeight) / 2);
    const photoX = safe.x + (safe.width - photoBox.width) / 2;
    const nameY = startY + photoBox.height + gap;

    return {
      photo: { x: photoX, y: startY, width: photoBox.width, height: photoBox.height },
      name: { x: safe.x, y: nameY, width: safe.width, height: nameHeight },
      classroom: {
        x: safe.x,
        y: nameY + nameHeight + gap,
        width: safe.width,
        height: roomHeight,
      },
      title: {
        x: safe.x,
        y: nameY + nameHeight + gap + roomHeight + (hasClassroom ? gap : 0),
        width: safe.width,
        height: titleHeight,
      },
    };
  };

  const getPhotoModeLayout = (template, isBreastMilk, hasPhoto, safe, photoBox) => {
    if (template.id === "avery-61503-feeding") {
      return {
        titleY: safe.y + 5,
        nameY: safe.y + 20,
        nameHeight: 30,
        dobY: safe.y + 56,
        fieldStart: safe.y + (isBreastMilk ? 67 : 72),
        rowGap: isBreastMilk ? 12.2 : 14.4,
        fieldHeight: isBreastMilk ? 11.5 : 12.5,
        titleSize: 11,
        photoBox,
        fieldLineWidth: hasPhoto ? calculateTextAreaWidth(safe, photoBox, 16) : safe.width,
      };
    }

    if (hasPhoto) {
      return {
        titleY: safe.y + 4,
        nameY: safe.y + 18,
        nameHeight: 16,
        dobY: safe.y + 37,
        fieldStart: safe.y + 58,
        rowGap: isBreastMilk ? 15 : 17,
        fieldHeight: 12,
        titleSize: 9,
        photoBox,
        fieldLineWidth: calculateTextAreaWidth(safe, photoBox),
      };
    }

    return {
      titleY: safe.y + 5,
      nameY: safe.y + 18,
      nameHeight: 22,
      dobY: safe.y + 43,
      fieldStart: safe.y + 60,
      rowGap: isBreastMilk ? 15 : 17,
      fieldHeight: 12,
      titleSize: 9,
      photoBox: null,
      fieldLineWidth: safe.width,
    };
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
    const layout = getPhotoModeLayout(template, isBreastMilk, Boolean(photoBox), safe, photoBox);
    const headerWidth = calculateTextAreaWidth(safe, photoBox);
    const titleSize = layout.titleSize;
    const nameRule = photoBox && template.textRules.photoName ? template.textRules.photoName : template.textRules.name;
    const feedingNameRule = template.id === "avery-61503-feeding" && isBreastMilk
      ? { ...nameRule, max: 30, min: Math.max(nameRule.min, 8) }
      : nameRule;
    const dobSize = template.textRules.dob.max;
    const fieldSize = template.textRules.fields.max;

    addSafeZone(label, safe);
    if (photoBox) addPhoto(label, photoBox, photoUrl);

    const titleEl = makeEl("p", "fixed-feeding-title", title);
    titleEl.style.color = titleColor;
    titleEl.style.fontSize = px(titleSize);
    place(titleEl, { x: safe.x, y: layout.titleY, width: headerWidth, height: titleSize + 4 });
    label.append(titleEl);

    renderNameSingleLine(label, childName || "Child Name", {
      x: safe.x,
      y: layout.nameY,
      width: headerWidth,
      height: layout.nameHeight,
    }, feedingNameRule);

    const dobEl = makeEl("small", "fixed-feeding-dob", dob || "DOB");
    dobEl.style.fontSize = px(dobSize);
    place(dobEl, { x: safe.x, y: layout.dobY, width: headerWidth, height: dobSize + 6 });
    label.append(dobEl);

    const fieldLineWidth = layout.fieldLineWidth;
    appendField(label, "Ounces", { x: safe.x, y: layout.fieldStart, width: fieldLineWidth, height: layout.fieldHeight }, { short: Boolean(photoBox) });
    appendField(label, isBreastMilk ? "Date" : "Date/Week of", { x: safe.x, y: layout.fieldStart + layout.rowGap, width: fieldLineWidth, height: layout.fieldHeight }, { short: Boolean(photoBox) });

    if (isBreastMilk) {
      appendChecks(label, ["Fresh", "Thawed"], { x: safe.x, y: layout.fieldStart + layout.rowGap * 2, width: fieldLineWidth, height: layout.fieldHeight });
      appendField(label, "Date Pumped", { x: safe.x, y: layout.fieldStart + layout.rowGap * 3, width: safe.width, height: layout.fieldHeight });
      appendField(label, "Date Thawed", { x: safe.x, y: layout.fieldStart + layout.rowGap * 4, width: safe.width, height: layout.fieldHeight });
    } else {
      appendWeekdays(label, ["M", "T", "W", "TH", "F"], { x: safe.x, y: layout.fieldStart + layout.rowGap * 2, width: safe.width, height: template.id === "avery-61503-feeding" ? 24 : 20 });
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

  const createCommunityLabel = ({ template, childName, photoUrl, includePhoto = true, cropToLabel = false }) => {
    const page = createPage(template, "fixed-print-page fixed-community-page");
    const labelWidth = points(template.labelSize.width);
    const labelHeight = points(template.labelSize.height);
    const pageWidth = points(template.pageSize.width);
    const pageHeight = points(template.pageSize.height);
    if (cropToLabel) {
      page.style.width = px(labelWidth);
      page.style.height = px(labelHeight);
    }
    const label = createBoundary({
      x: cropToLabel || template.id === "community-basket-label" ? 0 : Math.max(points(template.margins.left), (pageWidth - labelWidth) / 2),
      y: cropToLabel || template.id === "community-basket-label" ? 0 : Math.max(points(template.margins.top), (pageHeight - labelHeight) / 2),
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
      addCommunityArchGuide(label);
      const photo = template.photoBox;
      const photoBox = { x: points(photo.x), y: points(photo.y), width: points(photo.width), height: points(photo.height) };
      if (includePhoto) addPhoto(label, photoBox, photoUrl);
      const isCompact = template.id === "community-compact-cubby";
      const textInset = points(isCompact ? 1.16 : 1.62);
      const textHeight = isCompact ? points(0.7) : points(0.86);
      const textY = points(template.safeZone.top) + points(isCompact ? 0.05 : 0.06);
      addFitText(label, "strong", "fixed-community-name", childName || "Child Name", {
        x: textInset,
        y: textY,
        width: labelWidth - textInset * 2,
        height: textHeight,
      }, template.textRules.name, { allowWrap: false, maxLines: 1 });
    } else if (template.cutGuide === "community-oval") {
      const photo = template.photoBox;
      addPhoto(label, { x: points(photo.x), y: points(photo.y), width: points(photo.width), height: points(photo.height) }, photoUrl);
      addFitText(label, "strong", "fixed-community-name", childName || "Child Name", {
        x: points(0.66),
        y: points(4.46),
        width: labelWidth - points(1.32),
        height: points(0.9),
      }, template.textRules.name, { allowWrap: true, maxLines: 2, preferSingleLine: true });
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
        const hasPhoto = Boolean(photoUrl && template.photoBox);
        label.classList.add(template.id, hasPhoto ? "has-photo" : "has-no-photo");
        addSafeZone(label, safe);
        const renderedPhotoBox = hasPhoto ? {
          x: points(template.photoBox.x),
          y: points(template.photoBox.y),
          width: points(template.photoBox.width),
          height: points(template.photoBox.height),
        } : null;
        const isHorizontal = template.textRules.layout === "horizontal";
        const hasClassroom = Boolean(classroom);
        if (!hasPhoto) {
          const noPhotoLayout = getClassroomNoPhotoLayout(template, safe, hasClassroom);
          const titleRule = template.id === "avery-94256-classroom"
            ? { ...template.textRules.title, max: 20, min: 9 }
            : template.textRules.title;
          const classroomRule = template.id === "avery-94256-classroom"
            ? { ...template.textRules.classroom, max: 18, min: 8 }
            : template.textRules.classroom;

          addFitText(label, "p", "fixed-classroom-title", labelTitle, noPhotoLayout.title, titleRule);
          addFitText(label, "h4", "fixed-classroom-name", childName || "Child Name", noPhotoLayout.name, getNoPhotoNameRule(template), {
            allowWrap: template.id !== "avery-94207-classroom",
            maxLines: 2,
          });
          renderOptionalClassroom(label, classroom, noPhotoLayout.classroom, classroomRule);
        } else {
          if (template.id === "avery-94207-classroom") {
            addPhoto(label, renderedPhotoBox, photoUrl);
            const textX = renderedPhotoBox.x + renderedPhotoBox.width + 14;
            const textWidth = safe.x + safe.width - textX;
            const titleHeight = 17;
            const nameHeight = 32;
            const roomHeight = 18;
            const gap = 2;
            const totalHeight = titleHeight + nameHeight + roomHeight + gap * 2;
            const groupY = safe.y + Math.max(0, (safe.height - totalHeight) / 2);

            addFitText(label, "p", "fixed-classroom-title", labelTitle, {
              x: textX,
              y: groupY,
              width: textWidth,
              height: titleHeight,
            }, { ...template.textRules.title, max: 12.5 });
            addFitText(label, "h4", "fixed-classroom-name", childName || "Child Name", {
              x: textX,
              y: groupY + titleHeight + gap,
              width: textWidth,
              height: nameHeight,
            }, { ...template.textRules.name, max: 22, min: 7 }, { allowWrap: false });
            renderOptionalClassroom(label, classroom, {
              x: textX,
              y: groupY + titleHeight + gap + nameHeight + gap,
              width: textWidth,
              height: roomHeight,
            }, { ...template.textRules.classroom, max: 13 });
            page.append(label);
            return;
          }

          if (template.id === "avery-6874-classroom") {
            const layout = getClassroomPhotoStackLayout(template, safe, renderedPhotoBox, hasClassroom);
            addPhoto(label, layout.photo, photoUrl);
            addFitText(label, "h4", "fixed-classroom-name", childName || "Child Name", {
              ...layout.name,
            }, { ...template.textRules.name, max: 28, min: 10 }, { allowWrap: false });
            renderOptionalClassroom(label, classroom, layout.classroom, { ...template.textRules.classroom, max: 14 });
            addFitText(label, "p", "fixed-classroom-title", labelTitle, layout.title, { ...template.textRules.title, max: 16 });
            page.append(label);
            return;
          }

          if (template.id === "avery-94256-classroom") {
            const layout = getClassroomPhotoStackLayout(template, safe, renderedPhotoBox, hasClassroom);
            addPhoto(label, layout.photo, photoUrl);
            addFitText(label, "h4", "fixed-classroom-name", childName || "Child Name", {
              ...layout.name,
            }, { ...template.textRules.name, max: 34, min: 11 }, { allowWrap: false });
            renderOptionalClassroom(label, classroom, layout.classroom, { ...template.textRules.classroom, max: 16 });
            addFitText(label, "p", "fixed-classroom-title", labelTitle, layout.title, { ...template.textRules.title, max: 18 });
            page.append(label);
            return;
          }

          if (renderedPhotoBox) addPhoto(label, renderedPhotoBox, photoUrl);
          const textX = isHorizontal && template.photoBox ? points(template.photoBox.x + template.photoBox.width) + 14 : safe.x;
          const textWidth = safe.x + safe.width - textX;
          const photoTitleHeight = template.id === "avery-94207-classroom" ? 18 : 16;
          const photoNameHeight = template.id === "avery-94207-classroom" ? 44 : 34;
          const photoRoomHeight = template.id === "avery-94207-classroom" ? 20 : 18;
          const photoGap = template.id === "avery-94207-classroom" ? 4 : 0;
          const groupHeight = photoTitleHeight + photoNameHeight + (hasClassroom ? photoRoomHeight : 0) + photoGap * (hasClassroom ? 2 : 1);
          const groupY = template.id === "avery-94207-classroom"
            ? safe.y + Math.max(0, (safe.height - groupHeight) / 2)
            : safe.y + 2;
          addFitText(label, "p", "fixed-classroom-title", labelTitle, { x: textX, y: groupY, width: textWidth, height: photoTitleHeight }, template.textRules.title);
          addFitText(label, "h4", "fixed-classroom-name", childName || "Child Name", {
            x: textX,
            y: isHorizontal
              ? groupY + photoTitleHeight + photoGap
              : safe.y + safe.height * (hasClassroom ? 0.56 : 0.65),
            width: textWidth,
            height: photoNameHeight,
          }, template.textRules.name);
          renderOptionalClassroom(label, classroom, {
            x: textX,
            y: isHorizontal ? groupY + photoTitleHeight + photoGap + photoNameHeight + photoGap : safe.y + safe.height * 0.78,
            width: textWidth,
            height: photoRoomHeight,
          }, template.textRules.classroom);
        }
      }
      page.append(label);
    });
    return page;
  };

  window.CareCheckFixedPrintRenderer = {
    classroomRendererVersion: CLASSROOM_RENDERER_VERSION,
    createClassroomSheet,
    createCommunityLabel,
    createFeedingSheet,
    debugEnabled,
    fitFixedText,
  };
})();
