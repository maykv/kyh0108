document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function() {
        dropdownContent.style.display = 'none';
    });

    const icons = document.querySelectorAll('.icon');
    let currentPopup = null; // 현재 팝업을 추적
    let currentZIndex = 1000; // 현재 z-index

    // 아이콘 클릭 이벤트 처리
    icons.forEach((icon) => {
        icon.addEventListener('click', function() {
            const iconId = icon.id.split('-')[1]; // 아이콘 ID에서 숫자 추출 (icon-1, icon-2 등)
            const iconLabel = icon.querySelector('.icon-label').textContent; // 아이콘 레이블 텍스트
            let info = '';

            if (icon.id === 'profile-icon') {
                // 프로필 아이콘 클릭 시 프로필 정보로 업데이트
                info = createProfileContent();
            } else {
                // 이미 정의된 아이콘 클릭 시
                info = createIconPopupContent(iconId);
            }

            // 새로운 팝업 창 생성
            updatePopup(createPopupContent(iconLabel, info));
        });
    });

    // 네비게이션 바 링크 클릭 이벤트 처리
    document.querySelector('.navbar a[href="#"]').addEventListener('click', function(event) {
        event.preventDefault(); // 기본 링크 동작 방지
        updatePopup(createNotAvailableContent());
    });

    const infoLink = document.querySelector('.navbar a[href="#"]:nth-child(3)'); // "정보" 링크
    const contactLink = document.querySelector('.navbar a[href="#"]:nth-child(4)'); // "문의하기" 링크

    infoLink.addEventListener('click', function(event) {
        event.preventDefault(); // 기본 링크 동작 방지
        updatePopup(createNotAvailableContent());
    });

    contactLink.addEventListener('click', function(event) {
        event.preventDefault(); // 기본 링크 동작 방지
        updatePopup(createNotAvailableContent());
    });

    function createProfileContent() {
        return `
            <div class="popup-content">
                <img src="images/profile_a.png" alt="프로필 사진" class="profile-pic" />
                <div class="info">
                    <p><strong>이름:</strong> 김영환 <small>(a.k.a 영환띠)</small></p>
                    <p><strong>생일:</strong> 1월 8일</p>
                    <p><strong>주 컨텐츠:</strong> 마인크래프트</p>
                    <p><strong>소개:</strong> 커맨드를 조금 아는 일반인</p>
                    <p><a href="https://www.youtube.com/@kyh0108" target="_blank">유튜브</a> <a href="https://app.bsky.cz/profile/kyh0108.bsky.social" target="_blank">Bluesky</a></p>
                </div>
            </div>
        `;
    }

    function createIconPopupContent(iconId) {
        // 각 아이콘에 대한 내용을 정의
        const iconContents = {
            '2': `
                <div class="popup-content">
                    <div class="info">
                        <p><h3>추가 예정!</h3></p>
                    </div>
                </div>
            `,
            '3': `
                <div class="popup-content">
                    <div class="info">
                        <h3>대빵</h3>
                        <p><strong>바보</strong>: 김영환</p>
                        <h3>사운드</h3>
                        <p><strong>믹싱</strong>: 김메이</p>
                        <p><strong>작곡</strong>: 김메이</p>
                        <p><strong>남자 보컬</strong>: 초코섬</p>
                        <h3>그래픽</h3>
                        <p><strong>일러스트레이터</strong>: ebeb</p>
                        <p><strong>서브 일러스트레이터</strong>: 연어초밥밥밥</p> 
                        <p><strong>디자인</strong>: 김메이</p>    
                        <h3>영상</h3>
                        <p><strong>애니메이팅</strong>: 김영환</p>
                        <p><strong>편집</strong>: 김영환</p>
                        <p><strong>커버송 편집</strong>: 김메이</p>
                        <br>
                        <small>사이트 제작: 김메이</small>
                    </div>
                </div>
            `
        };
        return iconContents[iconId] || '<p>정보가 없습니다.</p>'; // 기본 메시지
    }

    function createNotAvailableContent() {
        return `
            <div class="popup-content">
                <div class="info">
                    <h3>아직 만들어지지 않은 기능입니다.</h3>
                    <p>해당 기능은 현재 개발 중입니다. 조금만 기다려 주세요!</p>
                </div>
            </div>
        `;
    }

    function createPopupContent(title, content) {
        return `
            <div class="popup-header">
                <span>${title}</span>
                <button class="close-btn">&times;</button>
            </div>
            ${content}
        `;
    }

    function updatePopup(content) {
        if (!currentPopup) {
            currentPopup = document.createElement('div');
            currentPopup.classList.add('popup');
            document.body.appendChild(currentPopup);
            setPopupStyles(currentPopup);
        }

        currentPopup.innerHTML = content; // 팝업 내용 업데이트
        currentPopup.style.display = 'block'; // 팝업 표시

        const closeBtn = currentPopup.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            currentPopup.style.display = 'none'; // 팝업 숨기기
        });

        let isDragging = false;
        let offsetX, offsetY;

        // 드래그 이벤트 핸들러
        function startDrag(e) {
            isDragging = true;
            offsetX = e.clientX - currentPopup.getBoundingClientRect().left;
            offsetY = e.clientY - currentPopup.getBoundingClientRect().top;
            document.body.style.cursor = 'move';
        }

        function dragPopup(e) {
            if (isDragging) {
                currentPopup.style.left = (e.clientX - offsetX) + 'px';
                currentPopup.style.top = (e.clientY - offsetY) + 'px';
            }
        }

        function endDrag() {
            isDragging = false;
            document.body.style.cursor = 'default';
        }

        currentPopup.querySelector('.popup-header').addEventListener('mousedown', startDrag);
        currentPopup.addEventListener('touchstart', startDrag); // 터치 시작 이벤트 추가

        document.addEventListener('mousemove', dragPopup);
        document.addEventListener('mouseup', endDrag);

        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                const touch = e.touches[0];
                currentPopup.style.left = (touch.clientX - offsetX) + 'px';
                currentPopup.style.top = (touch.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('touchend', endDrag); // 터치 종료 이벤트 추가

        currentPopup.addEventListener('click', function() {
            currentZIndex++; // z-index 증가
            currentPopup.style.zIndex = currentZIndex; // z-index 설정
        });
    }

    function setPopupStyles(popup) {
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#cad1da';
        popup.style.border = '1px solid #6f85a0';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = currentZIndex; // 팝업의 초기 z-index 설정
        popup.style.width = '90%'; // 모바일 화면에 적합하도록 너비 조정
        popup.style.maxWidth = '600px'; // 최대 너비 설정
        popup.style.display = 'none'; // 초기 상태는 숨김
    }
});
