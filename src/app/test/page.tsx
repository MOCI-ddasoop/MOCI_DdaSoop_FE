import CardContainer from "@/domain/my-page/components/CardContainer";

function TestPage() {
  const CARD_DATA = Array.from({ length: 20 }).map((_, index) => ({
    id: index,
    src: "https://i.namu.wiki/i/bjhl-c4YuugxXFaZaFRbPvU0IGuNuSPvqVoujzeccTdP39XErpUKxRO6HWPeNj9CWIMe_mEnEj5xfuZgB8BrNawRlD1X9gSxsHJsBSVf82G71Mdw4OROpopv0sa4SwRyDINrp08r3mD9WPCv1Xpsow.webp",
    alt: "test",
  }));

  return (
    <div className="w-full h-full">
      <CardContainer data={CARD_DATA} />
    </div>
  );
}
export default TestPage;
