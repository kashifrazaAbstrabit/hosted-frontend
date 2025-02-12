import MetaData from "../components/common/MetaData";

const Home = () => {
  return (
    <div className="flex w-full">
      <MetaData title="Home" />

      <div className="w-[calc(100%-288px)] ml-72 mx-auto max-w-[1300px] bg-white left-72">
        Hello
      </div>
    </div>
  );
};

export default Home;
