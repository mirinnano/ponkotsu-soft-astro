// フォームを出すかどうか。API の設定（Secrets）が済んだら、ビルド時に PUBLIC_FORMS_ENABLED=1 を渡す。
// 静的プレビュー（GitHub Pages）では API がないので常に出さない。出さない間は X の DM への案内を置く
export const isStaticPreview = import.meta.env.PUBLIC_STATIC_PREVIEW === '1';
export const formsEnabled = !isStaticPreview && import.meta.env.PUBLIC_FORMS_ENABLED === '1';
