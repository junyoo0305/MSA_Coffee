-- ==========================================
-- 1. 메뉴 데이터 입력 (ID 1 ~ 4)
-- ==========================================
INSERT INTO MENUS (ID, NAME, DESCRIPTION, PRICE, STOCK_ID, IMAGE_URL) VALUES
(1, '아메리카노', '시원한 고소한 원두의 아메리카노', 4000, 1, '/images/아메리카노.jpg'),
(2, '카페라떼', '부드러운 우유와 에스프레소의 조화', 4500, 2, '/images/카페라떼.jpg'),
(3, '연유라떼', '달콤한 연유가 들어간 라떼', 5000, 3, '/images/연유라떼.jpg'),
(4, '딸기 스무디', '상큼하고 시원한 딸기 스무디', 6000, 4, '/images/딸기스무디.png');

-- ==========================================
-- 2. 옵션 그룹 데이터 입력 (각 메뉴당 온도/사이즈 그룹 생성)
-- ==========================================
-- 메뉴 1 (아메리카노)용 그룹
INSERT INTO OPTION_GROUPS (ID, MENU_ID, NAME) VALUES (1, 1, '온도');
INSERT INTO OPTION_GROUPS (ID, MENU_ID, NAME) VALUES (2, 1, '사이즈');

-- 메뉴 2 (카페라떼)용 그룹
INSERT INTO OPTION_GROUPS (ID, MENU_ID, NAME) VALUES (3, 2, '온도');
INSERT INTO OPTION_GROUPS (ID, MENU_ID, NAME) VALUES (4, 2, '사이즈');

-- 메뉴 3 (연유라떼)용 그룹
INSERT INTO OPTION_GROUPS (ID, MENU_ID, NAME) VALUES (5, 3, '온도');
INSERT INTO OPTION_GROUPS (ID, MENU_ID, NAME) VALUES (6, 3, '사이즈');

-- 메뉴 4 (딸기 스무디)용 그룹
INSERT INTO OPTION_GROUPS (ID, MENU_ID, NAME) VALUES (7, 4, '온도');
INSERT INTO OPTION_GROUPS (ID, MENU_ID, NAME) VALUES (8, 4, '사이즈');

-- ==========================================
-- 3. 옵션 상세 데이터 입력
-- ==========================================

-- 메뉴 1 (아메리카노) 옵션
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (1, 1, 'Hot', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (2, 1, 'Ice', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (3, 2, 'Regular', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (4, 2, 'Size Up', 500);

-- 메뉴 2 (카페라떼) 옵션
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (5, 3, 'Hot', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (6, 3, 'Ice', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (7, 4, 'Regular', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (8, 4, 'Size Up', 500);

-- 메뉴 3 (연유라떼) 옵션
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (9, 5, 'Hot', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (10, 5, 'Ice', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (11, 6, 'Regular', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (12, 6, 'Size Up', 500);

-- 메뉴 4 (딸기 스무디) 옵션
-- (스무디는 보통 Ice만 있지만, 구조 통일을 위해 Hot도 넣었습니다. 필요 없으면 지우셔도 됩니다.)
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (13, 7, 'Hot', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (14, 7, 'Ice', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (15, 8, 'Regular', 0);
INSERT INTO OPTIONS (ID, GROUP_ID, NAME, ADDITIONAL_PRICE) VALUES (16, 8, 'Size Up', 500);

-- ==========================================
-- 4. ID 시퀀스 재설정 (중복 오류 방지)
-- ==========================================
-- 메뉴가 4개 들어갔으므로 다음은 5번부터
ALTER TABLE MENUS ALTER COLUMN ID RESTART WITH 5;

-- 옵션 그룹이 8개 들어갔으므로 다음은 9번부터
ALTER TABLE OPTION_GROUPS ALTER COLUMN ID RESTART WITH 9;

-- 옵션이 16개 들어갔으므로 다음은 17번부터
ALTER TABLE OPTIONS ALTER COLUMN ID RESTART WITH 17;