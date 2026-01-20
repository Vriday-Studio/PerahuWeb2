'use client'

import React from 'react'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
