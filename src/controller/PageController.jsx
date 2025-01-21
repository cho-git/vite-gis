import { MainPage } from "../pages/MainPage";
import { useMenuStore } from "../stores/MenuStore";

const PageController = () => {
    const { currentMenuItem } = useMenuStore((state) => state);
    const PageComponent = currentMenuItem?.PageComponent;
    return (
        <div>
            {PageComponent ? (
                <PageComponent />
            ) : (
                <MainPage />
            )}
        </div>
    );
};

export default PageController