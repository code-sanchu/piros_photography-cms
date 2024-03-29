import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";

import { MainMenuIcon, SignOutIcon } from "~/components/ui-elements";

export const SideBarMenu = () => (
  <Menu>
    {({ open }) => (
      <>
        <Menu.Button className="text-3xl text-gray-300 transition-colors duration-75 ease-in-out hover:text-gray-600">
          <MainMenuIcon />
        </Menu.Button>
        <Transition
          show={open}
          as="div"
          className="fixed left-0 top-0 z-50 h-screen"
          enter="transition duration-300 ease-out"
          enterFrom="transform opacity-0 -translate-x-full"
          enterTo="transform opacity-100 translate-x-0"
          leave="transition duration-300 ease-out"
          leaveFrom="transform opacity-100 translate-x-0"
          leaveTo="transform opacity-0 -translate-x-full"
        >
          <Menu.Items className="h-full overflow-y-auto border-r-2 bg-white py-sm pl-md pr-3xl">
            <Content />
          </Menu.Items>
        </Transition>
        <Transition
          as="div"
          show={open}
          className="fixed inset-0 z-40 bg-white/60"
          enter="transition duration-300 ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition duration-300 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        />
      </>
    )}
  </Menu>
);

const Content = () => (
  <div className="flex min-h-full flex-col gap-3xl">
    <div className="flex flex-col items-start gap-xl">
      <div className="text-xl font-medium uppercase">
        Piros <br />
        Photography
      </div>
      <PageLinks />
    </div>
    <div>
      <Logout />
    </div>
  </div>
);

const PageLinks = () => (
  <div className="flex flex-col gap-sm">
    <PageLink route="/" text="Home" />
    <PageLink route="/albums" text="Albums" />
    <PageLink route="/videos" text="Videos" />
    <PageLink route="/about" text="About" />
    <div className="mt-sm">
      <PageLink route="/images" text="Images" />
    </div>
  </div>
);

const PageLink = ({ route, text }: { text: string; route: string }) => (
  <Link href={route} passHref>
    <div className="text-gray-600 transition-colors duration-75 ease-in-out hover:text-gray-800">
      {text}
    </div>
  </Link>
);

const Logout = () => (
  <button
    className="group flex cursor-pointer items-center gap-sm capitalize text-gray-600"
    onClick={() => void signOut()}
    type="button"
  >
    <span className="text-2xl text-gray-400 transition-colors duration-75 ease-in-out group-hover:text-my-alert-content">
      <SignOutIcon />
    </span>
    <span className="transition-colors duration-75 ease-in-out hover:text-gray-800">
      Sign out
    </span>
  </button>
);
