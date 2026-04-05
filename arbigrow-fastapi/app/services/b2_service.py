import boto3
import uuid
from fastapi import UploadFile
from app.core.config import settings
from botocore.client import Config
# from datetime import timedelta


s3_client = boto3.client(
    "s3",
    endpoint_url=settings.B2_ENDPOINT,
    aws_access_key_id=settings.B2_KEY_ID,
    aws_secret_access_key=settings.B2_APPLICATION_KEY,
    region_name="us-west-004",
    config=Config(signature_version="s3v4"),
)


async def upload_to_b2(file: UploadFile, folder: str) -> str:
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    object_key = f"{folder}/{unique_filename}"

    content = await file.read()

    s3_client.put_object(
        Bucket=settings.B2_BUCKET_NAME,
        Key=object_key,
        Body=content,
        ContentType=file.content_type,
    )

    return object_key


def generate_presigned_url(object_key: str | None):
    if not object_key:
        return None

    return s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": settings.B2_BUCKET_NAME,
            "Key": object_key,
        },
        ExpiresIn=3600,  # 1 hour
    )
