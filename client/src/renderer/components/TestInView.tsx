import { useMemo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const TestInView = ({ onIsInView }) => {
  const { ref: showMoreElement, inView } = useInView({
    rootMargin: '0% 0% 20% 0%', // triggers 20vh below viewport
  });
  const firstRenderTimestamp = useMemo(() => {
    return Date.now();
  }, []);
  const heuristicFirstContentfulPaintComplete =
    Date.now() - firstRenderTimestamp > 1000;
  useEffect(() => {
    // todo: wait until first full render finished
    if (heuristicFirstContentfulPaintComplete && inView) {
      onIsInView();
    }
  }, [inView, onIsInView, heuristicFirstContentfulPaintComplete]);

  console.log(
    'in view',
    inView,
    'heuristic complete',
    heuristicFirstContentfulPaintComplete,
  );

  return <div ref={showMoreElement}>more...</div>;
};

export default TestInView;
