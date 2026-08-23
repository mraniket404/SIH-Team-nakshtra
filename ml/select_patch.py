import pandas as pd

CSV_PATH = "big_earth_net.csv"

TARGET_PATCH = (
    "S2A_MSIL2A_20170613T101031_"
    "N9999_R022_T33UUP_26_57"
)

df = pd.read_csv(CSV_PATH)

print("Total records:", len(df))

matches = df[
    df["patch_id"] == TARGET_PATCH
]

if matches.empty:
    print("Patch not found.")
    raise SystemExit(1)

print("\nPatch found:\n")

columns = [
    "patch_id",
    "s1_name",
    "input",
    "output",
    "type",
    "category",
    "split",
    "latitude",
    "longitude",
    "country",
]

available = [
    col for col in columns
    if col in matches.columns
]

print(
    matches[available].to_string(
        index=False
    )
)