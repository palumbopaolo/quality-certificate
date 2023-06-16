//import type { ActionArgs, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
//import { Form, Link } from "@remix-run/react"
import { Form } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
//import { db } from "~/utils/db.server";

//Add i18Next
import i18next from "~/utils/i18next.server";
import { useTranslation } from "react-i18next";

export let loader = async ({ request }) => {
  let locale = await i18next.getLocale(request);
  return json({ locale });
};

export default function IndexRoute(){
  let { locale } = useLoaderData();
  let {t} = useTranslation();
  return (
    <div className="container">
      <div className="content">
        <h1>
          {t('formTitle')}
        </h1>
        <Form action="/orders" method="get">
          <input type="text" name="order" placeholder={t('inputPlaceholder')} />
          <button type="submit" className="button">{locale == 'it' ? "Cerca" : "Search"}</button>
        </Form>
      </div>
    </div>
  );
}