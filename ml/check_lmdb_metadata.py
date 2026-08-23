import pandas as pd
from huggingface_hub import hf_hub_download

PATCH_ID = (
    "S2A_MSIL2A_20170613T101031_"
    "N9999_R022_T33UUP_26_57"
)

metadata_path = hf_hub_download(
    repo_id="hackelle/BigEarthNetV2-LMDB",
    filename="metadata.parquet",
    repo_type="dataset",
)

df = pd.read_parquet(metadata_path)

print("Columns:")
print(df.columns.tolist())

print("\nRows:", len(df))

print("\nSearching exact patch...")

matches = df[
    df.astype(str)
      .apply(
          lambda row: row.str.contains(
              PATCH_ID,
              regex=False
          ).any(),
          axis=1,
      )
]

if matches.empty:
    print("PATCH NOT FOUND")
else:
    print("PATCH FOUND")
    print(matches.to_string(index=False))