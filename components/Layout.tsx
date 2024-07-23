import Head from "next/head";

import type { PropsWithChildren } from "react";

import { Analytics } from "@vercel/analytics/react";

import { Navbar } from "./Navbar";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="container mx-auto my-6 px-3">
      <Head>
        <title>ETHW-ENS</title>
        <link href="/favicon.png" rel="icon" />
      </Head>
      <Navbar />
      <main>
        {children}
        <Analytics />
      </main>
    </div>
  );
}
