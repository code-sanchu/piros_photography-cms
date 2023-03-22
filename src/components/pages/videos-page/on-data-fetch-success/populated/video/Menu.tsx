import { toast } from "react-toastify";

import { api } from "~/utils/api";

import WithTooltip from "~/components/data-display/WithTooltip";
import { DeleteIcon, MenuIcon } from "~/components/Icon";
import MyMenu, { MenuItem } from "~/components/MyMenu";
import { Modal, WarningPanel } from "~/components/modal";
import Toast from "~/components/data-display/Toast";
import { useVideoContext } from "~/videos-page/_context";

const VideoMenu = () => {
  return (
    <div className="absolute right-xs top-xs z-30 opacity-0 transition-opacity duration-75 ease-in-out group-hover/video:opacity-100">
      <MyMenu
        button={({ isOpen }) => (
          <WithTooltip text="Video menu" placement="top" isDisabled={isOpen}>
            <div className="transition-colors duration-75 ease-in-out hover:!text-gray-700 group-hover/video:text-gray-300">
              <MenuIcon />
            </div>
          </WithTooltip>
        )}
        styles={{ itemsWrapper: "right-0" }}
      >
        <MenuItem>
          <DeleteModal />
        </MenuItem>
      </MyMenu>
    </div>
  );
};

export default VideoMenu;

const DeleteModal = () => {
  const video = useVideoContext();

  const { refetch: refetchVideos } = api.youtubeVideo.getAll.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const deleteMutation = api.youtubeVideo.delete.useMutation({
    onSuccess: async () => {
      await refetchVideos();

      toast(<Toast text="deleted video" type="success" />);
    },
    onError: () => {
      toast(<Toast text="delete video failed" type="error" />);
    },
  });

  return (
    <Modal
      button={({ open }) => (
        <div
          className="cursor-pointer rounded-md px-2 py-2 text-sm transition-all duration-75 ease-in-out hover:bg-my-alert"
          onClick={open}
        >
          <WithTooltip text="Delete video" yOffset={15}>
            <span className="text-my-alert-content">
              <DeleteIcon />
            </span>
          </WithTooltip>
        </div>
      )}
      panelContent={({ close: closeModal }) => (
        <WarningPanel
          callback={{
            func: () =>
              deleteMutation.mutate(
                {
                  where: { id: video.id, index: video.index },
                },
                {
                  onSuccess() {
                    closeModal();
                  },
                }
              ),
          }}
          closeModal={closeModal}
          text={{
            body: "Are you sure? This can't be undone.",
            title: "Delete video",
          }}
        />
      )}
    />
  );
};