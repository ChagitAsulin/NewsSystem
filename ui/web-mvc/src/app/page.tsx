//export default function Page(){ return <div>DashboardView</div> }

import DashboardView from "../views/DashboardView";

export default function Page() {
  return (
    <main className="p-4">
      <DashboardView />
    </main>
  );
}
