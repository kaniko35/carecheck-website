(function () {
  const registry = window.CareCheckLabelRegistry;

  const chunkItems = (items, capacity) => {
    const chunks = [];

    for (let index = 0; index < items.length; index += capacity) {
      chunks.push(items.slice(index, index + capacity));
    }

    return chunks.length ? chunks : [items];
  };

  const fillToCapacity = (items, capacity) => {
    return Array.from({ length: capacity }, (_, index) => items[index] || null);
  };

  const createSheetPage = ({ template, items, renderItem, renderBlank, pageClass, dataAttribute = "data-print-sheet" }) => {
    const page = document.createElement("div");
    const capacity = template.capacity || template.rows * template.columns;

    page.className = pageClass || template.css?.pageClass || template.css?.className || "carecheck-render-page";
    page.setAttribute(dataAttribute, "");

    fillToCapacity(items, capacity).forEach((item) => {
      page.append(item ? renderItem(item, template) : renderBlank?.(template) || document.createElement("div"));
    });

    return page;
  };

  const createSheetPages = ({ template, items, renderItem, renderBlank, fillMode = "selected-only", pageClass, dataAttribute }) => {
    const capacity = template.capacity || template.rows * template.columns;
    const sourceItems = fillMode === "repeat-to-fill" && items.length === 1
      ? Array.from({ length: capacity }, () => items[0])
      : items;

    return chunkItems(sourceItems, capacity).map((chunk) => createSheetPage({
      template,
      items: chunk,
      renderItem,
      renderBlank,
      pageClass,
      dataAttribute,
    }));
  };

  const getTemplate = (idOrAlias) => registry.get(idOrAlias);

  const fitText = (element, maxSize, minSize, options = {}) => {
    if (!element) {
      return;
    }

    let fontSize = maxSize;
    element.style.fontSize = `${fontSize}px`;
    element.style.whiteSpace = options.allowWrap ? "normal" : "nowrap";
    element.style.overflowWrap = options.allowWrap ? "normal" : "";
    element.style.wordBreak = options.allowWrap ? "normal" : "";

    if (element.parentElement?.clientWidth) {
      const elementStyle = window.getComputedStyle(element);
      const previousPhoto = !options.allowWrap
        && elementStyle.position !== "absolute"
        && element.previousElementSibling?.classList?.contains("community-pdf-photo")
        ? element.previousElementSibling
        : null;
      const parentStyle = window.getComputedStyle(element.parentElement);
      const gap = Number.parseFloat(parentStyle.columnGap || parentStyle.gap || "0") || 0;
      const availableWidth = previousPhoto
        ? element.parentElement.clientWidth - previousPhoto.clientWidth - gap - 8
        : element.parentElement.clientWidth;

      element.style.width = `${Math.max(1, availableWidth)}px`;
    }

    const fits = () => {
      const parent = element.parentElement;
      const availableWidth = Math.max(1, element.clientWidth || parent?.clientWidth || 1);
      const shouldCheckHeight = Boolean(element.closest(".community-pdf-render-root") || options.checkHeight);
      let availableHeight = Math.max(1, element.clientHeight || 1);

      if (parent?.clientHeight) {
        const siblingsHeight = Array.from(parent.children)
          .filter((child) => child !== element && !child.hidden)
          .reduce((sum, child) => sum + child.scrollHeight, 0);
        const parentStyle = window.getComputedStyle(parent);
        const rowGap = Number.parseFloat(parentStyle.rowGap || parentStyle.gap || "0") || 0;
        const visibleSiblingCount = Array.from(parent.children)
          .filter((child) => child !== element && !child.hidden).length;
        const reservedGap = visibleSiblingCount ? rowGap * visibleSiblingCount : 0;

        availableHeight = Math.max(1, parent.clientHeight - siblingsHeight - reservedGap);
      }

      const maxHeight = options.maxHeight || availableHeight;
      return element.scrollWidth <= availableWidth && (!shouldCheckHeight || element.scrollHeight <= maxHeight);
    };

    while (fontSize > minSize && !fits()) {
      fontSize -= 0.5;
      element.style.fontSize = `${fontSize}px`;
    }
  };

  window.CareCheckPrintRenderer = {
    chunkItems,
    createSheetPage,
    createSheetPages,
    fitText,
    fillToCapacity,
    getTemplate,
  };
})();
