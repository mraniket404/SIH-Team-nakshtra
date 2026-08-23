import pandas as pd

PATCH_ID = "S2A_MSIL2A_20170613T101031_N9999_R022_T33UUP_26_57"

df = pd.read_parquet("bigearthnet_metadata.parquet")

print("Total metadata records:", len(df))

matches = df[
    df["patch_id"].astype(str) == PATCH_ID
]

if matches.empty:
    print("\nPATCH NOT FOUND")
else:
    print("\nPATCH FOUND\n")
    print(matches.to_string(index=False))