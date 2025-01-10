import { useNavigate } from 'react-router-dom'
import '../assets/css/common.css'
import { useLoginStore } from '../stores/LoginStore'
import { useMenuStore } from '../stores/MenuStore'

export const Header = () => {
    const navigate = useNavigate();
    const menulist = useMenuStore((a) => a.menulist)
    const currentMenuItem = useMenuStore(a => a.currentMenuItem);
    const logout = () => {
        useLoginStore.getState().setLoginStatus(false)
        navigate("/login");
    }
    const pagehandeler = (id) => {
        console.log(id, currentMenuItem, menulist);
    }

    return (
        <>
            <div className="header">
                <h1>
                    {menulist && menulist.length > 0 &&
                        menulist.map((item) => (
                            <span
                                key={item.MENU_IDX}
                                id={item.MENU_IDX}
                                className="title"
                                onClick={() => pagehandeler(item.MENU_IDX)}
                            >
                                {item.MENU_NM}
                            </span>
                        ))
                    }
                </h1>
                <button type="button" className="logout" onClick={logout} />
            </div>
        </>
    )
}

