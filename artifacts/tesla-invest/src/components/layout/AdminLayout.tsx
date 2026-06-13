import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { Topbar } from './Topbar'

export function AdminLayout() {
  return (
    <div className="flex bg-navy-base min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 py-8 px-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
