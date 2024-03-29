/* eslint-disable jsx-a11y/alt-text */
import { useState, type ReactElement } from "react";
import { useMeasure } from "react-use";

import { api, type RouterOutputs } from "~/utils/api";
import { MyCldImage } from "~/components/containers";
import { SearchInput } from "~/components/ui-compounds";
import { WithTooltip } from "~/components/ui-display";
import { calcImageDimensions } from "~/helpers/general";
import { fuzzySearch } from "~/helpers/query-data";
import { useAdmin } from "~/hooks";

export type OnSelectImage = (arg0: { imageId: string }) => void;

type Image = RouterOutputs["image"]["uploadPanelGetAll"][0];

export const UploadedPanelContent = ({
  onSelectImage,
  closeModal,
}: {
  onSelectImage: OnSelectImage;
  closeModal: () => void;
}) => (
  <div className="relative flex h-[700px] max-h-[70vh] w-[90vw] max-w-[1200px] flex-col rounded-2xl bg-white p-6 text-left shadow-xl">
    <h3 className="border-b border-b-base-300 pb-sm leading-6 text-base-content">
      Uploaded Images
    </h3>
    <div className="mt-md flex-grow overflow-y-auto">
      <ImagesStatusWrapper>
        <Images onSelectImage={onSelectImage} closeModal={closeModal} />
      </ImagesStatusWrapper>
    </div>
    <div className="mt-xl">
      <button
        className="my-btn my-btn-neutral"
        type="button"
        onClick={() => closeModal()}
      >
        close
      </button>
    </div>
  </div>
);

const ImagesStatusWrapper = ({ children }: { children: ReactElement }) => {
  const { isError, isLoading } = api.image.uploadPanelGetAll.useQuery();

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>There was an error fetching images.</p>
      ) : (
        children
      )}
    </div>
  );
};

const Images = ({
  onSelectImage,
  closeModal,
}: {
  onSelectImage: OnSelectImage;
  closeModal: () => void;
}) => {
  const [tagQuery, setTagQuery] = useState("");

  const { data: allImages } = api.image.uploadPanelGetAll.useQuery();

  return (
    <div>
      {!allImages?.length ? null : (
        <SearchInput
          placeholder="Search by tag"
          inputValue={tagQuery}
          setInputValue={setTagQuery}
        />
      )}
      <div className="mt-md">
        <ImagesGrid
          query={tagQuery}
          onSelectImage={onSelectImage}
          closeModal={closeModal}
        />
      </div>
    </div>
  );
};

const ImagesGrid = ({
  query,
  onSelectImage,
  closeModal,
}: {
  query: string;
  onSelectImage: OnSelectImage;
  closeModal: () => void;
}) => {
  const { data: allImages } = api.image.uploadPanelGetAll.useQuery();

  if (!allImages) {
    return <p>Something went wrong...</p>;
  }

  const imagesByQuery = fuzzySearch({
    entities: allImages,
    keys: ["tags.text", "albumImages.album.title", "albumCoverImages.title"],
    pattern: query,
  });

  return !imagesByQuery.length ? (
    <p className="text-gray-600">No matches</p>
  ) : (
    <div className="grid cursor-pointer grid-cols-3 gap-sm pr-2 xl:grid-cols-4">
      {imagesByQuery.map((image) => (
        <Image
          image={image}
          onSelectImage={onSelectImage}
          closeModal={closeModal}
          key={image.id}
        />
      ))}
    </div>
  );
};

const Image = ({
  image,
  onSelectImage,
  closeModal,
}: {
  image: Image;
  onSelectImage: OnSelectImage;
  closeModal: () => void;
}) => {
  const [containerRef, { width: containerWidth }] =
    useMeasure<HTMLDivElement>();

  const { ifAdmin, isAdmin } = useAdmin();

  return (
    <div
      className={`my-hover-bg flex aspect-square flex-col rounded-lg border border-base-200 p-sm ${
        !isAdmin ? "cursor-not-allowed" : ""
      }`}
      onClick={() =>
        ifAdmin(() => {
          onSelectImage({ imageId: image.id });
          closeModal();
        })
      }
      ref={containerRef}
    >
      {containerWidth ? (
        <WithTooltip text="Click to add" type="action">
          <div className="flex flex-grow flex-col">
            <MyCldImage
              publicId={image.cloudinary_public_id}
              dimensions={calcImageDimensions({
                constraint: {
                  value: { height: containerWidth, width: containerWidth },
                },
                image: {
                  height: image.naturalHeight,
                  width: image.naturalWidth,
                },
              })}
            />
          </div>
        </WithTooltip>
      ) : null}
    </div>
  );
};
