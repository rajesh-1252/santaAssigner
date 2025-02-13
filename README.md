# How to Run the Secret Santa Assignment Program

### 1. **Install Dependencies:**
Run the following command to install all necessary dependencies from `package.json`:
```
npm i
```
This installs all required libraries such as Jest, Nodemon, and other dependencies.

---
### 2. **Run the Program with Default Input:**
Use this command to run the program with the provided input from the `data/` directory:
```
npm run dev
```
The program will execute using the default employee list and store the output in the designated output directory.

---
### 3. **Run the Program with Your Own Files:**
To use your custom input files, run the program with `nodemon` as shown below:
```
nodemon index.js <empListPath> <destinationPath>
```
#### Example:
```
nodemon index.js ./src/data/employeeList.csv ./src/data/previousEmployee.csv
```
- Replace `<empListPath>` with the path to your employee list CSV file.
- Replace `<destinationPath>` with the path where the output should be saved.

---
### 4. **Program Behavior:**
- The program starts without previous year employee data on the first run.
- Once the program executes, it generates output and stores it in the specified `destinationPath`.
- The stored output can be used as previous year data for future runs.

---
### **Note:**
- Ensure that your input files are in CSV format and structured correctly.
- Use `nodemon` for automatic program restarts on file changes.
- Check the output file to verify the assignments.

This completes the instructions for running the Secret Santa assignment program.

