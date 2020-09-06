# Assignment (v1.0.0)

This package contains the base code for the interview assignment.<br>
You can add additional library that will aid you in fulfiling the requirements.
<br>
<br>
Please read through NodeJS_Assessment_v2.docx carefully before you attempt.

## Prerequisites
- NodeJS v12.18.1
- Docker v6.14.5

<br>

## Package Structure
| S/N | Name | Type | Description |
|-----|------|------|-------------|
| 1 | external | dir | This holds the code for building external system which is required for question 2.<br><b>There is no need to modify anything inside or start it manually</b>
| 2 | javascript | dir | This holds the base code which you should extend in order to fulfil the requirements |
| 3 | NodeJS_Assessment_v2.docx | file | The specification for the assignment |
| 4 | README.md | file | This file |
| 5 | data.sample.csv | file | Sample csv for question 1 |
| 6 | school-administration-system.postman_collection.json | file | Postman script for uploading file |

<br>

## Exposed Port
| S/N | Application | Exposed Port |
|-----|-------------|--------------|
| 1 | database | 3306 |
| 2 | external | 5000 |
| 3 | application | 3000 |

<br>

## Commands
All the commands listed should be ran in ./javascript directory.

### Installing dependencies
```bash
npm install
the packages are listed inside package.json, please ensure all of them are installed prior the program execution.
```


<br>

### Starting Project
Starting the project in local environment.
This will start all the dependencies services i.e. database and external (folder).
```bash
npm start
```

<br>

### Running in watch mode
This will start the application in watch mode.
```bash
npm run start:dev
```

<br>

### Check local application is started
You should be able to call (GET) the following endpoint and get a 200 response

```
http://localhost:3000/api/healthcheck
```

<br>

### Check external system is started
You should be able to call (POST) the following endpoint and get a 200 response
```
http://localhost:5000/students?class=2&offset=1&limit=2
```

<br>

****************************************************************************
### Instructions for running the local instance of the API servers
It is recommended to launch the API in Postman by inputting correct params, headers and body.

#### Question 1: DataUpload API
##### The code running this API is in javascript/src/controllers/DataImportController.js

Before uploading the csv file into database, you can create, update delete record(s) inside csv file, set toDelete = 1 if you do not want to record to be committed into database.
Please be aware that the teacherEmail, studentEmail, classCode and subjectCode cannot be null, otherwise the row of record will not be uploaded into database.
The teacherEmail and studentEmail must be also unique and used by one teacher/student, the row of record will not be uploaded in the event of duplication of email.


In Postman
1) In Headers section, set the key and value to be Content-Type and multipart/form-data respectively.
2) In Body, set the key to be 'data', and the value to be a file instead of text, then browse data.sample.csv file.
3) Send POST request to localhost:3000/api/upload.
4) The status code will be 200 if no error occurs, then check whether the content is uploaded to localhost:3306 table "schools" inside "school-administration-system" database.

In browser
1) Browse the data.sample.csv then select upload.

#####Error handling: Corresponding error status code will be shown in Postman if error occurs.


#### Question 2: StudentListing API
##### The code running this API is in javascript/src/controllers/StudentListingController.js
In Postman
1) Inside Params section, set offset and limit value respectively, or insert inside url endpoint probably.
2) Send GET request to the endpoint address, for example localhost:3000/api/class/P1-1/students?offset=3&limit=10.

####Error handling:
1) The status code will be 204 if no error occurs.
2) The error status code will be 503 if internal database or external database is/are unreachable.


#### Question 3: ClassCode API
##### The code running this API is in javascript/src/controllers/ClassCodeController.js
In Postman
1) Inside Body section, set className as key and the new class name to be value.
2) Send PUT request to the endpoint address, for example localhost:3000/api/class/P1-1.

#####Error handling:
1) The status code will be 204 if no error occurs.
2) The error status code will be 503 if internal database is unreachable.


#### Question 4: TeacherReport API
##### The code running this API is in javascript/src/controllers/TeacherReportController.js
In Postman
1) Send GET request to the endpoint address, for example localhost:3000/api/report/workload, no params or body element required.

#####Error handling:
1) The status code will be 200 if no error occurs.
2) The error status code will be 503 if internal database is unreachable.


## Extras

### Database
You can place your database migration scripts in javascript/database folder. <br>
It will be ran the first time MySQL docker container is first initialised. <br><br>
Please provide the instruction on how to initialise the database if you are not using the above method.

<br>

## FAQ

### Error when starting up
If you encounter the following error when running ```npm start```, it is due to the slow startup of your database container.<br>
Please run ```npm start``` again.

```
[server.js]	ERROR	SequelizeConnectionError: Connection lost: The server closed the connection.
[server.js]	ERROR	Unable to start application
```

<br>

### How do I upload file to /api/upload?
You can import the included postman script (school-administration-system.postman_collection.json) into your postman.
