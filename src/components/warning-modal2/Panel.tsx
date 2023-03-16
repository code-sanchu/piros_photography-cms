import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ErrorIcon, InfoIcon, TickIcon } from "../Icon";
import MyModalPanel from "../MyModalPanel";
import Spinner from "../Spinner";
import { useWarningModalContext } from "./Context";

export const WarningPanel = ({
  text,
  onConfirm,
  invokedFuncStatus,
}: {
  text: { title: string; body: string };
  onConfirm: (arg0: { closeModal: () => void }) => void;
  invokedFuncStatus?: "error" | "idle" | "loading" | "success";
}) => {
  const { closeModal, isOpen } = useWarningModalContext();

  return (
    <MyModalPanel
      onClose={() => {
        closeModal();
      }}
      isOpen={isOpen}
    >
      <div
        id="alert-additional-content-4"
        className="min-w-[300px] max-w-xl rounded-lg border border-my-alert-content bg-white p-4 text-my-alert-content shadow-lg"
        role="alert"
      >
        <div className="flex items-center gap-xxs">
          <span className="text-lg">
            <InfoIcon weight="fill" />
          </span>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">{text.title}</h3>
        </div>
        <div className="mt-2 mb-4 text-left text-sm text-base-content">
          {text.body}
        </div>
        <div className="mt-lg flex items-center justify-between">
          <button
            type="button"
            className="my-btn my-btn-neutral"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            type="button"
            className="my-btn my-btn-action"
            data-dismiss-target="#alert-additional-content-4"
            onClick={() => onConfirm({ closeModal })}
          >
            Confirm
          </button>
        </div>
        {invokedFuncStatus ? (
          <Transition
            show={invokedFuncStatus !== "idle"}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="absolute left-0 top-0 z-50 grid h-full w-full place-items-center rounded-md bg-white bg-opacity-90">
              <div className="flex items-center gap-md">
                {invokedFuncStatus === "loading" ? (
                  <>
                    <Spinner />
                    <p className="font-mono text-sm capitalize text-base-content">
                      Loading
                    </p>
                  </>
                ) : invokedFuncStatus === "error" ? (
                  <>
                    <span className="text-my-error-content">
                      <ErrorIcon />
                    </span>
                    <p className="font-mono text-sm text-base-content">
                      Something went wrong
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-my-success-content">
                      <TickIcon />
                    </span>
                    <p className="font-mono text-sm text-base-content">
                      Delete success
                    </p>
                  </>
                )}
              </div>
            </div>
          </Transition>
        ) : null}
      </div>
    </MyModalPanel>
  );
};
