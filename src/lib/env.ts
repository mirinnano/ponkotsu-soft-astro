// GitHub Pages などの静的プレビューでは API がないため、フォームを案内に差し替える
export const isStaticPreview = import.meta.env.PUBLIC_STATIC_PREVIEW === '1';
