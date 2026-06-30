const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ---- AWS / DynamoDB config ----
// NOTE: "ap-south-1a" is an Availability Zone, not a region.
// The region for the SDK must be "ap-south-1" (Mumbai).
const REGION = 'ap-south-1';
const TABLE_NAME = 'StudentsDB';

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

// ---- Routes ----

// Create a student
app.post('/students', async (req, res) => {
  const { name, age, course, email } = req.body;

  if (!name || !age || !course || !email) {
    return res.status(400).json({ error: 'name, age, course, and email are all required' });
  }

  const student = {
    StudentId: uuidv4(),       // Partition key
    Name: name,
    Age: Number(age),
    Course: course,
    Email: email,
    CreatedAt: new Date().toISOString()
  };

  try {
    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: student }));
    res.status(201).json(student);
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Read all students
app.get('/students', async (req, res) => {
  try {
    const data = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.json(data.Items || []);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
  try {
    await ddb.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { StudentId: req.params.id }
    }));
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Using DynamoDB table "${TABLE_NAME}" in region "${REGION}"`);
});
