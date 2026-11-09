
import requests
import json
import time
from pathlib import Path

# =========================
# KONFIGURASI
# =========================

API_URL = "https://en.wikipedia.org/w/api.php"

HEADERS = {
    "User-Agent": "ELearningUMMCrawler/1.0 (student project)"
}

# Materi berdasarkan 4 ranah E-Learning
MATERI = {
    "RPL": [
        "Software engineering",
        "Object-oriented programming",
        "Algorithms",
        "Database",
        "Software testing"
    ],

    "Game": [
        "Game development",
        "Game design",
        "Unity (game engine)",
        "Unreal Engine",
        "Computer graphics"
    ],

    "Data": [
        "Data science",
        "Artificial intelligence",
        "Machine learning",
        "Data mining",
        "Big data"
    ],

    "Network": [
        "Computer network",
        "Internet protocol suite",
        "OSI model",
        "Computer security",
        "Network security"
    ]
}

OUTPUT_DIR = Path(__file__).parent / "Output"
OUTPUT_FILE = OUTPUT_DIR / "Materi.json"


# =========================
# FUNGSI AMBIL ARTIKEL
# =========================

def ambil_artikel(judul, kategori):

    params = {
        "action": "query",
        "format": "json",
        "prop": "extracts|info",
        "explaintext": True,
        "inprop": "url",
        "titles": judul
    }

    response = requests.get(
        API_URL,
        params=params,
        headers=HEADERS,
        timeout=30
    )

    response.raise_for_status()

    data = response.json()
    pages = data["query"]["pages"]

    for page in pages.values():

        if "missing" in page:
            print(f"Artikel tidak ditemukan: {judul}")
            return None

        return {
            "id": page["pageid"],
            "kategori": kategori,
            "judul": page["title"],
            "url": page["fullurl"],
            "materi": page.get("extract", "")
        }


# =========================
# MAIN CRAWLER
# =========================

def main():

    hasil = []

    for kategori, daftar_judul in MATERI.items():

        print(f"\nMengambil materi kategori: {kategori}")

        for judul in daftar_judul:

            print(f"  Crawling: {judul}")

            try:
                artikel = ambil_artikel(judul, kategori)

                if artikel:
                    hasil.append(artikel)

            except requests.RequestException as error:
                print(f"  Gagal mengambil artikel: {error}")

            time.sleep(1)

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            hasil,
            file,
            ensure_ascii=False,
            indent=4
        )

    print("\nCrawling selesai!")
    print(f"Total materi: {len(hasil)}")
    print(f"File JSON: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
