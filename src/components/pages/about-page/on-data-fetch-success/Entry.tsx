/* eslint-disable @typescript-eslint/no-non-null-assertion */
import produce from "immer";
import { toast } from "react-toastify";

import { api } from "~/utils/api";

import Toast from "~/components/data-display/Toast";
import DataTextAreaForm from "~/components/forms/DataTextAreaForm";
import { ContentBodyLayout } from "~/components/layout/ContentBody";

const OnDataFetchSuccess = () => {
  return (
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
};

export default OnDataFetchSuccess;

const BodyText = () => {
  const { data } = api.aboutPage.getText.useQuery();
  const aboutText = data as NonNullable<typeof data>;

  const apiUtils = api.useContext();

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
    onError: () => {
      toast(<Toast text="Error updating text" type="error" />);
    },
    onSuccess: () => {
      toast(<Toast text="Text updated" type="success" />);
    },
  });

  return (
    <div>
      <DataTextAreaForm
        onSubmit={({ inputValue, onSuccess }) => {
          updateTitleMutation.mutate(
            { data: { text: inputValue } },
            { onSuccess }
          );
        }}
        initialValue={aboutText.body}
        placeholder="Edit about main text..."
      />
    </div>
  );
};
