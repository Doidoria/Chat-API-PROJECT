import '../css/main.scss';
import { useState, useRef, useCallback } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import useAutosizeTextarea from '../component/useAutosizeTextarea';
import axios from 'axios';

const CHAT_API_URL = 'http://localhost:3001/api/chat';

const ChatRoom = () => {
    const { id: urlChatId } = useParams();

    const {
        activeChatId, // Context의 activeChatId는 현재 URL ID와 같다고 가정
        setActiveChatId,
        chatRooms,
        setChatRooms
    } = useOutletContext();

    // URL ID가 Context ID와 다를 경우, Context ID를 업데이트합니다. (필요 시)
    // if (urlChatId && urlChatId != activeChatId) { useEffect(() => setActiveChatId(urlChatId), [urlChatId]) }

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);

    useAutosizeTextarea(textareaRef, message);

    const handleInputChange = useCallback((e) => {
        setMessage(e.target.value);
    }, []);

    const sendMessage = async (userMessage, chatId) => {
        setLoading(true);

        const currentHistory = chatRooms[chatId]?.history || [];

        const updatedHistoryBeforeAI = [...currentHistory, { role: 'user', content: userMessage }];

        setChatRooms(prevRooms => ({
            ...prevRooms,
            [chatId]: {
                ...prevRooms[chatId],
                history: updatedHistoryBeforeAI.concat({ role: 'ai', content: '응답 생성 중...', loading: true }),
            }
        }));

        try {
            const response = await axios.post(CHAT_API_URL, {
                messages: updatedHistoryBeforeAI,
            });

            const aiResponse = response.data.response;

            setChatRooms(prevRooms => {
                const finalHistory = updatedHistoryBeforeAI.concat({ role: 'ai', content: aiResponse });
                return {
                    ...prevRooms,
                    [chatId]: {
                        ...prevRooms[chatId],
                        history: finalHistory,
                    }
                };
            });

        } catch (error) {
            console.error('API 통신 오류:', error);
            setChatRooms(prevRooms => {
                const historyWithError = updatedHistoryBeforeAI.concat({ role: 'ai', content: '❌ 오류 발생: 응답 불가.', error: true });
                return {
                    ...prevRooms,
                    [chatId]: {
                        ...prevRooms[chatId],
                        history: historyWithError,
                    }
                };
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 현재 채팅방 ID (URL에서 가져온 ID 사용)
        if (!message.trim() || loading || !urlChatId) return;

        const userMessage = message.trim();

        setMessage('');

        sendMessage(userMessage, urlChatId);
    };

    // 현재 활성화된 채팅방의 기록만 가져오기 (URL ID 사용)
    const currentChats = urlChatId ? chatRooms[urlChatId]?.history : [];

    const renderChats = () => {
        if (currentChats.length === 0) {
            return (
                <div className="empty_state">
                    채팅방 기록이 없습니다.
                </div>
            );
        }

        return currentChats.map((chat, index) => (
            <div key={index} className={`chat_message chat_${chat.role} ${chat.loading ? 'loading' : ''}`}>
                <strong>{chat.role === 'user' ? '나' : 'AI'}</strong>
                <div>{chat.content}</div>
            </div>
        ));
    };

    return (
        <section className="section_wrap">
            <div className="main_body_wrap">
                {/* 챗 기록을 여기서 보여줍니다. */}
                <div className="chat_history_wrap">
                    {renderChats()}
                </div>

                {/* 입력창은 유지 */}
                <div className="input_select_wrap">
                    <form onSubmit={handleSubmit}>
                        {/* ... (입력창 UI 유지) ... */}
                        <div className="inst_top_wrap">
                            <label htmlFor="myTextarea" className="inst_label">
                                <textarea name="message" id="myTextarea" ref={textareaRef}
                                    value={message} onChange={handleInputChange}
                                    placeholder="궁금하신 내용을 입력해주세요"
                                    style={{ resize: 'none' }} />
                                <input type="submit" style={{ display: 'none' }} />
                            </label>
                        </div>
                        <div className="inst_bottom_wrap">
                            <div className="left_btn_wrap">
                                <div className="inst_btn">
                                    <button shape="circle" type="button" style={{ cursor: 'pointer' }}>
                                        <img src="./images/icon_+.png" alt="파일추가" style={{ width: '14px' }} />
                                    </button>
                                </div>
                            </div>
                            <div className="right_btn_wrap">
                                <div className="inst_btn"></div>
                                <div className="inst_btn">
                                    <button shape="circle" type="submit" style={{ cursor: 'pointer' }}
                                        disabled={!message.trim() || loading}
                                    >
                                        <img src="./images/icon_입력완료.png" alt="입력완료" style={{ width: '14px' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ChatRoom;