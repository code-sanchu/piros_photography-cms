import AlbumPage from "~/components/+my-pages/album/+Entry";
import Layout from "~/components/layouts";

export default function Page() {
  return (
    <Layout.Site title={{ pageName: "Album" }}>
      <Layout.Admin>
        <AlbumPage />
      </Layout.Admin>
    </Layout.Site>
  );
}
