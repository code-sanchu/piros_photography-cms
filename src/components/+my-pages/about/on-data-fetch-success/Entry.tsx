/* eslint-disable @typescript-eslint/no-non-null-assertion */
import produce from "immer";

import { api } from "~/utils/api";
import { ContentBodyLayout } from "~/components/layouts/ContentBody";
import { DataTextAreaForm } from "~/components/ui-compounds";
import { WithTooltip } from "~/components/ui-display";
import { useAdmin, useToast } from "~/hooks";

const OnDataFetchSuccess = () => (
  <ContentBodyLayout>
    <div className="p-lg">
      <h1 className="text-xl text-gray-400">About Page</h1>
      <p className="mt-xxs text-sm text-gray-300">
        Edit the main text for the about page below.
      </p>
      <div className="mt-xl">
        <BodyText />
      </div>
    </div>
  </ContentBodyLayout>
);

export default OnDataFetchSuccess;

const BodyText = () => {
  const { data } = api.aboutPage.getText.useQuery();
  const aboutText = data as NonNullable<typeof data>;

  const apiUtils = api.useContext();

  const toast = useToast();

  const updateTitleMutation = api.aboutPage.updateBody.useMutation({
    async onMutate(mutationInput) {
      const prevData = apiUtils.aboutPage.getText.getData();

      await apiUtils.aboutPage.getText.cancel();

      apiUtils.aboutPage.getText.setData(undefined, (currData) => {
        if (!currData) {
          return prevData;
        }

        const updatedData = produce(currData, (draft) => {
          draft.body = mutationInput.data.text;
        });

        return updatedData;
      });
    },
    onError() {
      toast.error("Error updating text");
    },
    onSuccess() {
      toast.success("Text updated");
    },
  });

  const { ifAdmin } = useAdmin();

  return (
    <WithTooltip text="click to edit text">
      <div className="font-serif-3 text-xl">
        <DataTextAreaForm
          onSubmit={({ inputValue, onSuccess }) =>
            ifAdmin(() => {
              updateTitleMutation.mutate(
                { data: { text: inputValue } },
                { onSuccess },
              );
            })
          }
          initialValue={aboutText.body}
          placeholder="Edit about main text..."
        />
      </div>
    </WithTooltip>
  );
};
