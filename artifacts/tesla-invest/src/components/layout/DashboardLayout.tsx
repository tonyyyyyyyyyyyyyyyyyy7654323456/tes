import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function DashboardLayout() {
  return (
    <div className="flex bg-navy-base min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 py-8 px-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
