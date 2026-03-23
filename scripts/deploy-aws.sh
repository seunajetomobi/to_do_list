#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="${DIST_DIR:-dist}"
AWS_REGION="${AWS_REGION:-us-east-1}"
GH_OWNER="${GH_OWNER:-unknown-owner}"
GH_REPO="${GH_REPO:-unknown-repo}"
AWS_S3_BUCKET="${AWS_S3_BUCKET:-}"

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Build output directory not found: $DIST_DIR"
  exit 1
fi

if [[ -z "$AWS_S3_BUCKET" ]]; then
  AWS_S3_BUCKET="${GH_OWNER}-${GH_REPO}-web"
fi

AWS_S3_BUCKET="$(echo "$AWS_S3_BUCKET" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9.-' '-')"
AWS_S3_BUCKET="$(echo "$AWS_S3_BUCKET" | sed 's/^-*//; s/-*$//; s/--*/-/g')"

if [[ ${#AWS_S3_BUCKET} -lt 3 || ${#AWS_S3_BUCKET} -gt 63 ]]; then
  echo "Invalid bucket name length after normalization: $AWS_S3_BUCKET"
  exit 1
fi

echo "Using bucket: $AWS_S3_BUCKET"
echo "Using region: $AWS_REGION"

if aws s3api head-bucket --bucket "$AWS_S3_BUCKET" >/dev/null 2>&1; then
  echo "Bucket exists."
else
  echo "Creating bucket..."
  if [[ "$AWS_REGION" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "$AWS_S3_BUCKET"
  else
    aws s3api create-bucket \
      --bucket "$AWS_S3_BUCKET" \
      --create-bucket-configuration "LocationConstraint=$AWS_REGION" \
      --region "$AWS_REGION"
  fi
fi

aws s3api put-public-access-block \
  --bucket "$AWS_S3_BUCKET" \
  --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false

aws s3api put-bucket-ownership-controls \
  --bucket "$AWS_S3_BUCKET" \
  --ownership-controls Rules=[{ObjectOwnership=BucketOwnerPreferred}]

aws s3 website "s3://$AWS_S3_BUCKET" --index-document index.html --error-document index.html

tmp_policy_file="$(mktemp)"
trap 'rm -f "$tmp_policy_file"' EXIT

cat > "$tmp_policy_file" <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$AWS_S3_BUCKET/*"
    }
  ]
}
POLICY

aws s3api put-bucket-policy --bucket "$AWS_S3_BUCKET" --policy "file://$tmp_policy_file"

echo "Syncing build output..."
aws s3 sync "$DIST_DIR" "s3://$AWS_S3_BUCKET" --delete
aws s3 cp "$DIST_DIR/index.html" "s3://$AWS_S3_BUCKET/index.html" --cache-control "no-cache"

WEBSITE_URL="http://${AWS_S3_BUCKET}.s3-website-${AWS_REGION}.amazonaws.com"
echo "Deployment complete: $WEBSITE_URL"

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  {
    echo "aws_bucket=${AWS_S3_BUCKET}"
    echo "website_url=${WEBSITE_URL}"
  } >> "$GITHUB_OUTPUT"
fi
