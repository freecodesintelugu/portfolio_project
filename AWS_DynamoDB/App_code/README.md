# Students DynamoDB Practice App

A minimal end-to-end web app (HTML/CSS/JS frontend + Node.js/Express backend)
for practicing AWS DynamoDB. It lets you add, view, and delete student records
through a simple form-based GUI.

## Important region note
`ap-south-1a` is an **Availability Zone**, not a region. The AWS **region**
is `ap-south-1` (Asia Pacific - Mumbai). The code uses `ap-south-1`.

## 1. Create the DynamoDB table

Via AWS CLI:
```bash
aws dynamodb create-table \
  --table-name StudentsDB \
  --attribute-definitions AttributeName=StudentId,AttributeType=S \
  --key-schema AttributeName=StudentId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1
```

Or via AWS Console:
1. Go to DynamoDB → Tables → Create table
2. Table name: `StudentsDB`
3. Partition key: `StudentId` (String)
4. Region (top-right region selector): **Asia Pacific (Mumbai) ap-south-1**
5. Leave default settings → Create table

## 2. Configure AWS credentials

The app uses the AWS SDK's default credential chain. Easiest option locally:
```bash
aws configure
```
Enter an IAM user's Access Key ID, Secret Access Key, and set region to `ap-south-1`.

The IAM user/role needs at least this permission on the table:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-south-1:*:table/StudentsDB"
    }
  ]
}
```

## 3. Install dependencies

```bash
cd students-app
npm install
```

## 4. Run the app

```bash
npm start
```

Then open: **http://localhost:3000**

## How it works
- `public/index.html` + `style.css` + `app.js` → the GUI form and table (frontend).
- `server.js` → Express server exposing:
  - `POST /students` – adds a record to DynamoDB
  - `GET /students` – scans and returns all records
  - `DELETE /students/:id` – deletes a record by `StudentId`
- Each form submission generates a unique `StudentId` (UUID) used as the
  DynamoDB partition key.

## Next steps to extend this practice project
- Add an "Edit" feature using `UpdateCommand`.
- Replace `ScanCommand` with `QueryCommand` once you add a secondary index (Scan reads the whole table and isn't efficient at scale).
- Deploy the backend to AWS (e.g., Elastic Beanstalk, EC2, or Lambda + API Gateway) so it runs entirely in the cloud instead of locally.
