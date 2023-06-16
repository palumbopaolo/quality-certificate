import { LinksFunction, json, ActionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useActionData } from "@remix-run/react";

import { db } from "~/utils/db.server";

import stylesUrl from "~/styles/orders.css"

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesUrl },
]

export async function action({ request }: ActionArgs) {
  const body = await request.formData()
  return body
}

export const loader = async () => {
  const data = useActionData()

  return json({
    ordersListItems: await db.orders.findMany({
      where: { orderNumber: data.number },
      orderBy: { orderNumber: "desc" },
      select: { id: true, orderNumber: true, orderPartNumber: true, orderJobNumber: true },
    }),
  });
};

export default function Orders(){
  const data = useLoaderData<typeof loader>();
  
  return(
      <div className="orders-layout">
    <header className="orders-header">
      <div className="container">
        <h1 className="home-link">
          <Link
            to="/"
            title="Remix Orders"
            aria-label="Remix Orders"
          >
          <span className="logo">🤪</span>
          <span className="logo-medium">J🤪KES</span>
          </Link>
        </h1>
      </div>
    </header>
    <main className="orders-main">
      <div className="container">
        <div className="orders-list">
          <Link to=".">Get a random joke</Link>
          <p>Here are a few more jokes to check out:</p>
          <ul>
              {data.ordersListItems.map(({ id, orderNumber, orderPartNumber, orderJobNumber }) => (
                <li key={id}>
                  <Link to={orderNumber}>{orderNumber} {orderPartNumber} {orderJobNumber}</Link>
                </li>
              ))}
            </ul>
          <Link to="new" className="button">
            Add your own
          </Link>
        </div>
        
      </div>
    </main>
  </div>
  )
}