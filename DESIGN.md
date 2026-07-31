# GLUX Tour — 디자인 기준 (톤앤매너)

> 모든 랜딩·가이드·화면은 이 기준을 따른다. AI 티 제거 워크플로우(taste-skill / impeccable) 반영.
> 전환 구조·카피 공식은 메모리 `landing-playbook` 참조.

## 브랜드 정체성
- **GLUX (premium Japan Travel)** · 일본 오사카/간사이·홋카이도 프리미엄 맞춤 여행
- 무드: 고급스럽고 신뢰감 있는, 차분한 프리미엄. 저가·요란한 느낌 금지.
- 강점 서사: 일본 현지 30년 · 가이드 10년 베테랑 직영, 대행 마진 0, 100% 맞춤 프라이빗.

## 색 (주조색 하나 + 뉴트럴)
| 용도 | 값 | 비고 |
|---|---|---|
| 주조색(포인트/CTA) | `#b98a3e` ~ `#e0bd6e` (골드) | CTA 배경·큰 제목 강조용 |
| 딥골드(텍스트용) | `#8a6427` | 밝은 배경 위 골드 **작은 텍스트·라벨·아이콘**은 반드시 딥골드(대비 4.5:1). 밝은 골드는 흰/연배경 위 대비 미달 |
| 잉크(본문) | `#141720` | 제목/본문, 회색 본문 금지 |
| 서브텍스트 | `#4a4f5c` | 본문 보조 |
| 다크 섹션 배경 | `#12131d` / `#0c0c14` | WHY·푸터 |
| 배경 | `#f6f4ef`(웜 아이보리) / `#fff` | 섹션 교차 |
| 경고/고통 | `#c0392b` | PAIN 좌측 보더·긴급 뱃지 |

**절대 금지:** 보라(purple/violet)·파랑→보라 그라데이션(대표적 AI 신호), 색 배경 위 회색 본문, 채도 높은 무지개 팔레트.

## 폰트 (한글 필수)
- 본문/제목: **Pretendard** (CDN). 한글 글리프 필수.
- 금지: Inter / Roboto / Geist / Satoshi / 시스템 기본 — 영문 전용 폰트는 한글이 시스템 폴백돼 어색해짐.
- CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.min.css`
- 전역: `word-break:keep-all; text-wrap:balance` (한글 줄바꿈 최적화).

## 레이아웃
- **모바일 우선**: 콘텐츠 컨테이너 `max-width:480~500px` 중앙정렬.
- 섹션 패딩 `clamp(40px,9vw,58px) 22px`.
- **납작한 구조**: 카드 안에 카드 넣지 말 것. 페이지 전체 컨테이너에 그림자 주지 말 것(자식이 전부 중첩카드로 잡힘). 여백·1px 선·배경 틴트로 위계 표현.
- 카드 radius 12~20px, 옅은 그림자 `0 2px 12px rgba(0,0,0,.04)`.
- **좌측 4px 컬러바 + border-radius 조합 지양**(side-tab AI 신호). 강조는 배경 틴트나 아이콘으로.
- 이미지 위 텍스트는 오버레이를 충분히 어둡게(그라데이션 .6~.85) — 이미지 밝은 부분에서도 대비 확보.

## 모션
- `transition` 위주, `.15~.25s`. **바운스(튕김)·과한 spring 금지.**
- 버튼 active `scale(.98)` 또는 hover `translateY(-2px)` 정도.

## AI 티 다섯 가지 (제작 후 매번 점검)
1. 폰트가 Inter/시스템 기본 → **Pretendard 지정**
2. 보라→파랑 그라데이션 → **골드 주조색 하나**
3. 카드 안에 카드 중첩 → **여백·선 납작 구조**
4. 색 배경 위 회색 글자 → **대비 확보한 잉크색**
5. 튕기는 바운스 → **짧고 자연스러운 정지**

## 기계 검사 (선택)
```bash
# 배포된 페이지 검사 (AI 티 자동 탐지)
npx --yes impeccable@latest detect https://gluxtour.com/tour/hokkaido/
# 아무것도 안 나오면 통과. 브랜드 골드가 걸리면 예외 등록:
npx impeccable ignores add-value ai-color-palette "#b98a3e" --reason "브랜드 지정 골드"
```

## 단일 HTML 제약 (랜딩)
- 외부 npm/빌드 도구 없음. CSS/JS 인라인. 폰트만 CDN link. 애니메이션은 순수 CSS.
