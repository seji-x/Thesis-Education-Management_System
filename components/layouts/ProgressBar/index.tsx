'use client'
import React from 'react'
import { Next13ProgressBar } from 'next13-progressbar'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Next13ProgressBar showOnShallow color="#003a70" height="3px" options={{ showSpinner: false }} />
    </>
  )
}

export default Providers
