import { Link, Links, Meta, LiveReload, Outlet, Scripts, useLoaderData } from "@remix-run/react";
import { LinksFunction, LoaderArgs, json } from "@remix-run/node"; //add json for i18n
import globalStylesUrl from "~/styles/global.css";
import logo from "./images/logo.jpg";
import logobalkan from "./images/logo-ondaplst-balkan.png";

//add i18n
import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";
import i18next from "~/utils/i18next.server";

export const links: LinksFunction = () => [
  {rel: "stylesheet", href: globalStylesUrl },
]

export let loader = async ({ request }:LoaderArgs) => {
  let locale = await i18next.getLocale(request);
  return json({ locale });
};

export let handle = {
  i18n: "common",
};

export default function App(){
  // Get the locale from the loader
  let { locale } = useLoaderData();
  let { i18n } = useTranslation();
  useChangeLanguage(locale);

  return(
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <title>{locale == 'it' ? "Stampa certificati qualità" : "Print Quality Certificates"}</title>
      </head>
      
      <body>
        <div id="logo">
          <Link to="/">
          <img src={locale == 'it' ? logo : logobalkan} alt="Ondaplast" />
          </Link>
        </div>
        
        <div id="container">
          <Outlet />
          <LiveReload />
        </div>
        <Scripts />
      </body>
    </html>
  )
}