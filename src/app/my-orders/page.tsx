import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import OrdersWrapper from "./components/orders-wrapper";

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/authentication");
  }

  return (
    <div className="mx-auto max-w-7xl px-5">
      <OrdersWrapper />
    </div>
  );
};

export default MyOrdersPage;
