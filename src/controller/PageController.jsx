import { useMenuStore } from "../stores/MenuStore"

export const PageController = () => {
    const currentMenuItem = useMenuStore(a => a.currentMenuItem);

    return (
        <>
            {currentMenuItem &&
                <div className="titWrap">
                    {/* <h3 className="pagetitle">{currentpage.name}</h3> */}
                    <button onClick={()=>{console.log(currentMenuItem)}}></button>
                    {/* {<currentMenuItem.PAGE_ROUTE />} */}
                </div>
            }
        </>
    )
}
