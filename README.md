# aws-dynamodb-truncate
Simple script to truncate records in a DynamoDB database.  I got tired of doing test loads from Lambda routines and having to check each record via the console to delete.  Hoping that feature shows up soon in the console, but until then, here's what I'm using.

# Usage
~~~
node dynamodb_truncate.js <tablename>
~~~
