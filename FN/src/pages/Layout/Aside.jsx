import '../../css/Layout/Aside.scss'
import { Link } from 'react-router-dom';

const Aside = ({ activeChatId, setActiveChatId, chatRooms, setChatRooms }) => {
    // 채팅방 ID 배열을 추출 (최신 순으로 정렬)
    const chatRoomIds = Object.keys(chatRooms).reverse(); 

    // 채팅방 클릭 핸들러
    const handleChatClick = (id) => {
        setActiveChatId(id);
    };

    return (
        <aside className="side_menu_wrap">
            <div className="menu_wrap">
                <div className="menu_top_wrap chat_list_container">
                    {/* 새 채팅 시작 버튼 (HOME 역할) */}
                    <Link to="/" className="btn_select_wrap" onClick={() => setActiveChatId(null)}>
                        <div className="btn_wrap">
                            <img src="./images/icon_HOME.png" alt="새 채팅" style={{ width: '32px' }} />
                        </div>
                        <p>새 채팅</p>
                    </Link>

                    {/* ⭐️ 채팅방 목록 렌더링 */}
                    {chatRoomIds.map((id) => (
                        <div 
                            key={id}
                            className={`btn_select_wrap chat_room_item ${id == activeChatId ? 'active' : ''}`}
                            onClick={() => handleChatClick(id)}
                            style={{cursor: 'pointer'}}
                        >
                            {/* 채팅방 아이콘 (임시) */}
                            <div className="btn_wrap">
                                <img src="./images/icon_작성.png" alt="대화" style={{ width: '40px' }} />
                            </div>
                            {/* 채팅방 제목 (첫 메시지) */}
                            <p>{chatRooms[id].title}</p> 
                        </div>
                    ))}
                    
                    {/* 기존 버튼들은 그대로 유지 */}
                    <Link to="/" className="btn_select_wrap">
                        <div className="btn_wrap">
                            <img src="./images/icon_작성.png" alt="작성" style={{ width: '40px' }} />
                        </div>
                        <p>작성</p>
                    </Link>
                    <Link to="/" className="btn_select_wrap">
                        <div className="btn_wrap">
                            <img src="./images/icon_정리.png" alt="정리" style={{ width: '27px' }} />
                        </div>
                        <p>정리</p>
                    </Link> 
                </div>
                <div className="menu_bottom_wrap">
                    <Link to="/" className="btn_select_wrap">
                        <div className="btn_wrap">
                            <img src="./images/icon_설정.png" alt="설정" style={{ width: '20px' }} />
                        </div>
                        <p>설정</p>
                    </Link>
                </div>
            </div>
        </aside>
    )
}

export default Aside