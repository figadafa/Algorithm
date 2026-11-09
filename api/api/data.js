const METADATA_FIELDS = ["id", "kategori", "judul", "url"];

let dataCache = null;

/**
 * Memuat data.json satu kali per instance function.
 * require() dengan path literal membuat file JSON ikut ter-bundle oleh Vercel.
 */
function loadData() {
  if (!dataCache) {
    dataCache = require("../data.json");
  }

  return dataCache;
}

function setCommonHeaders(res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, statusCode, body) {
  setCommonHeaders(res);
  res.statusCode = statusCode;
  res.end(JSON.stringify(body));
}

function firstQueryValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0]).trim() : "";
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function pickMetadata(item) {
  const metadata = {};

  for (const field of METADATA_FIELDS) {
    metadata[field] = item[field];
  }

  return metadata;
}

module.exports = function handler(req, res) {
  try {
    const method = String(req.method || "GET").toUpperCase();

    if (method === "OPTIONS") {
      setCommonHeaders(res);
      res.statusCode = 204;
      res.end();
      return;
    }

    if (method !== "GET") {
      setCommonHeaders(res);
      res.setHeader("Allow", "GET, OPTIONS");
      res.statusCode = 405;
      res.end(
        JSON.stringify({
          success: false,
          message: "Method not allowed",
        })
      );
      return;
    }

    const query = req.query || {};
    const id = firstQueryValue(query.id);
    const kategori = firstQueryValue(query.kategori);

    let results = loadData();

    if (id !== "") {
      results = results.filter((item) => String(item.id) === id);
    }

    if (kategori !== "") {
      const kategoriLower = kategori.toLowerCase();
      results = results.filter(
        (item) => String(item.kategori).toLowerCase() === kategoriLower
      );
    }

    if (id !== "" && results.length === 0) {
      sendJson(res, 404, {
        success: false,
        message: "Data tidak ditemukan",
      });
      return;
    }

    const responseData =
      id !== "" ? results : results.map((item) => pickMetadata(item));

    sendJson(res, 200, {
      success: true,
      total: results.length,
      data: responseData,
    });
  } catch (error) {
    console.error("API error:", error);

    if (!res.headersSent) {
      sendJson(res, 500, {
        success: false,
        message: "Internal server error",
      });
    } else {
      res.end();
    }
  }
};
