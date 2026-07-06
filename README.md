# annhylee.github.io

이혜연 포트폴리오 사이트. [Jekyll](https://jekyllrb.com/) 구조로 되어 있어 **내용과 디자인이 분리**되어 있습니다. GitHub에 push하면 자동으로 빌드·배포됩니다 (별도 설정 불필요).

## 내용 수정하는 법

디자인은 건드릴 필요 없이, 아래 파일들만 수정하면 됩니다. github.com에서 파일을 열고 연필 아이콘(✏️)으로 직접 편집해도 자동 반영됩니다 (반영까지 1~10분).

| 수정할 내용 | 파일 |
|---|---|
| 자기소개 문단 (About) | `index.md` |
| 이름, 타이핑 문구, 히어로 소개, 연락처, 자격/경력 카드 | `_data/profile.yml` |
| 커리어 타임라인 | `_data/career.yml` |
| 앵커·MC 클립 카드 | `_data/clips.yml` |
| 언론 커버리지 목록 | `_data/media.yml` |
| 프로필 사진 교체 | `_data/profile.yml`의 `photo:` 값 |

### 자주 하는 수정 예시

**커리어 항목 추가** — `_data/career.yml` 맨 위에:

```yaml
- year_from: "2027"
  org: 새 소속
  role: 새 역할
  desc: 설명 문장.
```

**클립에 영상 연결** — `_data/clips.yml`에서 `url: ""`을 실제 주소로:

```yaml
url: "https://youtube.com/watch?v=..."
```

유튜브 링크(`youtu.be/`, `watch?v=`, `/live/`, `/shorts/` 등)를 넣으면 카드에 썸네일이 자동으로 표시됩니다.

**기사 링크 연결** — `_data/media.yml`에서도 같은 방식으로 `url`을 채우면 해당 줄이 클릭 가능해집니다.

**이메일 교체** — `_data/profile.yml`의 `contact:` 아래 `your@email.com` 두 곳을 실제 주소로.

### 주의사항

- YAML에서 값에 `:` 뒤 공백, `#`, 맨 앞 `@`/`+` 등이 들어가면 따옴표로 감싸주세요: `value: "@HYEDLINE"`
- 내용에 `{{` 또는 `{%` 문자는 쓰지 마세요 (템플릿 문법으로 해석됨).
- `<뉴스5>`, `<HHBS>` 같은 꺾쇠 표기는 그대로 화면에 표시됩니다 (자동 이스케이프 처리).

## 디자인 수정하는 법

| 수정할 부분 | 파일 |
|---|---|
| 색상, 글꼴, 간격 등 스타일 전체 | `assets/css/main.css` (맨 위 `:root` 변수에 색상 정의) |
| 페이지 뼈대, 섹션 순서 | `_layouts/default.html` |
| 각 섹션의 HTML 구조 | `_includes/*.html` |
| 애니메이션 동작 | `assets/js/main.js` |

## 로컬 미리보기 (선택)

필수는 아닙니다 — push하면 GitHub가 알아서 빌드합니다. 로컬에서 미리 보고 싶다면:

```bash
sudo apt install ruby-full build-essential zlib1g-dev
gem install bundler
echo 'source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins' > Gemfile
bundle install
bundle exec jekyll serve   # http://localhost:4000
```
