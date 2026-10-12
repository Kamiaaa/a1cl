import Carousel from "./components/carousel/Carousel";
import CheckCoverage from "./components/CheckCoverage";
import NewConnection from "./components/NewConnection";
import PackageFinder from "./components/PackageFinder";
import SpeedCheck from "./components/SpeedCheck";

export default function Home() {
    return (
        <>
            <Carousel />
            <PackageFinder />
            <CheckCoverage />
            <SpeedCheck />
            <NewConnection />
        </>
    );
}