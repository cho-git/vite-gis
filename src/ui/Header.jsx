import { menuParse, useMenuStore } from '../stores/MenuStore'
import { useLoginStore } from '../stores/LoginStore'
import { useNavigate } from 'react-router-dom'
import '../assets/css/common.css'

const Header = () => {
    const navigate = useNavigate();
    const menulist = useMenuStore((a) => a.menuList)

    const logout = () => {
        useLoginStore.getState().setLoginStatus(false)
        navigate("/login");
    }
    const pagehandeler = (id) => {
        menuParse(id);
    }

    return (
        <>
            <div className="header">
                <h1>
                    {menulist && menulist.length > 0 &&
                        menulist.filter((menu) => menu.LVL === 1).sort((a, b) => a.SORT_ORDER - b.SORT_ORDER).map((item) => (
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

export default Header; 