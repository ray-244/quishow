const path = require("path");

class UploadHelper {
  static getUploadUrl(file) {
    if (!file) return null;

    const uploadUrl = `/uploads/${file.filename}`;
    console.log("📤 URL gerada:", uploadUrl);
    return uploadUrl;
  }

  static getUploadUrlFromField(files, fieldName) {
    if (!files || !files[fieldName] || !files[fieldName][0]) {
      return null;
    }

    const file = files[fieldName][0];

    return `/uploads/${file.filename}`;
  }

  static isRelativeUrl(url) {
    return url && url.startsWith("/");
  }

  static formatUrlForDb(urlOrPath) {
    if (!urlOrPath) return null;

    // Se já é URL relativa, retorna como está
    if (this.isRelativeUrl(urlOrPath)) {
      return urlOrPath;
    }

    // Se é URL externa (http/https), retorna como está
    if (urlOrPath.startsWith("http")) {
      return urlOrPath;
    }

    // Se é path local, converte para URL relativa
    // Exemplo: /workspaces/Quishow-TCC/src/public/uploads/file.jpg → /uploads/file.jpg
    if (urlOrPath.includes("uploads")) {
      const filename = path.basename(urlOrPath);
      return `/uploads/${filename}`;
    }

    return urlOrPath;
  }

  static formatUrlForView(url) {
    if (!url) return null;

    // Se já é URL relativa, retorna como está (HTML irá resolver)
    if (this.isRelativeUrl(url)) {
      return url;
    }

    // Se é URL externa, retorna como está
    if (url.startsWith("http")) {
      return url;
    }

    // Fallback: trata como relativa
    return `/${url}`.replace(/\/+/g, "/");
  }
}

module.exports = UploadHelper;
