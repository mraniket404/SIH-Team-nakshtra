import requests

URL = (
    "https://zenodo.org/records/10891137/files/"
    "BigEarthNet-S2.tar.zst?download=1"
)

response = requests.head(
    URL,
    allow_redirects=True,
    timeout=30,
)

print("Status:", response.status_code)
print("Final URL:", response.url)
print("Content-Length:", response.headers.get("Content-Length"))
print("Accept-Ranges:", response.headers.get("Accept-Ranges"))
print("Content-Type:", response.headers.get("Content-Type"))