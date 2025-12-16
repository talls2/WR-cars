import { getInventory, getCustomers } from "./actions";
import DashboardView from "./components/DashboardView";

export default async function Page() {
  const inventory = await getInventory();
  const customers = await getCustomers();

  return <DashboardView inventory={inventory} customers={customers} />;
}