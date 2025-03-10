export const CMPopup = ({ item }) => {


    return (
        <div className="CMPopup">
            <table >
                <colgroup>
                    <col width="30%" />
                    <col width="70%" />
                </colgroup>
                <tbody>
                    <tr>
                        <th>작업ID</th>
                        <td>{item.job_id}{item.id}</td>
                    </tr>
                    <tr>
                        <th>시설물구분</th>
                        <td>{item.fac_type}</td>
                    </tr>
                    <tr>
                        <th>ERP 시설번호</th>
                        <td>{item.erp_no}</td>
                    </tr>
                    <tr>
                        <th>시설물 세부구분</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>압력</th>
                        <td></td>
                    </tr>

                    <tr>
                        <th>재질</th>
                        <td></td>
                    </tr>
                </tbody>


            </table>
        </div>
    )
}
