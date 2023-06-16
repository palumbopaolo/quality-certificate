import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  console.log(params.number)
  const orders = await db.orders.findUnique({
    where: { orderNumber: params.number },
  });
  if (!orders) {
    throw new Error("Order not found");
  }
  return json({ orders });
};


export default function OrderRoute(){
  const data = useLoaderData<typeof loader>();

    return(
        <div>
      <p>Here's your hilarious joke:</p>
      <ul>
        {data.orders.map((order) => (
          <li key={order.id}>
            <Link to={order.id}>{order.orderNumber} {order.orderPartNumber} {order.orderJobNumber}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}