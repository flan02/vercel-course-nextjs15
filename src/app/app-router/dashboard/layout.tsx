import SideNav from '@/components/ui/dashboard/sidenav';

// ? PARTIAL PRERENDERING (PPR)
// export const experimental_ppr = true;

/* 
As long as you're using Suspense to wrap the dynamic parts of your route, Next.js will know which parts of your route are static and which are dynamic.
*/


// * This is a server component
// $ Static Rendering (SSR) is the default behavior in Next.js
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  )
}