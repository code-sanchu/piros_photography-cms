import "@total-typescript/ts-reset";

import "react-toastify/dist/ReactToastify.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Slide, ToastContainer } from "react-toastify";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import TempLayout from "~/layout/TempLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <TempLayout>
          <Component {...pageProps} />
        </TempLayout>
      </SessionProvider>
      <ToastContainer
        hideProgressBar
        position="bottom-right"
        transition={Slide}
      />
    </>
  );
};

export default api.withTRPC(MyApp);
