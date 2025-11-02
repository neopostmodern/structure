import { Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import Gap from '../../components/Gap'
import { SkeletonNoteList } from './Skeletons'

const ShowMore = ({
  onIsInView,
  remainingCount,
}: {
  onIsInView: () => void
  remainingCount: number
}) => {
  const { ref: showMoreElement, inView } = useInView({
    rootMargin: '0% 0% 20% 0%', // triggers 20vh below viewport
  })
  const firstRenderTimestamp = useMemo(() => {
    return Date.now()
  }, [])
  const heuristicFirstContentfulPaintComplete =
    Date.now() - firstRenderTimestamp > 1000
  useEffect(() => {
    // this ensures the first full render finished
    if (heuristicFirstContentfulPaintComplete && inView) {
      onIsInView()
    }
  }, [inView, onIsInView, heuristicFirstContentfulPaintComplete])

  return (
    <div ref={showMoreElement}>
      <SkeletonNoteList />
      <Gap vertical={2} />
      <Typography
        variant='caption'
        color='gray'
        textAlign='center'
        component='div'
      >
        {remainingCount} more notes loading...
      </Typography>
    </div>
  )
}

export default ShowMore
