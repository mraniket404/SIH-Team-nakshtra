from pathlib import Path

PATCH_ID = (
    "S2A_MSIL2A_20170613T101031_"
    "N9999_R022_T33UUP_26_57"
)

print("Target BigEarthNet patch:")
print(PATCH_ID)

print("\nExpected Sentinel-2 bands:")

bands = [
    "B01",
    "B02",
    "B03",
    "B04",
    "B05",
    "B06",
    "B07",
    "B08",
    "B8A",
    "B09",
    "B11",
    "B12",
]

for band in bands:
    print(
        f"{PATCH_ID}_{band}.tif"
    )