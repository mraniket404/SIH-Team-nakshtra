from pathlib import Path

import lmdb


PATCH_ID = (
    "S2A_MSIL2A_20170613T101031_"
    "N9999_R022_T33UUP_26_57"
)

REPO_DIR = Path("BENv2.lmdb")


if not REPO_DIR.exists():
    raise FileNotFoundError(
        "BENv2.lmdb is not available locally. "
        "Do not download the whole repository yet."
    )


env = lmdb.open(
    str(REPO_DIR),
    readonly=True,
    lock=False,
    readahead=False,
)

with env.begin() as txn:
    value = txn.get(
        PATCH_ID.encode("utf-8")
    )

if value is None:
    print(
        "Patch exists in metadata but "
        "was not found using this LMDB key."
    )
else:
    print("PATCH DATA FOUND")
    print("Bytes:", len(value))