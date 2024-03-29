import { useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { createPortal } from "react-dom";
import { useMeasure } from "react-use";

import { useAlbumImageContext } from "~/components/+my-pages/album/_context";
import { MyCldImage } from "~/components/containers";
import { DataTextAreaForm, DataTextInputForm } from "~/components/ui-compounds";
import { MyModal } from "~/components/ui-display";
import { CycleLeftIcon, CycleRightIcon } from "~/components/ui-elements";
import { calcImageDimensionsToFitToScreen } from "~/helpers/general";
import { useAdmin } from "~/hooks";
import { useUpdateDescription, useUpdateTitle } from "../_hooks";

const OpenedImage = () => (
  <>
    <CloseButton />
    <div className={`group/imageModal`}>
      <ImagePanel />
      <DescriptionPanel />
      <CycleImagesButtons />
    </div>
  </>
);

export default OpenedImage;

const CloseButton = () => {
  const { closeModal } = MyModal.useProvider();

  return createPortal(
    <button
      className="fixed top-sm right-sm z-50 text-sm tracking-wide"
      onClick={closeModal}
      type="button"
    >
      close
    </button>,
    document.body,
  );
};

// □ refactor: below jsx - duplication of description

const DescriptionPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { image } = useAlbumImageContext();

  const imageDimensionsForScreen = calcImageDimensionsToFitToScreen({
    height: image.naturalHeight,
    width: image.naturalWidth,
  });

  const [dummyExpandedPanelRef, { height: dummyExpandedPanelHeight }] =
    useMeasure<HTMLDivElement>();

  const [springs, api] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px" },
  }));

  const expand = () => {
    api.start({
      from: { height: "0px" },
      to: { height: `${dummyExpandedPanelHeight}px` },
    });
    setIsExpanded(true);
  };

  const contract = () => {
    api.start({
      from: { height: `${dummyExpandedPanelHeight}px` },
      to: { height: "0px" },
    });
    setIsExpanded(false);
  };

  return (
    <div className={`text-gray-900`}>
      <div
        className={`flex items-center justify-between`}
        style={{
          width: imageDimensionsForScreen.width,
        }}
      >
        <div className={`flex gap-xl `}>
          <div className="text-gray-900">
            <Title />
          </div>
          <button
            className="flex items-center gap-xs whitespace-nowrap text-xs text-gray-700"
            onClick={isExpanded ? contract : expand}
            type="button"
          >
            <span>read {isExpanded ? "less" : "more"}</span>
          </button>
        </div>
      </div>
      <animated.div style={{ overflowY: "hidden", ...springs }}>
        <div
          className={`overflow-y-auto pb-md text-gray-900 transition-opacity duration-150 ease-linear ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            maxHeight: 200,
          }}
        >
          <Description />
          <p className="mt-sm font-mono text-sm text-base-content">
            [ Comments will go here ]
          </p>
        </div>
      </animated.div>
      <div
        className="invisible absolute -z-50"
        style={{
          maxHeight: 200,
        }}
        ref={dummyExpandedPanelRef}
      >
        <Description />
        <p className="mt-sm font-mono text-sm text-base-content">
          [ Comments will go here ]
        </p>
      </div>
    </div>
  );
};

const Title = () => {
  const albumImage = useAlbumImageContext();

  const { ifAdmin } = useAdmin();
  const updateTitle = useUpdateTitle();

  return (
    <DataTextInputForm
      onSubmit={({ inputValue, onSuccess }) =>
        ifAdmin(() =>
          updateTitle(
            {
              title: inputValue,
            },
            { onSuccess },
          ),
        )
      }
      input={{
        initialValue: albumImage.title,
        placeholder: "Title... (optional)",
      }}
      tooltip={{ text: "Click to update title" }}
    />
  );
};

const Description = () => {
  const albumImage = useAlbumImageContext();

  const { ifAdmin } = useAdmin();
  const updateDescription = useUpdateDescription();

  return (
    <div className="overflow-x-hidden">
      <DataTextAreaForm
        onSubmit={({ inputValue, onSuccess }) =>
          ifAdmin(() =>
            updateDescription(
              {
                description: inputValue,
              },
              { onSuccess },
            ),
          )
        }
        tooltipText="Click to update description"
        initialValue={albumImage.description}
        placeholder="Description (optional)"
      />
    </div>
  );
};

const ImagePanel = () => {
  const { image } = useAlbumImageContext();

  const imageDimensionsForScreen = calcImageDimensionsToFitToScreen({
    height: image.naturalHeight,
    width: image.naturalWidth,
  });

  return (
    <MyCldImage
      publicId={image.cloudinary_public_id}
      dimensions={imageDimensionsForScreen}
    />
  );
};

const CycleImagesButtons = () => {
  return createPortal(
    <>
      <button
        className="fixed left-sm top-1/2 z-50 -translate-y-1/2 text-4xl transition-opacity duration-150 ease-in-out group-hover/imageModal:opacity-100"
        type="button"
      >
        <CycleLeftIcon weight="duotone" color="white" fill="black" />
      </button>
      <button
        className="pacity-0 fixed right-sm top-1/2 z-50 -translate-y-1/2 text-4xl transition-opacity duration-150 ease-in-out group-hover/imageModal:opacity-100"
        type="button"
      >
        <CycleRightIcon weight="duotone" color="white" fill="black" />
      </button>
    </>,
    document.body,
  );
};
