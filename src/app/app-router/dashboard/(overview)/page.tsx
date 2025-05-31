import { Card } from '@/components/ui/dashboard/cards';
import RevenueChart from '@/components/ui/dashboard/revenue-chart';
import LatestInvoices from '@/components/ui/dashboard/latest-invoices';
import { fetchCardData, fetchLatestInvoices, fetchRevenue } from '../actions';

// * This is a server component

// $ Static Rendering (SSR) is the default behavior in Next.js.
// - It means that the page is generated on the server at request time.
// - This is useful for pages that need to be up-to-date with the latest data, such as a dashboard.

// $ Dynamic Rendering (CSR) is when the page is generated on the client side.
// - It is useful for pages that don't need to be up-to-date with the latest data, such as a blog post.
// - With dynamic rendering, your application is only as fast as your slowest data fetch.




export default async function DashboardPage() {
  // ? Each await has to wait for the previous one to finish (Generally, when the previous fc response is needed for the next one) [WATERFALL]
  // $ fc 1sec, fc 1sec, fc 1sec = 3sec
  // const revenue = await fetchRevenue()
  // const latestInvoices = await fetchLatestInvoices();
  // const { totalPaidInvoices, totalPendingInvoices, numberOfInvoices, numberOfCustomers } = await fetchCardData()



  // ? Promise.allSettled allows you to run multiple promises in parallel and handle each result individually, regardless of whether they succeed or fail.
  // $ It works like Promise.all, in case you don't care if any fc fails. Only shows the results of the promises, not the errors.
  //   const results = await Promise.allSettled([
  //   fetchRevenue(),
  //   fetchLatestInvoices(),
  //   fetchCardData(),
  // ]);

  // * In case any of the promises fail, you can handle the results like this:

  // results.forEach((result) => {
  //   if (result.status === 'fulfilled') {
  //     console.log('✅ Éxito:', result.value);
  //   } else {
  //     console.error('❌ Error:', result.reason);
  //   }
  // });


  // ? If you want to run them in parallel, use Promise.all
  // $ fc 1sec, fc 1sec, fc 1sec = 1sec
  const [revenue, latestInvoices, cardData] = await Promise.all([
    fetchRevenue(),
    fetchLatestInvoices(),
    fetchCardData(),
  ]);
  // * If an error occurs in any of the promises, it will execute the catch block. You dunno which one failed.

  const {
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfInvoices,
    numberOfCustomers,
  } = cardData;

  return (
    <main>
      <h1 className={`font-lusitana mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* IN CASE WE WANT TO GROUP THESE COMPONENTS, WE NEED TO MOVE THE FETCHES FC DOWN TO <CARDWRAPPER/> COMPONENT */}
        {/* THIS WRAPPER CREATES A STAGGERED EFFECT, BY STREAMING PAGE SECTIONS AND ENSURE THAT WE WILL LOAD IN THE DATA AT THE SAME TIME. */}
        {/* 
          <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />  // 
        </Suspense>
        */}

        {/* Streams each component UI individually */}
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}


// * When we implement react Suspense, we fetch the data in the component itself. In case this takes longer than expected we may isolate and show in the UI the data that is already available.
/* 

export default async function RevenueChart() {
  
  | revenue is fetched in the children component itself (<RevenueChart />), so we can use Suspense to show a loading state while the data is being fetched.
  const latestInvoices = await fetchLatestInvoices();
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
 
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      | // Suspense is a React feature that allows you to wait for some code to load before rendering the component.
        ? <Suspense fallback={<RevenueChartSkeleton />}>
        ? <RevenueChart />
        ? </Suspense>
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}


*/


