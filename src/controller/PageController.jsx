import { MainPage } from "../pages/MainPage";
import { useMenuStore } from "../stores/MenuStore";
import "../assets/css/base.css"
const PageController = () => {
    const { currentMenuItem } = useMenuStore((state) => state);
    const PageComponent = currentMenuItem?.PageComponent;
    return (
        <div id="topdiv">
            {PageComponent ? (
                <PageComponent />
            ) : (
                <MainPage />
            )}
        </div>
    );
};

export default PageController