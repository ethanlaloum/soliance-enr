import { useEffect, useState } from 'react';

const spyRootMargin = '-30% 0px -60% 0px';

export const useActiveSection = <Id extends string>(sectionIds: readonly Id[]): Id => {
  const [activeId, setActiveId] = useState<Id>(sectionIds[0]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const intersecting = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        });
        const current = sectionIds.find((id) => intersecting.has(id));
        if (current) setActiveId(current);
      },
      { rootMargin: spyRootMargin },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
};
