import { type ReactElement } from "react";
import { Album as BaseAlbum, Image as BaseImage } from "@prisma/client";

import AddImageMenu from "~/components/image/add-image/menu";
import WithTooltip from "~/components/data-display/WithTooltip";
import MyCldImage from "~/components/image/MyCldImage";
import ImagePlaceholder from "~/components/image/Placeholder";

type Props = {
  addImageMenu?: { modals?: { onVisibilityChange?: { onOpen: () => void } } };
  album: BaseAlbum & { coverImage: BaseImage | null };
};

export const CoverImage = ({ album, addImageMenu }: Props) => {
  return !album.coverImageId ? (
    <Unpopulated />
  ) : (
    <Populated album={album} addImageMenu={addImageMenu} />
  );
};

const CoverImageMenu = ({
  children,
  tooltipText,
  addImageMenu,
}: {
  children: ReactElement;
  tooltipText: string;
  addImageMenu: Props["addImageMenu"];
}) => {
  return (
    <AddImageMenu
      styles={{ buttonWrapper: "w-full" }}
      imageModals={addImageMenu?.modals}
    >
      {({ isOpen }) => (
        <WithTooltip text={tooltipText} type="action" isDisabled={isOpen}>
          <div>{children}</div>
        </WithTooltip>
      )}
    </AddImageMenu>
  );
};

const Unpopulated = ({
  addImageMenu,
}: {
  addImageMenu?: Props["addImageMenu"];
}) => {
  return (
    <CoverImageMenu
      addImageMenu={addImageMenu}
      tooltipText="Click to add image"
    >
      <ImagePlaceholder />
    </CoverImageMenu>
  );
};

const Populated = ({
  addImageMenu,
  album,
}: {
  addImageMenu?: Props["addImageMenu"];
  album: Props["album"];
}) => {
  if (!album.coverImage) {
    // would really be an error if there was a coverimageId but no cover image
    return null;
  }

  return (
    <CoverImageMenu
      addImageMenu={addImageMenu}
      tooltipText="Click to change image"
    >
      <div className="">
        <MyCldImage
          fit="object-cover"
          heightSetByContainer={{ isSetByContainer: false, approxVal: 800 }}
          src={album.coverImage.cloudinary_public_id}
          imgAdditionalClasses="transition-transform duration-200 ease-in-out group-hover:scale-95"
          wrapperAdditionalClasses="overflow-hidden transition-colors duration-150 ease-in-out hover:rounded-md hover:bg-gray-100 "
        />
      </div>
    </CoverImageMenu>
  );
};
