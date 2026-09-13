export function getActiveSection(sections, focusLine) {
  const containing = sections.find(({ top, bottom }) => top <= focusLine && bottom > focusLine);
  if (containing) return containing.id;

  return sections.reduce((closest, section) => {
    const distance = Math.abs(section.top - focusLine);
    return distance < closest.distance ? { id: section.id, distance } : closest;
  }, { id: sections.at(-1)?.id ?? null, distance: Infinity }).id;
}

export function cycleIndex(index, direction, length) {
  if (length < 1) return 0;
  return (index + direction % length + length) % length;
}

export function getCenteredIndex(cards, viewportCenter) {
  if (!cards.length) return 0;
  return cards.reduce((closest, card, index) => {
    const distance = Math.abs((card.left + card.right) / 2 - viewportCenter);
    return distance < closest.distance ? { index, distance } : closest;
  }, { index: 0, distance: Infinity }).index;
}

export function getTimelineCardStates(length, activeIndex) {
  return Array.from({ length }, (_, index) => ({
    index,
    distance: index - activeIndex,
    isCurrent: index === activeIndex,
  }));
}

export function getInitialTimelineScroll() {
  return false;
}

export function createPetalDescriptors(count) {
  if (count < 1) return [];

  const depths = ['far', 'middle', 'near'];
  return Array.from({ length: count }, (_, index) => ({
    size: 7 + (index * 7) % 12,
    duration: 14 + (index * 5) % 13,
    delay: -((index * 11) % 27),
    left: (index * 37 + 9) % 101,
    drift: -140 + (index * 53) % 281,
    depth: depths[index % depths.length],
    rotation: (index * 47) % 360,
  }));
}

export function getResumeState(resume) {
  if (!resume?.available) return { available: false, href: null, fileName: null, label: '简历 PDF 暂未提供' };
  return { available: true, href: resume.path, fileName: resume.fileName || 'resume.pdf', label: 'PDF 简历' };
}

export function getHistoryCommand(previous, next) {
  if (!previous && next) return 'push';
  if (previous && next) return 'replace';
  if (previous && !next) return 'back';
  return 'none';
}

export function modalState(current, action) {
  if (action.type === 'open') return action.payload;
  if (action.type === 'close') return null;
  return current;
}
