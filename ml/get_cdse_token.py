import requests
import getpass

username = input("CDSE Email/Username: ")
password = getpass.getpass("CDSE Password: ")

url = (
    "https://identity.dataspace.copernicus.eu"
    "/auth/realms/CDSE/protocol/openid-connect/token"
)

data = {
    "client_id": "cdse-public",
    "username": username,
    "password": password,
    "grant_type": "password",
}

response = requests.post(
    url,
    data=data,
    timeout=60,
)

print("HTTP Status:", response.status_code)

if response.status_code != 200:
    print(response.text)
    raise SystemExit(1)

result = response.json()

print()
print("TOKEN GENERATED SUCCESSFULLY")
print()

with open(
    "cdse_token.txt",
    "w",
    encoding="utf-8",
) as file:
    file.write(
        result["access_token"]
    )

print(
    "Token saved to cdse_token.txt"
)