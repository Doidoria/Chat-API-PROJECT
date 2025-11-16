// fileName: Home.jsx (Initial Chat Screen)
import '../css/main.scss'; // SCSS 파일 경로는 유지
import { useState, useRef, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import useAutosizeTextarea from '../component/useAutosizeTextarea';
import axios from 'axios';

// API URL은 유지
const CHAT_API_URL = 'http://localhost:3001/api/chat';

const Home = () => {
    // ChatRoom과 동일하게 Context에서 상태를 가져옴
    const {
        activeChatId, // 이 컴포넌트에서는 주로 null일 것임
        setActiveChatId,
        chatRooms,
        setChatRooms
    } = useOutletContext();

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);

    useAutosizeTextarea(textareaRef, message);

    const handleInputChange = useCallback((e) => {
        setMessage(e.target.value);
    }, []);

    // Home에서는 첫 메시지만 보냄 (ActiveChatId가 무조건 null이므로)
    const sendMessage = async (userMessage, chatId) => {
        setLoading(true);

        // 1. 새로운 사용자 메시지 추가
        const updatedHistoryBeforeAI = [{ role: 'user', content: userMessage }];

        // 2. 채팅방 상태에 로딩 메시지 미리 반영 (Home에서는 첫 채팅방 생성 후 반영)
        setChatRooms(prevRooms => ({
            ...prevRooms,
            [chatId]: {
                title: userMessage.substring(0, 30) + '...',
                history: updatedHistoryBeforeAI.concat({ role: 'ai', content: '응답 생성 중...', loading: true }),
            }
        }));

        // 3. activeChatId 업데이트 (라우팅을 위해 필요)
        setActiveChatId(chatId);

        // 4. 리다이렉션 로직 추가 필요: useNavitage(`/chat/${chatId}`);

        try {
            const response = await axios.post(CHAT_API_URL, {
                messages: updatedHistoryBeforeAI,
            });

            const aiResponse = response.data.response;

            // 5. 최종 AI 응답으로 채팅 기록 업데이트
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
            // 오류 발생 시 메시지 업데이트
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

        if (!message.trim() || loading) return;

        const userMessage = message.trim();
        const chatId = Date.now(); // 새 채팅방 ID 생성

        setMessage(''); // 입력창 비우기

        sendMessage(userMessage, chatId);
    };

    return (
        <section className="section_wrap">
            <div className="main_body_wrap">
                {/* Home 화면: 채팅 기록을 보여주지 않고, 중앙에 Welcome 메시지나 샘플 질문을 표시할 수 있습니다.
                */}
                <div className="empty_state chat_history_wrap">
                    궁금한 내용을 입력하시면 AI가 응답해 드려요.
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

export default Home;