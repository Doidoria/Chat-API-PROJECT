import { useLayoutEffect, useRef } from 'react';

/**
 * 텍스트 내용에 따라 textarea의 높이를 자동으로 조절하는 커스텀 훅
 * @param {React.RefObject<HTMLTextAreaElement>} ref - textarea 요소의 ref 객체
 * @param {string} value - textarea의 현재 값 (높이 계산을 위해 필요)
 */
const useAutosizeTextarea = (ref, value) => {
    useLayoutEffect(() => {
        const textarea = ref.current;

        if (textarea) {
            textarea.style.height = 'auto';
            let scrollHeight = textarea.scrollHeight;
            
            // max-height 처리 (CSS에서 지정된 값을 가져와 사용)
            // 주의: window.getComputedStyle을 사용하여 CSS의 max-height를 가져옴
            const computedStyle = window.getComputedStyle(textarea);
            const maxHeight = parseFloat(computedStyle.maxHeight) || Infinity;

            if (scrollHeight > maxHeight) {
                scrollHeight = maxHeight;
                textarea.style.overflowY = 'auto';
            } else {
                textarea.style.overflowY = 'hidden';
            }
            textarea.style.height = scrollHeight + 'px';
        }
    }, [ref, value]);
};

export default useAutosizeTextarea;