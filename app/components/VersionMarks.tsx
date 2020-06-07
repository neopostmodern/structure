import React from 'react'

import config from '../config'
import styles from './Layout.scss'

interface VersionMarksProps {
  versions:
    | 'loading'
    | {
        minimum: number
        recommended?: number
      }
}

const VersionMarks: React.FC<VersionMarksProps> = ({ versions }) => {
  if (versions === 'loading') {
    return <i>Checking for new versions...</i>
  }

  const { minimum, recommended } = versions

  if (minimum > config.apiVersion) {
    return (
      <div className={`${styles.version} ${styles.warning}`}>
        <div className={styles.headline}>Your Structure is obsolete.</div>
        <small>
          This Structure uses API version {config.apiVersion}, but {minimum} is
          required on the server.
          <br />
          Functionality is no longer guaranteed, use at your own risk or{' '}
          <a href={config.releaseUrl} target='_blank' rel='noopener noreferrer'>
            update now
          </a>
          .
        </small>
      </div>
    )
  }

  if (recommended > config.apiVersion) {
    return (
      <div className={`${styles.version} ${styles.notice}`}>
        <div className={styles.headline}>Your Structure is outdated.</div>
        <small>
          This Structure uses API version {config.apiVersion}, but {recommended}{' '}
          is recommended by the server.
          <br />
          You are probably safe for now but try to{' '}
          <a href={config.releaseUrl} target='_blank' rel='noopener noreferrer'>
            update soon
          </a>
          .
        </small>
      </div>
    )
  }

  return null
}

export default VersionMarks
