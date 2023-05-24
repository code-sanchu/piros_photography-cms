import produce from "immer";
import { useMeasure } from "react-use";

import { api } from "~/utils/api";
import { useVideoContext } from "~/components/+my-pages/videos/_context";
import { DataTextAreaForm, DataTextInputForm } from "~/components/ui-compounds";
import { VideoIFrame } from "~/components/ui-elements";
import { getYoutubeEmbedUrlFromId } from "~/helpers/youtube";
import { useAdmin, useToast } from "~/hooks";

const Content = () => (
  <div className="flex justify-center">
    <div className="w-full max-w-[600px]">
      <Title />
      <Description />
      <VideoEmbed />
    </div>
  </div>
);

export default Content;

const Title = () => {
  const video = useVideoContext();

  const apiUtils = api.useContext();

  const toast = useToast();

  const updateTitleMutation = api.youtubeVideo.updateTitle.useMutation({
    async onMutate(mutationInput) {
      const prevData = apiUtils.youtubeVideo.getAll.getData();

      await apiUtils.youtubeVideo.getAll.cancel();

      apiUtils.youtubeVideo.getAll.setData(undefined, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updatedData = produce(currData, (draft) => {
          const videoIndex = draft.findIndex(
            (draftVideo) => draftVideo.id === mutationInput.where.id,
          );
          const draftVideo = draft[videoIndex];

          if (!draftVideo) {
            return;
          }

          draftVideo.title === mutationInput.data.title;
        });

        return updatedData;
      });
    },
    onError() {
      toast.error("Error updating title");
    },
    onSuccess() {
      toast.success("Title updated");
    },
  });

  const { isAdmin } = useAdmin();

  return (
    <div className="max-w-[80%] text-xl">
      <DataTextInputForm
        input={{
          initialValue: video.title,
          minWidth: 300,
          placeholder: "Video title (optional)",
        }}
        onSubmit={({ inputValue }) => {
          if (!isAdmin) {
            return;
          }
          updateTitleMutation.mutate({
            data: { title: inputValue },
            where: { id: video.id },
          });
        }}
        tooltip={{
          text: "click to edit title",
        }}
      />
    </div>
  );
};

const Description = () => {
  const video = useVideoContext();

  const apiUtils = api.useContext();

  const toast = useToast();

  const updateDescriptionMutation =
    api.youtubeVideo.updateDescription.useMutation({
      async onMutate(mutationInput) {
        const prevData = apiUtils.youtubeVideo.getAll.getData();

        await apiUtils.youtubeVideo.getAll.cancel();

        apiUtils.youtubeVideo.getAll.setData(undefined, (currData) => {
          if (!currData) {
            return prevData;
          }

          const updatedData = produce(currData, (draft) => {
            const videoIndex = draft.findIndex(
              (draftVideo) => draftVideo.id === mutationInput.where.id,
            );
            const draftVideo = draft[videoIndex];

            if (!draftVideo) {
              return;
            }

            draftVideo.description === mutationInput.data.description;
          });

          return updatedData;
        });
      },
      onError() {
        toast.error("Error updating description");
      },
      onSuccess() {
        toast.success("Description updated");
      },
    });

  const { isAdmin } = useAdmin();

  return (
    <div className="mb-xs w-[90%] font-serif text-lg">
      <DataTextAreaForm
        initialValue={video.description}
        tooltipText="click to edit description"
        placeholder="Video description (optional)"
        onSubmit={({ inputValue }) => {
          if (!isAdmin) {
            return;
          }

          updateDescriptionMutation.mutate({
            data: { description: inputValue },
            where: { id: video.id },
          });
        }}
      />
    </div>
  );
};

const VideoEmbed = () => {
  const { youtubeVideoId } = useVideoContext();

  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <div className="aspect-video" ref={containerRef}>
      {width && height ? (
        <VideoIFrame
          src={getYoutubeEmbedUrlFromId(youtubeVideoId)}
          height={height}
          width={width}
        />
      ) : null}
    </div>
  );
};
