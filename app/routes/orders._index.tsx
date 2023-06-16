import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { db } from "~/utils/db.server";

export async function loader({ request }) {
    try {
      const url = new URL(request.url);
      const search = new URLSearchParams(url.search);
      if (!search.get("order")) return redirect("/");
      const order = search.get("order");
      
      const rows = await db.orders.count({ where: { orderNumber : order}})
      if(rows > 0){
        return json({
          ordersListItems: await db.orders.findMany({
            where: { orderNumber: order },
            select: { id: true, orderNumber: true, orderPartNumber: true, orderJobNumber: true },
          }),
        })
      } else {
        return redirect("/")
      }
    } catch (err) {
      console.error(err);
      redirect("/");
      return {};
    }
}

export default function OrdersIndex(){
    const data = useLoaderData()
    let {t} = useTranslation();
    return (
      <>
        <h1>{t('ordersTitle')}</h1>
        <ul>
            {data.ordersListItems?.map(({ id, orderNumber, orderPartNumber, orderJobNumber }) => (
                <li key={id}>
                    <Link to={`/orders/${id}`}>{orderNumber} {orderPartNumber} {orderJobNumber}</Link>
                </li>
            ))}
        </ul>
      </>
    )
}