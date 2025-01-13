import { useMenuStore } from "../stores/MenuStore";
import { useEffect, useState } from "react";

export const PageController = () => {
    const { currentMenuItem } = useMenuStore((state) => state);
    const [Component, setComponent] = useState(null); // 동적으로 로드된 컴포넌트 저장

    useEffect(() => {
        if (currentMenuItem?.PAGE_ROUTE) {
            const route = currentMenuItem.PAGE_ROUTE;
            const folder = route.split('/')[1];
            const page = route.split('/')[2].replace(/.view/gi, '');
            import(`../features/${folder}/${page}`)
                .then((module) => setComponent(() => module.default)) // 동적 컴포넌트 설정
                .catch((error) => {
                    console.error(`Failed to load component at ../features/${folder}/${page}:`, error);
                    setComponent(() => null);
                });
        }
    }, [currentMenuItem]);

    return (
        <>
            {Component ? <Component /> : <p>Loading...</p>}
        </>
    );
};
