import Layout from "~/components/layouts";
import { UnderConstructionIcon } from "~/components/ui-elements";

const HomePage = () => {
  return (
    <Layout.ContentBody>
      <div className="mt-xl grid place-items-center">
        <div className="mb-xs text-4xl text-gray-300">
          <UnderConstructionIcon weight="light" />
        </div>
        <h5 className="font-bold">Home page</h5>
        <p className="mt-xs mb-sm text-gray-500">
          Home page under construction
        </p>
      </div>
    </Layout.ContentBody>
  );
};

export default HomePage;
