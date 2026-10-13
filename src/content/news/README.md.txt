お知らせの書き方（1件1ファイル、.md）

■ ふつうのお知らせ
---
title: タイトル
date: 2026-10-14
link: /works/hesphoros   # 省略可。一覧から飛ばしたい先
---
本文

■ イベント参加（お品書き）… /news/<ファイル名> に詳細ページができ、開催前ならトップに「次の頒布」が出る
---
title: コミックマーケット○○に参加します
date: 2027-11-20            # お知らせを出した日
category: event
summary: 『HesPhoros』体験版を頒布します。
event:
  name: コミックマーケット○○
  date: 2027-12-30          # 参加日
  day: 2日目
  space: 東ヨ-12a
  venue: 東京ビッグサイト
image: ./menu.png      # お品書き画像（同じフォルダに置く）
---
頒布物や価格などの詳細を書く。

■ プレスリリース … category: press と summary を付ける。/press/<ファイル名> に詳細ページ
