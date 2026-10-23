# 스포디움 온 · Android

제공된 HTML의 기능과 현장 사진을 보존하고, 초록·라임색 모바일 UI와 안드로이드 실행 프로젝트를 추가했습니다. Android의 WebView에 앱 파일을 포함하는 하이브리드 방식이며 네트워크 없이 실행됩니다. Kotlin/Compose로 다시 구현한 네이티브 화면은 아닙니다.

## 사용 가능한 체험 기능

- 홈: 시연 경기·티켓·좌석 찾기·시설 바로가기
- 지도: 1·2층, 검색, 카테고리, 확대·축소·드래그, 시설 상세·사진
- 길찾기: 빠른 길, 혼잡 회피, 계단을 제외한 이동 편의 경로, 이동 애니메이션
- 혼잡도: 경기 상황 4종, 대체 시설 추천, 사용자 제보, 자동 갱신
- 음식: 메뉴·옵션·수량, 장바구니, 픽업 시간, 주문·픽업 상태
- 예약: 가족 휴식시설 시간 선택, 중복 예약 차단, 예약 취소
- 가족 그룹·만남 위치, 야구 안내, 시각 응원 리듬
- 마이: 티켓·주문·예약 내역, 큰 글씨 모드, 초기화, 발표 장면
- Android: 앱 아이콘, 안전영역, 뒤로가기, 기기 내 이용 내역 저장

**원본과 동일하게 경기·좌표·혼잡도·주문·예약·가족 위치는 시연입니다. 실제 GPS 추적, 결제, 매장 주문 전달, 이용자 간 동기화는 없습니다.** 앱 삭제 또는 저장 데이터 초기화 시 내역이 삭제됩니다.

## GitHub에서 APK 빌드

1. 이 폴더의 전체 파일을 GitHub 저장소에 올립니다. `.github` 폴더도 포함해야 합니다.
2. `main` 또는 `master`에 push하면 `Build Android APK`가 실행됩니다.
3. 성공한 실행의 **Artifacts → Spodium-On-Android** ZIP을 다운로드합니다.
4. ZIP의 `app-debug.apk`를 안드로이드 기기로 옮겨 설치합니다.
5. `v1.0.0` 같은 태그를 push하면 APK를 GitHub Releases에도 올립니다.

빌드는 JDK 17 / Gradle 8.9 / Android SDK 35 / Android Gradle Plugin 8.7.3을 사용합니다. `gradle/actions/setup-gradle`이 CI에서 Gradle을 준비합니다. 이 프로젝트에는 Gradle Wrapper 바이너리가 포함되어 있지 않습니다.

현재 APK 설정은 **테스트용 debug 서명**입니다. 다른 CI 실행에서 만들어진 APK는 서명이 달라 앱 업데이트 설치가 안 될 수 있습니다. 계속 배포할 앱은 고정된 서명 키와 release 빌드를 구성해야 합니다. 키는 저장소에 올리지 않고 GitHub Secrets에 보관합니다.

## GitHub Pages 웹 미리보기

저장소 **Settings → Pages → Build and deployment → Source: GitHub Actions**를 선택합니다. `Deploy web preview to GitHub Pages`를 실행하면 `https://계정.github.io/저장소/`로 웹 화면이 배포됩니다. 모든 경로가 상대 경로여서 프로젝트 하위 주소에서도 작동합니다.

Pages는 정적 호스팅입니다. 실제 결제·구장 주문·실시간 데이터 공유를 운영하려면 인증, 데이터베이스, API 서버와 구장/결제 서비스 연동이 별도로 필요합니다. Android 앱은 내장된 파일을 실행하므로 Pages 수정이 기존 APK에 자동 반영되지는 않습니다. 화면을 바꾸면 APK를 다시 빌드합니다.

## 로컬 개발

```text
node tools/verify.cjs
node tools/preview.cjs
```

브라우저에서 `http://127.0.0.1:4173/preview`를 열면 390px 앱 미리보기를 볼 수 있습니다. `/`에서는 전체 화면으로 실행됩니다. 모바일 기기 실제 UI는 Android 빌드 후 확인해야 합니다.

Android Studio에서 이 폴더를 열고 SDK를 설치한 뒤 Sync → Run 또는 Build APK를 실행합니다. 터미널에서는 JDK 17, SDK 35, Gradle 8.9 설정 후 `gradle :app:assembleDebug :app:lintDebug`를 실행합니다. 출력은 `app/build/outputs/apk/debug/app-debug.apk`입니다.

## 수정할 파일

- `app/src/main/assets/mobile.css`: 새 모바일 UI
- `app/src/main/assets/base.css`: 기존 구성요소의 기본 레이아웃
- `app/src/main/assets/application.js`: 원본 HTML에서 추출한 React 실행 번들·사진·기능
- `app/src/main/assets/android.js`: 안드로이드 뒤로가기 연결
- `app/src/main/java/com/spodium/on/MainActivity.java`: 오프라인 Android 호스트
- `.github/workflows`: APK 빌드·릴리스 및 Pages 배포

원본은 이미 번들된 HTML이므로 원래의 React/TypeScript 개발 소스는 포함되어 있지 않습니다. 번들 내 기존 오픈소스 라이선스 주석은 보존했습니다. 사진과 제공된 원본 콘텐츠의 권리는 원 소유자에게 있습니다.

## 검증 상태

Node 검증으로 실행 번들 문법, 포함 파일, 600개 경로 조합, 엘리베이터 경로, 제보, 옵션 금액, 주문·예약·저장·초기화를 확인합니다. APK 컴파일·Android Lint·기기 터치·화면 검증은 GitHub Actions와 실제 기기에서 추가 확인해야 합니다.
