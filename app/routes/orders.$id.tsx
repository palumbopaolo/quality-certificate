import { V2_MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LinksFunction, ActionArgs, LoaderArgs } from "@remix-run/node";
import { useTranslation } from "react-i18next";

import { db } from "~/utils/db.server";

import orderStylesUrl from "~/styles/order.css";

export const links: LinksFunction = () => [
  {rel: "stylesheet", href: orderStylesUrl },
]

// export const meta: V2_MetaFunction = ({ location }) => {
//   const searchQuery = new URLSearchParams(
//     location.search
//   ).get("q");
//   console.log(`Search results for "${searchQuery}"`);
//   return [{ title: `Search results for "${searchQuery}"` }];
// };

export const meta: V2_MetaFunction<typeof loader> = ({
  data,
}) => {
  const order : any = Object.values(data);
  return [{ title: `Quality Certificate for order ${order[0]?.orderNumber.toString()}` }];
};

export const action = async ({request}:ActionArgs) => {
  const printdate = new Date()
  const form : any = await request.formData();
  
  if (form.get("intent") !== "put") {
    throw new Response(
      `The intent ${form.get("intent")} is not supported`,
      { status: 400 }
    );
  }
  
  const id = parseInt(form.get("orderId"))
  
  await db.orders.update({
    where: {
      id: id,
    },
    data:{
      printdate: printdate,
    },
  })

  return redirect("/");
}

export async function loader({ params }:LoaderArgs) {
  try {
    const id = parseInt(params.id)
    if (id == null) return redirect("/");
    const order = await db.orders.findUnique({
      where: {
        id: id,
      },
    })
    return { data : order }
  } catch (err) {
    console.error(err);
    redirect("/");
    return {};
  }
}

export default function (){
  const {data:order} = useLoaderData()
  let {t} = useTranslation();
  const now = new Date()
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0")
  const year = now.getFullYear()
  const id = order.id

  return  <>
            <div id="print-button" className="no-print">
              <form method="post">
                <input type="hidden" name="orderId" value={id} />
                <button type="submit" name="intent" onClick={()=>{window.print()}} className="button no-print" value="put">{t('printBtn')}</button>
              </form>
            </div>
            <div id="certificate">
            <div className="item1">
              <h1>Quality Certificate</h1>
            </div>

            <div className="item2">
              <h2>{order.customerNumber} : {order.customerName}</h2>
            </div>

            <div className="item3">
              <p><b>Certificate number = ONDAPLAST product reference</b></p>
            </div>

            <div className="item4">
              <p>{order.itemNumber}</p>
            </div>

            <div className="item5">
              <p><b>Customer product reference</b></p>
            </div>

            <div className="item6">
              <p>{order.customerItemReference}</p>
            </div>

            <div className="item7">
              <p>{order.customerItemDescription}</p>
            </div>

            <div className="item8">
              <p><b>Lot number:</b></p>
            </div>

            <div className="item9">
              <p>{order.supplierLotNumber}</p>
            </div>

            <div className="item10">
              <p><b>Date:</b> {day}.{month}.{year}</p>
            </div>

            <div className="item11">
              <p>
              <b>Supplier: </b><br />
              {t('supplier')}
              </p>
            </div>

            <div className='item15'>
              <table className='tg'>
                <tbody>
                  <tr>
                    <td className='tg-0lax' colSpan={2} width={'28%'}><b>Material: Polionda&copy; Polypropilene</b></td>
                    <td className='tg-0lax' width={'15%'}><b>Target</b></td>
                    <td className="tg-0lax"><b>Tolerance<br /> Min. / Max.</b></td>
                    <td className="tg-0lax"><b>Decision<br />OK / NOK</b></td>
                    <td className="tg-0lax" rowSpan={7}><b>If NOK, product to be rejected.</b></td>
                  </tr>
                  <tr>
                    <td className='tg-0lax' colSpan={2}><b>Thickness</b></td>
                    <td className='tg-0lax'>{order.thickness}</td>
                    <td className='tg-0lax'>+/- {order.thicknessTolerance}</td>
                    <td className='tg-0lax'>OK</td>
                  </tr>
                  <tr>
                    <td className="tg-0lax" colSpan={2}><b>Grammage</b></td>
                    <td className='tg-0lax'>{order.grammage} g/m<sup>2</sup></td>
                    <td className='tg-0lax'>+/- {order.grammageTolerance}</td>
                    <td className='tg-0lax'>OK</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax' rowSpan={3}><b>Inner<br />dimensions<br />in volume</b></td>
                    <td className='tg-0lax'><b>Length:</b></td>
                    <td className='tg-0lax'>{order.length} mm</td>
                    <td className='tg-0lax'>+/- {order.lengthTolerance}</td>
                    <td className='tg-0lax'>OK</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax'><b>Width:</b></td>
                    <td className='tg-0lax'>{order.width} mm</td>
                    <td className='tg-0lax'>+/- {order.widthTolerance}</td>
                    <td className='tg-0lax'>OK</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax'><b>Height:</b></td>
                    <td className='tg-0lax'>{(order.height != null || order.height != '') ? order.height : order.thickness} mm</td>
                    <td className='tg-0lax'>+/- {order.heightTolerance}</td>
                    <td className='tg-0lax'>OK</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax' colSpan={2}><b>Colour</b></td>
                    <td className='tg-0lax'>{order.color}</td>
                    <td className='tg-0lax'></td>
                    <td className='tg-0lax'>OK</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax' colSpan={2}><b>Pollution:</b></td>
                    <td className='tg-0lax' colSpan={4}>Absence of dust particles and insects: tested and controlled</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax' colSpan={2}><b>Surface aspect:</b></td>
                    <td className='tg-0lax' colSpan={4}>OK</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax' colSpan={2}><b>Packaging:</b></td>
                    <td className='tg-0lax' colSpan={4}>OK</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax' colSpan={2}><b>Delivery address:</b></td>
                    <td className='tg-0lax' colSpan={4}>{order.deliveryCustomerName}</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax' colSpan={2}><b>Date:</b></td>
                    <td className='tg-0lax' colSpan={4}>{day}.{month}.{year}</td>
                  </tr>
                  <tr>
                    <td className='tg-0lax' colSpan={2}><span><b>Approval:</b></span></td>
                    <td className='tg-0lax' colSpan={4}></td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
          </>
}